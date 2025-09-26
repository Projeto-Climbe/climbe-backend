import { calendarService } from '../service/calendarService.js';

export async function getWeeklyAgenda(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const agenda = await calendarService.getWeeklyAgenda(userId, req.query.date);
    return res.json(agenda);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getMonthlyAgenda(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const agenda = await calendarService.getMonthlyAgenda(userId, req.query.date);
    return res.json(agenda);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
