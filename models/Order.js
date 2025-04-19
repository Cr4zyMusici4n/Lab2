const pool = require('../db');

class Order {
    static async getAll() {
        try {
            const { rows } = await pool.query('SELECT * FROM orders');
            return rows;
        } catch (error) {
            console.error('Database query error in Order.getAll:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
            return rows[0];
        } catch (error) {
            console.error('Database query error in Order.getById:', error);
            throw error;
        }
    }

    static async create(id, name, phone) {
        try {
            const { rows } = await pool.query(
                'INSERT INTO orders (id, name, phone) VALUES ($1, $2, $3) RETURNING *',
                [id, name, phone]
            );
            return rows[0];
        } catch (error) {
            console.error('Database query error in Order.create:', error);
            throw error;
        }
    }

    static async update(id, name, phone) {
        try {
            const { rows } = await pool.query(
                'UPDATE orders SET name = $1, phone = $2 WHERE id = $3 RETURNING *',
                [name, phone, id]
            );
            return rows[0];
        } catch (error) {
            console.error('Database query error in Order.update:', error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            await pool.query('DELETE FROM orders WHERE id = $1', [id]);
        } catch (error) {
            console.error('Database query error in Order.delete:', error);
            throw error;
        }
    }
}

module.exports = Order;
