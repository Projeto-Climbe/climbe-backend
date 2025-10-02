import { authService } from '../service/authService.js';

export function googleAuth(req, res) {
  try {
    const redirectUrl = authService.getGoogleAuthUrl(req.query.state);

    if (req.accepts('html')) {
      return res.redirect(redirectUrl);
    }

    return res.status(200).json({ url: redirectUrl });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function googleCallback(req, res) {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Código de autorização não encontrado.' });
  }

  try {
    const result = await authService.handleGoogleCallback({ code, state });
    return res.status(result.statusCode).json(result.body);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
