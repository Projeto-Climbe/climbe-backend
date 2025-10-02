import prisma from '../utils/prismaClient.js';

function parseReferenceDate(input) {
  if (!input) {
    return new Date();
  }

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Data de referência inválida.');
  }

  return date;
}

function startOfWeek(date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day + 6) % 7; // transforma domingo(0) em 6, segunda(1) em 0
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfWeek(date) {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);
  return result;
}

function startOfMonth(date) {
  const result = new Date(date.getFullYear(), date.getMonth(), 1);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfMonth(date) {
  const result = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  result.setHours(23, 59, 59, 999);
  return result;
}

function normalizeMeeting(meeting) {
  return {
    id: meeting.id_reuniao,
    title: meeting.titulo,
    date: meeting.data,
    startTime: meeting.hora,
    endTime: meeting.horaFim,
    durationMinutes: meeting.durationMinutes,
    presencial: meeting.presencial,
    local: meeting.local,
    room: meeting.room ? { id: meeting.room.id, name: meeting.room.name } : null,
    company: meeting.empresa
      ? { id: meeting.empresa.id_empresa, name: meeting.empresa.nome_fantasia }
      : null,
    contract: meeting.contrato
      ? {
          id: meeting.contrato.id_contrato,
          status: meeting.contrato.status,
          dataInicio: meeting.contrato.data_inicio,
          dataFim: meeting.contrato.data_fim,
        }
      : null,
    participants: meeting.participantes?.map((participant) => ({
      id: participant.usuarios.id,
      name: participant.usuarios.fullName,
      email: participant.usuarios.email,
    })) ?? [],
    agendaNote: meeting.pauta,
    status: meeting.status,
  };
}

function normalizeContractEvent(contract, type) {
  return {
    contractId: contract.id_contrato,
    proposalId: contract.id_proposta,
    type,
    status: contract.status,
    date: type === 'inicio' ? contract.data_inicio : contract.data_fim,
    company: contract.proposta?.empresa
      ? {
          id: contract.proposta.empresa.id_empresa,
          name: contract.proposta.empresa.nome_fantasia,
        }
      : null,
  };
}

async function getWeeklyAgenda(userId, referenceDate) {
  const baseDate = parseReferenceDate(referenceDate);
  const start = startOfWeek(baseDate);
  const end = endOfWeek(baseDate);

  const meetings = await prisma.reunioes.findMany({
    where: {
      data: {
        gte: start,
        lte: end,
      },
      participantes: {
        some: {
          id_usuario: userId,
        },
      },
    },
    include: {
      empresa: {
        select: {
          id_empresa: true,
          nome_fantasia: true,
        },
      },
      room: {
        select: {
          id: true,
          name: true,
        },
      },
      contrato: {
        select: {
          id_contrato: true,
          id_proposta: true,
          status: true,
          data_inicio: true,
          data_fim: true,
        },
      },
      participantes: {
        include: {
          usuarios: {
            select: { id: true, fullName: true, email: true },
          },
        },
      },
    },
    orderBy: [{ data: 'asc' }, { hora: 'asc' }],
  });

  const contracts = await prisma.contratos.findMany({
    where: {
      proposta: {
        usuario_id: userId,
      },
      OR: [
        {
          data_inicio: {
            gte: start,
            lte: end,
          },
        },
        {
          data_fim: {
            gte: start,
            lte: end,
          },
        },
      ],
    },
    include: {
      proposta: {
        include: {
          empresa: {
            select: { id_empresa: true, nome_fantasia: true },
          },
        },
      },
    },
  });

  const contractEvents = [];
  contracts.forEach((contract) => {
    if (contract.data_inicio && contract.data_inicio >= start && contract.data_inicio <= end) {
      contractEvents.push(normalizeContractEvent(contract, 'inicio'));
    }
    if (contract.data_fim && contract.data_fim >= start && contract.data_fim <= end) {
      contractEvents.push(normalizeContractEvent(contract, 'fim'));
    }
  });

  return {
    range: {
      start,
      end,
    },
    meetings: meetings.map(normalizeMeeting),
    contractEvents,
  };
}

async function getMonthlyAgenda(userId, referenceDate) {
  const baseDate = parseReferenceDate(referenceDate);
  const start = startOfMonth(baseDate);
  const end = endOfMonth(baseDate);

  const meetings = await prisma.reunioes.findMany({
    where: {
      data: {
        gte: start,
        lte: end,
      },
      participantes: {
        some: {
          id_usuario: userId,
        },
      },
    },
    include: {
      empresa: {
        select: {
          id_empresa: true,
          nome_fantasia: true,
        },
      },
      room: {
        select: {
          id: true,
          name: true,
        },
      },
      participantes: {
        include: {
          usuarios: {
            select: { id: true, fullName: true, email: true },
          },
        },
      },
    },
    orderBy: [{ data: 'asc' }, { hora: 'asc' }],
  });

  const contracts = await prisma.contratos.findMany({
    where: {
      proposta: {
        usuario_id: userId,
      },
      OR: [
        {
          data_inicio: {
            gte: start,
            lte: end,
          },
        },
        {
          data_fim: {
            gte: start,
            lte: end,
          },
        },
      ],
    },
    include: {
      proposta: {
        include: {
          empresa: {
            select: { id_empresa: true, nome_fantasia: true },
          },
        },
      },
    },
  });

  const contractEvents = [];
  contracts.forEach((contract) => {
    if (contract.data_inicio && contract.data_inicio >= start && contract.data_inicio <= end) {
      contractEvents.push(normalizeContractEvent(contract, 'inicio'));
    }
    if (contract.data_fim && contract.data_fim >= start && contract.data_fim <= end) {
      contractEvents.push(normalizeContractEvent(contract, 'fim'));
    }
  });

  const groupedMeetings = meetings.reduce((acc, current) => {
    const day = current.data ? new Date(current.data).toISOString().split('T')[0] : 'sem-data';
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(normalizeMeeting(current));
    return acc;
  }, {});

  return {
    range: {
      start,
      end,
    },
    meetingsByDay: groupedMeetings,
    contractEvents,
  };
}

export const calendarService = {
  getWeeklyAgenda,
  getMonthlyAgenda,
};
