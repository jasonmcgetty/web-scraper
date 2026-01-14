const cheerio = require('cheerio');
const fsPromises = require('node:fs/promises');
const Dao = require('../database/dao.js');
Prediction = require('../models/prediction.js');


(async () => {
    const url = 'https://www.accuweather.com/en/us/norton/02766/daily-weather-forecast/2251408';
    const response = await fetch(url);

    const $ = cheerio.load(await response.text());
    
    
    let tempsArray = getTemps($);
    let highs = getHighs(tempsArray);
    let lows = getLows(tempsArray);

    let numPredictions = highs.length-1; //326704

    let weatherServiceArray = getWeatherServiceArray(numPredictions);
    let location = $('h1').text();
    let locationArray = getLocationArray(numPredictions, location);
    let recordedDatetimeArray = getCurrentDatetimeArray(numPredictions);
    let predictionDatetimeArray = getPredictionDatetimeArray(numPredictions);
    let predictionLengthArray = getPredictionLengthArray(numPredictions);
    
    
    const dao = new Dao();
    savePredictions(dao, weatherServiceArray, locationArray, recordedDatetimeArray, predictionDatetimeArray, predictionLengthArray, highs, lows, numPredictions);
    let jan7Predictions = dao.selectPredictionsByLocationAndDate('Plymouth, MA', '2026-01-07');
    let jan7Prediction = jan7Predictions[0];
    console.log(`On ${new Date(jan7Prediction.getRecordedDatetime())}, ${jan7Prediction.getWeatherService()} predicted that the high would be ${jan7Prediction.getPredictionHigh()} on ${new Date(jan7Prediction.getPredictionDatetime())}`);

    let plymouthPredictions = dao.selectPredictionsByLocation('Plymouth, MA');
    console.log(plymouthPredictions);

}) ();

function getTemps($) {
    let $temps = $('.temp');
    let temps = $temps.text();
    temps = temps.replace(/\t/g, '');
    temps = temps.replace(/\n/g, '');
    let tempsArray = temps.split('°');
    return tempsArray;
}

function getHighs(tempsArray) {
    return tempsArray.filter(value => !value.includes('/'));
}

function getLows(tempsArray) {
    let lows = tempsArray.filter(value => value.includes('/'));
    return lows.map(value => value.replace('/', ''));
}

function getWeatherServiceArray(numPredictions) {
    weatherServices = [];
    for (let i=0; i<numPredictions; i++) {
       weatherServices.push('accuweather');
    }
    return weatherServices;
}

function getLocationArray(numPredictions, location) {
    locations = [];
    for (let i=0; i<numPredictions; i++) {
        locations.push(location);
    }
    return locations;
}

function getCurrentDatetimeArray(numPredictions) {
    let currentDatetime = new Date();
    let currentDatetimes = [];
    for (let i=0; i<numPredictions; i++) {
        currentDatetimes.push(currentDatetime.toISOString());
        console.log(currentDatetime.toISOString());
    }
    return currentDatetimes;
}

function getPredictionDatetimeArray(numPredictions) {
    let currentDatetime = new Date();
    predictionDatetimes = [];
    for (let i=0; i<numPredictions; i++) {
        predictionDatetimes.push((new Date(currentDatetime.getTime() + 86400000 * i)).toISOString());
    }
    return predictionDatetimes;

}

function getPredictionLengthArray(numPredictions) {
    predictionLengths = [];
    for (let i=0; i<numPredictions; i++) {
        predictionLengths.push(i);
    }
    return predictionLengths;
}

function savePredictions(dao, weatherServiceArray, locationArray, recordedDatetimeArray, predictionDatetimeArray, predictionLengthArray, highs, lows, numPredictions) {
    for (let i=0; i<numPredictions; i++) {
        dao.insertPrediction(new Prediction(weatherServiceArray[i], locationArray[i], recordedDatetimeArray[i], predictionDatetimeArray[i], predictionLengthArray[i], highs[i], lows[i]));
    }
}


async function writeToFile(filename, data) {
    try {
        await fsPromises.writeFile(filename, data, 'utf8');
        console.log('Success!')
    } catch (err) {
        console.error("error :(");
    }
}