const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Получить список всех заказов
 *     responses:
 *       200:
 *         description: Список заказов
 */
router.get('/', async (req, res) => {
    try {
        const orders = await Order.getAll();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Получить заказ по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Информация о заказе
 */
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.getById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Создать новый заказ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Заказ успешно создан
 */
router.post('/', async (req, res) => {
    try {
        const { id, name, phone } = req.body;
        if (!id || !name || !phone) {
            return res.status(400).json({ error: 'ID, name, and phone are required' });
        }
        const newOrder = await Order.create(id, name, phone);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Обновить информацию о заказе
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Заказ успешно обновлен
 */
router.put('/:id', async (req, res) => {
    try {
        const { name, phone } = req.body;
        const updatedOrder = await Order.update(req.params.id, name, phone);
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Удалить заказ
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Заказ успешно удален
 */
router.delete('/:id', async (req, res) => {
    try {
        await Order.delete(req.params.id);
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;