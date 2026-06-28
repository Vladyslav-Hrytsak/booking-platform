import dotenv from 'dotenv';
dotenv.config(); // загружает .env ДО всего остального

import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});