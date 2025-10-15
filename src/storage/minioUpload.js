import minioClient from '../storage/minioClient.js';
import { v4 as uuidv4 } from 'uuid';

const BUCKET = process.env.MINIO_BUCKET_NAME || 'documentos';

export async function uploadToMinio(file, empresaId, tipoDocumento) {
  // Gera um nome único para o arquivo
  const ext = file.originalname.split('.').pop();
  const filename = `${empresaId}/${tipoDocumento}_${uuidv4()}.${ext}`;

  // Garante que o bucket existe
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
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

  return {
    url: `/minio/${BUCKET}/${filename}`,
    bucket: BUCKET,
    key: filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  };
}
