/**
 * This question asked to fetch data from an API endpoint using the https library of nodeJS. I fetch the data and store them in the array,
 * if the required country code is not present, I store the data and fetch again using recursion and promise chaining.
 * */
'use strict';


const fs = require('fs');
const https = require('https');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}

const info = {
    page :1,
    total : 0,
    data  :[]
}
async function getCountryName(code) {
    if (info.data.length != 0) {

        for (const data of info.data) {
            if (data.alpha2Code == code) {
                return data.name;
            }
        }
    }
    return new Promise((resolve, reject) => {
        const url = new URL('https://jsonmock.hackerrank.com/api/countries');
        url.searchParams.set('page', info.page);

        https.get(url.toString(), (res) => {
            let rawData = '';

            res.on('data', (chunk) => {
                rawData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);


                    info.data.push(...parsedData.data);
                    console.group(parsedData.data[0])
                    info.page++;
                    info.total += parsedData.per_page;


                    for (const country of parsedData.data) {

                        if (country.alpha2Code == code) {
                            console.log(country)
                            return resolve(country.name);
                        }
                    }


                    if (info.page <= parsedData.total_pages) {

                        getCountryName(code).then(resolve).catch(reject);
                    } else {

                        resolve(null);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}
// write your code here
// API endpoint: https://jsonmock.hackerrank.com/api/countries?page=<PAGE_NUMBER>

async function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const code = readLine().trim();

    const name = await getCountryName(code);

    ws.write(`${name}\n`);

}
