const cheerio = require('cheerio');
const Dao = require('../database/dao.js');
Prediction = require('../models/prediction.js');
PastDate = require('../models/past-date.js');
Calculations = require('../calculations/calculations.js');

(async () => {

    const url = 'https://www.wunderground.com/history/monthly/us/ma/plymouth/KPYM/date/2026-1';
    const response = await fetch(url);

    const $ = cheerio.load(await response.text());
    $title = $('title');
    let title = $title.text();
    indexCutOff = title.search(/[A-Z]{2}/);
    console.log(indexCutOff);
    const location = title.substring(0, indexCutOff+2);
    console.log(location);

    console.log('Done extracting location from website!');

    const jsonUrl = 'https://api.weather.com/v1/location/KPYM:9:US/observations/historical.json?apiKey=e1f10a1e78da46f5b10a1e78da96f525&units=e&startDate=20260101&endDate=20260131';
    const jsonResponse = await fetch(jsonUrl);
    const jsonData = await jsonResponse.json();



    let temps = getTemps(jsonData);
    let date_highs = temps[0];
    let date_lows = temps[1];
    let dates = temps[2];
    let source = 'weather-underground';

    console.log(`Done with JSON data!`);
    


    const dao = new Dao();
    //savePastDates(dao, source, location, -1, dates, date_highs, date_lows);
    console.log('Success!');
    let plymouthPrediction = dao.selectPredictionsByLocationAndDate('Plymouth, MA', '2026-01-13');
    let plymouthWeather = dao.selectPastDatesByLocationAndDate('Plymouth, MA', '2026-01-13');
    
    Calculations.calculateHighDifferenceSingleDate(plymouthPrediction[0], plymouthWeather[0]);
    
    




}) ();

function getTemps(data) {
    let dailyTemps = [];
    let maxTemps = [];
    let minTemps = [];
    let dates = [];
    let dateLowerBound = 1767243600;
    let dateUpperBound = 1767329999;
    for (let i=0; i<data.observations.length; i++) {
        
        if (data.observations[i].valid_time_gmt >= dateLowerBound && data.observations[i].valid_time_gmt <=  dateUpperBound) {
            dailyTemps.push(data.observations[i].temp);
            
            if (i === data.observations.length-1) {
                maxTemps.push(Math.max(...dailyTemps));
                minTemps.push(Math.min(...dailyTemps));
                dates.push(dateLowerBound);
            }
        }
        else if (data.observations[i].valid_time_gmt >= dateUpperBound+1) {
            maxTemps.push(Math.max(...dailyTemps));
            minTemps.push(Math.min(...dailyTemps));
            dates.push(dateLowerBound);

            dailyTemps.length = 0;
            dailyTemps.push(data.observations[i].temp);

            dateLowerBound += 86400;
            dateUpperBound += 86400;

        }
        else { 
            // do nothing, move on to next iteration
        }
    }

    for (let i=0; i< maxTemps.length; i++) {
        console.log(`On ${new Date(dates[i]*1000)}, the max temp was ${maxTemps[i]} and the min temp was ${minTemps[i]}`);
    }
    return [maxTemps, minTemps, dates];
}


function savePastDates(dao, source, location, location_zip, dates, date_highs, date_lows) {
    for (let i=0; i<date_highs.length; i++) {
        dao.insertPastDate(new PastDate(source, location, location_zip, (new Date(dates[i]*1000)).toISOString(), date_highs[i], date_lows[i]));
    }
}

