

const cheerio = require('cheerio');
const fsPromises = require('node:fs/promises');


(async () => {
    const url = 'https://www.purdueglobal.edu/blog/student-life/45-sustainability-resources/';
    const response = await fetch(url);

    const $ = cheerio.load(await response.text());
    let $websites = await findWebsites($);
    console.log($websites.length);
    
    const title = $('h1').text();

    writeToFile('test1.txt', $websites);
    

}) ();

async function findWebsites($) {
    let $pElements = []
    let $firstPElement = $('p:first');
    $pElements.push($firstPElement.text());
    let $nextPElement = $firstPElement.next();
    while ($nextPElement.length !== 0) {
        $pElements.push($nextPElement.text());
        $nextPElement = $nextPElement.next();
    }
    for (let i=0; i<$pElements.length; i++) {
        console.log($pElements[i]);
    }
    let websites = $pElements.filter(value => value.includes('.com') || value.includes('.gov') || value.includes('.org') || value.includes('.edu'));
    for (let i=0; i<websites.length; i++) {
        websites[i] = websites[i] += '\n';
    }
    
    return websites;
}

async function writeToFile(filename, data) {
    try {
        await fsPromises.writeFile(filename, data, 'utf8');
        console.log('Success!')
    } catch (err) {
        console.error("error :(");
    }
}