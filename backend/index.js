require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = require('./models/database');

// ✅ Проверяем правильное подключение маршрутов
const employeeRoutes = require('./routes/employees');
const eventRoutes = require('./routes/events');

app.use('/api/employees', employeeRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
