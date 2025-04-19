const pool = require('../db');

class OrderItem {
    static async getAll() {
        try {
            const { rows } = await pool.query('SELECT * FROM order_items');
            return rows;
        } catch (error) {
            console.error('Database query error in OrderItem.getAll:', error);
            throw error;
        }
    }

    static async getByOrderId(order_id) {
        try {
            const { rows } = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order_id]);
            return rows;
        } catch (error) {
            console.error('Database query error in OrderItem.getByOrderId:', error);
            throw error;
        }
    }

    static async create(order_id, item_id, count) {
        try {
            const { rows } = await pool.query(
                'INSERT INTO order_items (order_id, item_id, count) VALUES ($1, $2, $3) RETURNING *',
                [order_id, item_id, count]
            );
            return rows[0];
        } catch (error) {
            console.error('Database query error in OrderItem.create:', error);
            throw error;
        }
    }

    static async update(order_id, item_id, count) {
        try {
            const { rows } = await pool.query(
                'UPDATE order_items SET count = $1 WHERE order_id = $2 AND item_id = $3 RETURNING *',
                [count, order_id, item_id]
            );
            return rows[0];
        } catch (error) {
            console.error('Database query error in OrderItem.update:', error);
            throw error;
        }
    }

    static async delete(order_id, item_id) {
        try {
            await pool.query('DELETE FROM order_items WHERE order_id = $1 AND item_id = $2', [order_id, item_id]);
        } catch (error) {
            console.error('Database query error in OrderItem.delete:', error);
            throw error;
        }
    }
}

module.exports = OrderItem;
