db = require('./create_database.js');
//prediction = require('prediction.js')

class Dao {
    insertPrediction(prediction) {
        const stmt = db.prepare(`
            INSERT INTO predictions (weather_service, location, recorded_datetime, prediction_datetime, prediction_length, prediction_high, prediction_low)
            VALUES (?,?,?,?,?,?,?)
            `);
        return stmt.run(
        prediction.getWeatherService(), 
        prediction.getLocation(), 
        prediction.getRecordedDatetime(), 
        prediction.getPredictionDatetime(), 
        prediction.getPredictionLength(), 
        prediction.getPredictionHigh(), 
        prediction.getPredictionLow()
        ).changes;
    }
}
module.exports = Dao;
