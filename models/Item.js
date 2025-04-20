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

    static async getFiltered(search = '', country = '0') {
        try {
            let query = 'SELECT * FROM items';
            const params = [];

            if (search || country !== '0') {
                query += ' WHERE ';
                const conditions = [];

                if (search) {
                    conditions.push(`title ILIKE $${params.length + 1}`);
                    params.push(`%${search}%`);
                }

                if (country && country !== '0') {
                    conditions.push(`country_id = $${params.length + 1}`);
                    params.push(country);
                }

                query += conditions.join(' AND ');
            }

            const { rows } = await pool.query(query, params);
            return rows;
        } catch (error) {
            console.error('Database query error in Item.getFiltered:', error);
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
