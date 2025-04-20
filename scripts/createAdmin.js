const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Явно указываем путь к .env
const bcrypt = require('bcrypt');
const pool = require('../db'); // Подключение к базе данных

// Отладочное сообщение для проверки переменных окружения
console.log('Environment variables:', {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD ? '******' : null,
    DB_NAME: process.env.DB_NAME,
});

// Функция для создания администратора
const createAdminUser = async (username, password) => {
    try {
        if (!username || !password) {
            throw new Error('Имя пользователя и пароль должны быть указаны.');
        }

        // Проверяем, существует ли пользователь с таким именем
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (rows.length > 0) {
            console.log('Пользователь уже существует:', rows[0]);
            return;
        }

        // Хэшируем пароль
        const saltRounds = 10; // Количество раундов хэширования
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Добавляем пользователя в базу данных
        const newUser = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
            [username, passwordHash]
        );

        console.log('Администратор успешно создан:', newUser.rows[0]);
    } catch (error) {
        console.error('Ошибка при создании администратора:', error.message);
    } finally {
        // Закрываем соединение с базой данных
        pool.end();
    }
};

// Получаем аргументы командной строки
const args = process.argv.slice(2); // Пропускаем первые два аргумента (node и путь к файлу)

if (args.length !== 2) {
    console.error('Использование: node createAdmin.js <username> <password>');
    process.exit(1);
}

const [username, password] = args.map(String); // Явно преобразуем в строки

// Вызываем функцию с полученными аргументами
createAdminUser(username, password);
