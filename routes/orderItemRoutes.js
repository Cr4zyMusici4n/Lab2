const express = require('express');
const router = express.Router();
const OrderItem = require('../models/OrderItem');

/**
 * @swagger
 * /order-items:
 *   get:
 *     summary: Получить список всех товаров в заказах
 *     responses:
 *       200:
 *         description: Список товаров в заказах
 */
router.get('/', async (req, res) => {
    try {
        const orderItems = await OrderItem.getAll();
        res.json(orderItems);
    } catch (error) {
        console.error('Error fetching order items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /order-items/{order_id}:
 *   get:
 *     summary: Получить товары в заказе по ID заказа
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Товары в заказе
 */
router.get('/:order_id', async (req, res) => {
    try {
        const orderItems = await OrderItem.getByOrderId(req.params.order_id);
        if (!orderItems.length) {
            return res.status(404).json({ error: 'No items found for this order' });
        }
        res.json(orderItems);
    } catch (error) {
        console.error('Error fetching order items by order ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /order-items:
 *   post:
 *     summary: Добавить товар в заказ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: string
 *               item_id:
 *                 type: integer
 *               count:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Товар успешно добавлен в заказ
 */
router.post('/', async (req, res) => {
    try {
        const { order_id, item_id, count } = req.body;
        if (!order_id || !item_id || !count) {
            return res.status(400).json({ error: 'Order ID, item ID, and count are required' });
        }
        const newOrderItem = await OrderItem.create(order_id, item_id, count);
        res.status(201).json(newOrderItem);
    } catch (error) {
        console.error('Error creating order item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /order-items/{order_id}/{item_id}:
 *   put:
 *     summary: Обновить количество товара в заказе
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               count:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Количество товара успешно обновлено
 */
router.put('/:order_id/:item_id', async (req, res) => {
    try {
        const { count } = req.body;
        const updatedOrderItem = await OrderItem.update(req.params.order_id, req.params.item_id, count);
        if (!updatedOrderItem) {
            return res.status(404).json({ error: 'Order item not found' });
        }
        res.json(updatedOrderItem);
    } catch (error) {
        console.error('Error updating order item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /order-items/{order_id}/{item_id}:
 *   delete:
 *     summary: Удалить товар из заказа
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Товар успешно удален из заказа
 */
router.delete('/:order_id/:item_id', async (req, res) => {
    try {
        await OrderItem.delete(req.params.order_id, req.params.item_id);
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting order item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
