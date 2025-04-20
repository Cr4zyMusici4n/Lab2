require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const pool = require('./db');

const app = express();
const countryRoutes = require('./routes/countryRoutes');
const itemRoutes = require('./routes/itemRoutes');
const { router: authRouter, authenticateToken } = require('./routes/authRoutes');

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Подключение маршрутов
app.use('/countries', countryRoutes);
app.use('/items', itemRoutes);
app.use('/auth', authRouter);

// Проверка подключения к базе данных
pool.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Swagger документация
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ['./routes/*.js'], // Указываем путь к маршрутам API
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Защищенный маршрут для админ-панели
app.get('/admin/items', authenticateToken, async (req, res) => {
    try {
        const items = await pool.query('SELECT * FROM items'); // Получаем все товары из базы данных
        res.json(items.rows);
    } catch (error) {
        console.error('Error fetching items for admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
