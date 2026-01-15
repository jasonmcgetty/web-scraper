const Database = require('better-sqlite3');
const db = new Database('weather.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        weather_service TEXT NOT NULL,
        location TEXT NOT NULL, 
        recorded_datetime TEXT NOT NULL,
        prediction_datetime TEXT NOT NULL,
        prediction_length INTEGER NOT NULL,
        prediction_high INTEGER NOT NULL,
        prediction_low INTEGER NOT NULL
    ); 

    CREATE TABLE IF NOT EXISTS past_dates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT NOT NULL,
        location TEXT NOT NULL,
        location_zip INTEGER NOT NULL,
        date TEXT NOT NULL,
        date_high INTEGER NOT NULL,
        date_low INTEGER NOT NULL
    ); 
`
);

module.exports = db;