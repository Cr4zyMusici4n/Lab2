const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Получить список всех товаров
 *     responses:
 *       200:
 *         description: Список товаров
 */
router.get('/', async (req, res) => {
    try {
        const items = await Item.getAll();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /items/filter:
 *   get:
 *     summary: Получить отфильтрованный список товаров
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поисковая строка (название товара)
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: ID страны для фильтрации
 *     responses:
 *       200:
 *         description: Отфильтрованный список товаров
 */
router.get('/filter', async (req, res) => {
    try {
        const { search = '', country = '0' } = req.query;

        const filteredItems = await Item.getFiltered(search, country);

        res.json(filteredItems);
    } catch (error) {
        console.error('Error fetching filtered items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Информация о товаре
 */
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.getById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
