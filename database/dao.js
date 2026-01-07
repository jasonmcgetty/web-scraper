db = require('./create_database.js');
Prediction = require('../models/prediction.js')

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
    selectPredictionsByLocationAndDate(location, predictionDate) {
        let predictions = [];
        const stmt = db.prepare(`
            SELECT * FROM predictions WHERE location = ? AND prediction_datetime LIKE ?`);
        let result = stmt.all(location, `%${predictionDate}%`);
        for (let i=0; i<result.length; i++) {
            predictions.push(new Prediction(result[i].weather_service, result[i].location, result[i].recorded_datetime, result[i].prediction_datetime, result[i].prediction_length, result[i].prediction_high, result[i].prediction_low));
        }
        return predictions;
    }


}
module.exports = Dao;
