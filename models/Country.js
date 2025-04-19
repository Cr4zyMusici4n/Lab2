const pool = require('../db');

class Country {
    static async getAll() {
        const { rows } = await pool.query('SELECT * FROM countries');
        return rows;
    }

    static async getById(id) {
        const { rows } = await pool.query('SELECT * FROM countries WHERE id = $1', [id]);
        return rows[0];
    }
}

module.exports = Country;
