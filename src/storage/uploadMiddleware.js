import multer from 'multer';

// Armazena o arquivo em memória para depois enviar ao MinIO
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default upload;
