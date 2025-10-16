import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});

const drive = google.drive({ version: 'v3', auth });

export async function copyPlanilha(templateId, pastaDestino, nome = 'Cópia de Teste') {
  const res = await drive.files.copy({
    fileId: templateId,
    requestBody: {
      name: nome,
      parents: [pastaDestino],
    },
  });
  return res.data;
}
