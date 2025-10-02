import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'; 
import swaggerJSDoc from 'swagger-jsdoc';

// --- Rotas ---
import userRouter from './routes/userRouter.js';
import empresaRouter from './routes/empresaRouter.js';
import roleRouter from './routes/roleRouter.js';
import permissionRouter from './routes/permissionRouter.js';
import userPermissionRouter from './routes/userPermissionRouter.js';
import servicesRouter from './routes/servicesRouter.js';
import notificationsRouter from './routes/notificationsRouter.js';
import contractRouter from './routes/contractRouter.js';
import reuniaoRouter from './routes/reuniaoRouter.js';
import participanteReuniaoRouter from './routes/participanteReuniaoRouter.js';
import propostaRouter from './routes/propostaRouter.js';
import documentRouter from './routes/documentRouter.js';
import relatorioRoutes from './routes/relatorioRoutes.js';
import planilhaRouter from './routes/planilhaRouter.js';

// --- Swagger Config ---
import swaggerOptions from './config/swaggerConfig.js';

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

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/api/user-permission', userPermissionRouter);
app.use('/api/permission', permissionRouter);
app.use('/api/user', userRouter);
app.use('/api/empresa', empresaRouter);
app.use('/api/role', roleRouter);
app.use('/api/services', servicesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/contract', contractRouter);
app.use('/api/reuniao', reuniaoRouter);
app.use('/api/participante-reuniao', participanteReuniaoRouter);
app.use('/api/proposta', propostaRouter);
app.use('/api/document', documentRouter);
app.use('/api/relatorio', relatorioRoutes);
app.use('/api/planilha', planilhaRouter);

// Teste 
app.get('/', (req, res) => {
  res.send('API is subiu!!!');
});

export default app;
