import { PrismaClient } from '@prisma/client';
import { GoogleSheetsService } from './googleSheetsService.js';

const prisma = new PrismaClient();
const sheetsService = new GoogleSheetsService();

export class PlanilhaService {
  static async criarCopiaPlanilha(idContrato) {
    const templateId = process.env.SHEET_TEMPLATE_ID;
    const folderId = process.env.PASTA_DESTINO;

    const planilhaCopia = await sheetsService.copySpreadsheet(templateId, folderId);

    return prisma.planilha.create({
      data: {
        id_contrato: idContrato,
        url_google_sheets: `https://docs.google.com/spreadsheets/d/${planilhaCopia.id}`,
        blocked: false,
        view_permission: 'editor',
      },
    });
  }
}
