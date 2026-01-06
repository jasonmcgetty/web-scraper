const cheerio = require('cheerio');
const fsPromises = require('node:fs/promises');
const Dao = require('../database/dao.js');
Prediction = require('../models/prediction.js');


(async () => {
    const url = 'https://www.accuweather.com/en/us/plymouth/02360/daily-weather-forecast/333581';
    const response = await fetch(url);

    const $ = cheerio.load(await response.text());
    
    let tempsArray = getTemps($);
    let highs = getHighs(tempsArray);
    let lows = getLows(tempsArray);
    let date = getDatetimes(highs);

    
    
    const title = $('h1').text();
    const dao = new Dao();
    dao.insertPrediction(new Prediction('accuweather','Plymouth MA', 'Today', 'Tomorrow', 1, 25, 14));
    
    

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

function getDatetimes(highs) {
    let currentDatetime = new Date();
    datetimes = [];
    for (let i=0; i<highs.length-1; i++) {
        datetimes.push(new Date(currentDatetime.getTime() + 86400000 * i));
    }
    return datetimes;

}

async function writeToFile(filename, data) {
    try {
        await fsPromises.writeFile(filename, data, 'utf8');
        console.log('Success!')
    } catch (err) {
        console.error("error :(");
    }
}