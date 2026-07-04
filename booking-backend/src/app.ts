import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter';
import categoryRouter from './routes/categoryRouter';


const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRouter);
app.use('/categories', categoryRouter);


export default app;