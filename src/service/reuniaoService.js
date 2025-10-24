import reuniaoModel from '../model/reuniaoModel.js';
import { meetingRoomModel } from '../model/meetingRoomModel.js';
import contratoModel from '../model/contractModel.js';
import participanteReuniaoModel from '../model/participanteReuniaoModel.js';
import { userModel } from '../model/userModel.js';
import { notificationsService } from './notificationsService.js';
import { sendMeetingScheduledEmail } from '../mailer.js';

const DEFAULT_DURATION_MINUTES = 60;

function parseTimeToMinutes(timeString) {
  if (!timeString) {
    return null;
  }

  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes + (Number.isNaN(seconds) ? 0 : Math.floor(seconds / 60));
}

function minutesToTimeString(minutes) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function resolveDuration({ hora, horaFim, durationMinutes }) {
  const startMinutes = parseTimeToMinutes(hora);
  let duration = Number(durationMinutes);

  if (!duration && horaFim) {
    const endMinutes = parseTimeToMinutes(horaFim);
    if (startMinutes != null && endMinutes != null) {
      duration = endMinutes - startMinutes;
    }
  }

  if (!duration || duration <= 0) {
    duration = DEFAULT_DURATION_MINUTES;
  }

  const endMinutes = startMinutes != null ? startMinutes + duration : null;

  return {
    duration,
    endMinutes,
    normalizedHoraFim: endMinutes != null ? minutesToTimeString(endMinutes) : horaFim || null,
  };
}

async function ensureParticipantsAvailability({
  participantIds,
  meetingDate,
  startMinutes,
  endMinutes,
}) {
  if (!participantIds.length || startMinutes == null || endMinutes == null) {
    return;
  }

  const meetings = await reuniaoModel.findManyWithParticipants({
    date: meetingDate,
    participantIds,
  });

  const overlapping = meetings.filter((meeting) => {
    const meetingStart = parseTimeToMinutes(meeting.hora) ?? 0;
    const existingDuration = meeting.durationMinutes || DEFAULT_DURATION_MINUTES;
    const meetingEnd = meeting.horaFim ? parseTimeToMinutes(meeting.horaFim) : meetingStart + existingDuration;

    return meetingStart < endMinutes && meetingEnd > startMinutes;
  });

  if (overlapping.length > 0) {
    const titles = overlapping.map((m) => m.titulo || `Reunião #${m.id_reuniao}`);
    throw new Error(`Existem conflitos de agenda para os participantes selecionados: ${titles.join(', ')}`);
  }
}

async function ensureRoomAvailability({
  roomId,
  meetingDate,
  startMinutes,
  endMinutes,
}) {
  if (!roomId || startMinutes == null || endMinutes == null) {
    return;
  }

  const meetings = await reuniaoModel.findManyByRoom({
    roomId,
    date: meetingDate,
  });

  const overlapping = meetings.filter((meeting) => {
    const meetingStart = parseTimeToMinutes(meeting.hora) ?? 0;
    const existingDuration = meeting.durationMinutes || DEFAULT_DURATION_MINUTES;
    const meetingEnd = meeting.horaFim ? parseTimeToMinutes(meeting.horaFim) : meetingStart + existingDuration;

    return meetingStart < endMinutes && meetingEnd > startMinutes;
  });

  if (overlapping.length > 0) {
    const titles = overlapping.map((m) => m.titulo || `Reunião #${m.id_reuniao}`);
    throw new Error(`A sala selecionada já está reservada no horário informado: ${titles.join(', ')}`);
  }
}

