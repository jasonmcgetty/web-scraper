
class Prediction {
    constructor(weather_service, location, recorded_datetime, prediction_datetime, prediction_length, prediction_high, prediction_low) {
        this.weather_service = weather_service;
        this.location = location;
        this.recorded_datetime = recorded_datetime;
        this.prediction_datetime = prediction_datetime;
        this.prediction_length = prediction_length;
        this.prediction_high = prediction_high;
        this.prediction_low = prediction_low;
    }
    
    getWeatherService() {
        return this.weather_service;
    }
    getLocation() {
        return this.location;
    }
    getRecordedDatetime() {
        return this.recorded_datetime;
    }
    getPredictionDatetime() {
        return this.prediction_datetime;
    }
    getPredictionLength() {
        return this.prediction_length;
    }
    getPredictionHigh() {
        return this.prediction_high;
    }
    getPredictionLow() {
        return this.prediction_low;
    }

}

module.exports = Prediction;