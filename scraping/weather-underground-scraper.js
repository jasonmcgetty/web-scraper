const cheerio = require('cheerio');
const Dao = require('../database/dao.js');
Prediction = require('../models/prediction.js');

(async () => {
    const url = 'https://api.weather.com/v1/location/KBOS:9:US/observations/historical.json?apiKey=e1f10a1e78da46f5b10a1e78da96f525&units=e&startDate=20251201&endDate=20251231';
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    let temps = getTemps(data);
    let maxs = temps[0];
    let mins = temps[1];
    let dates = temps[2];
    console.log(`Done!`)


}) ();

function getTemps(data) {
    let dailyTemps = [];
    let maxTemps = [];
    let minTemps = [];
    let dates = [];
    let dateLowerBound = 1764565200;
    let dateUpperBound = 1764651599;
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