async function agendarReuniao(reuniaoData = {}, organizerId) {
  const {
    empresa_id,
    data,
    hora,
    horaFim,
    durationMinutes,
    presencial,
    local,
    roomId,
    contratoId,
    pauta,
    titulo,
    participantes,
    status,
  } = reuniaoData;

  if (!empresa_id) {
    throw new Error('O ID da empresa é obrigatório para o agendamento.');
  }

  if (!data || !hora) {
    throw new Error('Data e hora de início são obrigatórias para o agendamento.');
  }

  const meetingDate = new Date(data);
  if (Number.isNaN(meetingDate.getTime())) {
    throw new Error('Data inválida.');
  }

  const participantIdsRaw = Array.isArray(participantes) ? participantes.map(Number).filter(Boolean) : [];

  if (!participantIdsRaw.length) {
    throw new Error('Informe os participantes da reunião.');
  }

  const participantIds = Array.from(
    new Set([
      ...participantIdsRaw,
      organizerId ? Number(organizerId) : null,
    ].filter(Boolean)),
  );

  const { duration, endMinutes, normalizedHoraFim } = resolveDuration({ hora, horaFim, durationMinutes });
  const startMinutes = parseTimeToMinutes(hora);

  await ensureParticipantsAvailability({
    participantIds,
    meetingDate,
    startMinutes,
    endMinutes,
  });

  let roomRecord = null;
  if (presencial && roomId) {
    roomRecord = await meetingRoomModel.findById(Number(roomId));
    if (!roomRecord) {
      throw new Error('Sala informada não foi encontrada.');
    }

    await ensureRoomAvailability({
      roomId: roomRecord.id,
      meetingDate,
      startMinutes,
      endMinutes,
    });
  }

  if (contratoId) {
    const contrato = await contratoModel.findById(Number(contratoId));
    if (!contrato) {
      throw new Error('Contrato associado não encontrado.');
    }
  }

  const meetingToCreate = {
    empresa_id,
    titulo,
    data: meetingDate,
    hora,
    horaFim: normalizedHoraFim,
    durationMinutes: duration,
    presencial,
    local,
    roomId: roomRecord ? roomRecord.id : null,
    contratoId: contratoId ? Number(contratoId) : null,
    pauta,
    status: status || 'Agendada',
  };

  const createdMeeting = await reuniaoModel.create(meetingToCreate);

  await participanteReuniaoModel.addMany(
    participantIds.map((participantId) => ({
      id_reuniao: createdMeeting.id_reuniao,
      id_usuario: participantId,
      id_empresa: empresa_id,
    })),
  );

  const participants = await userModel.findByIds(participantIds);

  const notifications = participants.map((participant) =>
    notificationsService.create({
      userId: participant.id,
      message: `Você foi convidado para a reunião "${titulo || createdMeeting.id_reuniao}" em ${meetingDate.toLocaleDateString('pt-BR')}.`,
    }),
  );

  const emailPromises = participants.map((participant) =>
    sendMeetingScheduledEmail({
      to: participant.email,
      name: participant.fullName || participant.name || participant.email,
      meeting: {
        titulo,
        data: meetingDate,
        hora,
        horaFim: normalizedHoraFim,
        durationMinutes: duration,
        presencial,
        local,
        roomName: roomRecord?.name ?? null,
        pauta,
      },
    }),
  );

  await Promise.allSettled([...notifications, ...emailPromises]);

  return {
    ...createdMeeting,
    horaFim: normalizedHoraFim,
    durationMinutes: duration,
    participantes: participantIds,
    room: roomRecord,
  };
}

const getReuniaoById = async (id) => {
  const reuniao = await reuniaoModel.findById(id);
  if (!reuniao) {
    throw new Error('Reunião não encontrada.');
  }
  return reuniao;
};

const getAllReunioes = async () => {
  return reuniaoModel.findAll();
};

const updateReuniao = async (id, reuniaoData) => {
  return reuniaoModel.update(id, reuniaoData);
};

const deleteReuniao = async (id) => {
  const reuniao = await reuniaoModel.findById(id);
  if (!reuniao) {
    throw new Error('Reunião não encontrada para exclusão.');
  }
  return reuniaoModel.remove(id);
};

export default {
  agendarReuniao,
  getReuniaoById,
  getAllReunioes,
  updateReuniao,
  deleteReuniao,
};
