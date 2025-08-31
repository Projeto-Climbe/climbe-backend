import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter.js'; 
import roleRouter from './routes/roleRouter.js';
import permissionRouter from './routes/permissionRouter.js';
import userPermissionRouter from './routes/userPermissionRouter.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rotas
app.use('/api/user-permission', userPermissionRouter);
app.use('/api/permission', permissionRouter);
app.use('/api/user', userRouter);
app.use('/api/role', roleRouter);

export default app;