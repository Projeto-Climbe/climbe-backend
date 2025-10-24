import multer from 'multer';

const storage = multer.memoryStorage(); // Armazena o arquivo em memória (buffer)
const upload = multer({ storage });

export default upload;