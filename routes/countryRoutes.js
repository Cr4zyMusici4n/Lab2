const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Получить список всех стран
 *     responses:
 *       200:
 *         description: Список стран
 */
router.get('/', async (req, res) => {
    try {
        const countries = await Country.getAll();
        res.json(countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /countries/{id}:
 *   get:
 *     summary: Получить страну по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Информация о стране
 */
router.get('/:id', async (req, res) => {
    try {
        const country = await Country.getById(req.params.id);
        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }
        res.json(country);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
