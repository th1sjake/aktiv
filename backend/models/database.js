const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('✅ Подключено к базе данных SQLite.');
});

// 🔹 Пересоздаём таблицу сотрудников
db.run(`CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL,
    static TEXT NOT NULL,
    points INTEGER DEFAULT 0
)`);

// 🔹 Таблица событий
db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    datetime TEXT NOT NULL,
    points INTEGER NOT NULL
)`);

// 🔹 Таблица участников событий
db.run(`CREATE TABLE IF NOT EXISTS event_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER,
    employee_id INTEGER,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
)`);

module.exports = db;
