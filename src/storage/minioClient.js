
import { Client } from 'minio';

// MINIO_ENDPOINT pode ser 'minio.exemplo.com' (sem http/https)
// MINIO_USE_SSL pode ser 'true' ou 'false'
const endPoint = (process.env.MINIO_ENDPOINT || 'localhost').replace(/^https?:\/\//, '');
const useSSL = String(process.env.MINIO_USE_SSL).toLowerCase() === 'true';

const minioClient = new Client({
  endPoint,
  useSSL,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

export default minioClient;
