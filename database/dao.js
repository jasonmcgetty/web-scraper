db = require('./create-database.js');
Prediction = require('../models/prediction.js')
PastDate = require('../models/past-date.js')

class Dao {

    /***** Predictions *****/
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

    selectPredictionsByLocation(location) {
        let predictions = [];
        const stmt = db.prepare(`
            SELECT * FROM predictions WHERE location = ?`);
        let result = stmt.all(location);
        for (let i=0; i<result.length; i++) {
            predictions.push(new Prediction(result[i].weather_service, result[i].location, result[i].recorded_datetime, result[i].prediction_datetime, result[i].prediction_length, result[i].prediction_high, result[i].prediction_low));
        }
        return predictions;
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

    /***** PastDates *****/
    insertPastDate(pastDate) {
        const stmt = db.prepare(`
            INSERT INTO past_dates (source, location, location_zip, date, date_high, date_low)
            VALUES (?,?,?,?,?,?)
            `);
        return stmt.run(
            pastDate.getSource(),
            pastDate.getLocation(),
            pastDate.getLocationZip(),
            pastDate.getDate(),
            pastDate.getDateHigh(),
            pastDate.getDateLow()
        ).changes;
    }

    selectPastDatesByLocation(location) {
        let pastDates = [];
        const stmt = db.prepare(`
            SELECT * FROM past_dates WHERE location = ?`);
        let result = stmt.all(location);
        for (let i=0; i<result.length; i++) {
            pastDates.push(new PastDate(result[i].source, result[i].location, result[i].location_zip, result[i].date, result[i].date_high, result[i].date_low));
        }
        return pastDates;
    }

    selectPastDatesByLocationAndDate(location, date) {
        let pastDates = [];
        const stmt = db.prepare(`
            SELECT * FROM past_dates WHERE location = ? AND date LIKE ?`);
        let result = stmt.all(location, `%${date}%`);
        for (let i=0; i<result.length; i++) {
            pastDates.push(new PastDate(result[i].source, result[i].location, result[i].location_zip, result[i].date, result[i].date_high, result[i].date_low));
        }
        return pastDates;
    }


}
module.exports = Dao;
