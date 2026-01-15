const Dao = require('../database/dao.js');
Prediction = require('../models/prediction.js');
PastDate = require('../models/past-date.js');

class Calculations {

    static calculateHighDifferenceSingleDate(prediction, pastDate) {

        if (prediction.getPredictionDatetime().substring(0,10) !== pastDate.getDate().substring(0,10)) {
            console.log('The prediction and the pastDate are not the same day');
            return;
        }
        if (prediction.getLocation() !== pastDate.getLocation()) {
            console.log('The prediction and the pastDate do not involve the same location');
            return;
        }



        let predictedHigh = prediction.getPredictionHigh();
        let actualHigh = pastDate.getDateHigh();

        console.log(`The predicted high on ${new Date(pastDate.getDate())} was ${predictedHigh}. The actual high on this day was ${actualHigh}. The prediction was made by ${prediction.getWeatherService()} ${prediction.getPredictionLength()} days in advance`);

        return predictedHigh - actualHigh;


        

    }
}

module.exports = Calculations;