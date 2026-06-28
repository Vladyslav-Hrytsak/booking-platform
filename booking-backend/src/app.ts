import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRouter);

export default app;