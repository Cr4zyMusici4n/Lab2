const bcrypt = require('bcrypt');
const pool = require('../db');

class User {
    static async create(username, password) {
        try {
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const { rows } = await pool.query(
                'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
                [username, passwordHash]
            );

            return rows[0];
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static async findByUsername(username) {
        try {
            const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            return rows[0];
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw error;
        }
    }

    static async verifyPassword(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        } catch (error) {
            console.error('Error verifying password:', error);
            throw error;
        }
    }
}

module.exports = User;
