import { google } from 'googleapis';


 //Cria uma cópia de uma planilha modelo no Google Drive.

export async function createSheetCopy(auth, templateId, newName) {
  const drive = google.drive({ version: 'v3', auth });

  const { data } = await drive.files.copy({
    fileId: templateId,
    requestBody: { name: newName },
  });

  return data.id;
}

 //Define permissões para um usuário na planilha.
export async function setSheetPermissions(auth, sheetId, userEmail, role = 'reader') {
  const drive = google.drive({ version: 'v3', auth });

  await drive.permissions.create({
    fileId: sheetId,
    requestBody: {
      type: 'user',
      role,
      emailAddress: userEmail,
    },
  });
}


//Protege a primeira aba da planilha (bloqueia edição).
export async function protectSheet(auth, sheetId) {
  const sheets = google.sheets({ version: 'v4', auth });
  const { data } = await sheets.spreadsheets.get({ spreadsheetId: sheetId });

  const firstSheetId = data.sheets[0].properties.sheetId;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          addProtectedRange: {
            protectedRange: {
              range: { sheetId: firstSheetId },
              description: 'Área protegida',
              warningOnly: false,
              editors: { users: [] },
            },
          },
        },
      ],
    },
  });
}
