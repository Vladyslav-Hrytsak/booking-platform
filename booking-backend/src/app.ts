import express from 'express';
import cors from 'cors';

const app = express();

// Разрешаем принимать JSON в теле запроса
app.use(express.json());

// CORS — разрешаем фронтенду (другой порт) обращаться к нашему API
app.use(cors());

// Health check — первый маршрут. Удобно проверить что сервер жив
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;