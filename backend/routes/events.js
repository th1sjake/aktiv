const express = require('express');
const router = express.Router();
const db = require('../models/database');

// 🔹 Получить все события
router.get('/', (req, res) => {
    const query = `
        SELECT events.id, events.name, events.datetime, events.points, 
               GROUP_CONCAT(employees.nickname, ', ') AS participants
        FROM events
        LEFT JOIN event_participants ON events.id = event_participants.event_id
        LEFT JOIN employees ON event_participants.employee_id = employees.id
        GROUP BY events.id
        ORDER BY events.datetime DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// 🔹 Создать событие (добавляем `datetime`)
router.post('/', (req, res) => {
    const { name, datetime, points, participants } = req.body;

    if (!name || !datetime || isNaN(points) || participants.length === 0) {
        return res.status(400).json({ error: "Заполните все поля" });
    }

    db.run("INSERT INTO events (name, datetime, points) VALUES (?, ?, ?)", [name, datetime, points], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const eventID = this.lastID;

        // 🔹 Добавляем участников
        participants.forEach((id) => {
            db.run("INSERT INTO event_participants (event_id, employee_id) VALUES (?, ?)", [eventID, id]);
            db.run("UPDATE employees SET points = points + ? WHERE id = ?", [points, id]);
        });

        res.json({ id: eventID, name, datetime, points, participants });
    });
});

// 🔹 Удалить все мероприятия
router.delete('/', (req, res) => {
    const query = "DELETE FROM events";

    db.run(query, [], function (err) {
        if (err) {
            res.status(500).json({ error: "Ошибка при удалении мероприятий" });
            return;
        }
        res.json({ message: "Все мероприятия удалены" });
    });
});


module.exports = router;
