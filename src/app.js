import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import empresaRouter from './routes/empresaRouter.js';
import swaggerOptions from './config/swaggerConfig.js';
import roleRouter from './routes/roleRouter.js';
import permissionRouter from './routes/permissionRouter.js';
import userPermissionRouter from './routes/userPermissionRouter.js';
import servicesRouter from './routes/servicesRouter.js';
import notificationsRouter from './routes/notificationsRouter.js';
import reuniaoRouter from './routes/reuniaoRouter.js';
import calendarRouter from './routes/calendarRouter.js';
import propostaRouter from './routes/propostaRouter.js';

// --- IMPORTAÇÕES DO SWAGGER ---
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.set('trust proxy', true);
// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/api/user-permission', userPermissionRouter);
app.use('/api/permission', permissionRouter);
app.use('/api/user', userRouter);
app.use('/api/empresa', empresaRouter);
app.use('/api/role', roleRouter);
app.use('/api/services', servicesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/propostas', propostaRouter);
app.use('/api/reunioes', reuniaoRouter);
app.use('/api/calendar', calendarRouter);

app.get('/', (req, res) => {
  res.send('API is running!!!');
});

export default app;
