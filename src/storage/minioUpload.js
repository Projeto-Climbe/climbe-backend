import minioClient from '../storage/minioClient.js';
import { v4 as uuidv4 } from 'uuid';

const BUCKET = process.env.MINIO_BUCKET_NAME || 'climbe';

export async function uploadToMinio(file, empresaId, tipoDocumento) {
  try {
    // Gera um nome único para o arquivo
    const ext = file.originalname.split('.').pop();
    const filename = `${empresaId}/${tipoDocumento}_${uuidv4()}.${ext}`;

    // Debug: log bucket e arquivo
    console.log('[MinIO] Bucket:', BUCKET);
    console.log('[MinIO] Upload filename:', filename);

    // Garante que o bucket existe
    const exists = await minioClient.bucketExists(BUCKET);
    if (!exists) {
      console.log('[MinIO] Bucket não existe, criando...');
      await minioClient.makeBucket(BUCKET);
    }

    await minioClient.putObject(
      BUCKET,
      filename,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
        'x-amz-meta-originalname': file.originalname,
      }
    );

    // Monta URL pública se desejado
    const protocol = String(process.env.MINIO_USE_SSL).toLowerCase() === 'true' ? 'https' : 'http';
    const host = (process.env.MINIO_ENDPOINT || 'localhost').replace(/^https?:\/\//, '');
    const url = `${protocol}://${host}/${BUCKET}/${filename}`;

    return {
      url,
      bucket: BUCKET,
      key: filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  } catch (err) {
    console.error('[MinIO] Erro no upload:', err);
    throw err;
  }
}
