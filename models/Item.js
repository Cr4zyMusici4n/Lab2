const pool = require('../db');

class Item {
    static async getAll() {
        try {
            const { rows } = await pool.query('SELECT * FROM items');
            return rows;
        } catch (error) {
            console.error('Database query error in Item.getAll:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const { rows } = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
            return rows[0];
        } catch (error) {
            console.error('Database query error in Item.getById:', error);
            throw error;
        }
    }
}

module.exports = Item;
