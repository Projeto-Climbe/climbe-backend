import { google } from 'googleapis';

export async function createSheetCopy(auth, templateId, newName) {
  const drive = google.drive({ version: 'v3', auth });

  const copy = await drive.files.copy({
    fileId: templateId,
    requestBody: { name: newName },
  });

  return copy.data.id;
}

export async function setSheetPermissions(auth, sheetId, userEmail, role = 'reader') {
  const drive = google.drive({ version: 'v3', auth });

  await drive.permissions.create({
    fileId: sheetId,
    requestBody: {
      type: 'user',
      role: role, // 'reader' ou 'writer'
      emailAddress: userEmail,
    },
    fields: 'id',
  });
}

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
              description: 'Protegido',
              warningOnly: false,
              editors: { users: [] },
            },
          },
        },
      ],
    },
  });
}
