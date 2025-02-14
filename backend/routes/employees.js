const express = require('express');
const router = express.Router();
const db = require('../models/database');

// Получить список сотрудников
router.get('/', (req, res) => {
    db.all("SELECT id, nickname, static, points FROM employees", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Добавить нового сотрудника
router.post('/', (req, res) => {
    const { nickname, static } = req.body;
    
    if (!nickname || !static) {
        res.status(400).json({ error: "Заполните все поля" });
        return;
    }

    db.run("INSERT INTO employees (nickname, static, points) VALUES (?, ?, 0)", [nickname, static], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, nickname, static, points: 0 });
    });
});

// Удаление сотрудника
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM employees WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: `Сотрудник с ID ${id} удалён` });
    });
});

// Сбросить баллы у всех сотрудников
router.put('/reset-points', (req, res) => {
    db.run("UPDATE employees SET points = 0", [], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Баллы сброшены у всех сотрудников" });
    });
});

module.exports = router;
