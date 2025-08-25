/**
 * The question was about creating a function which would recieve a said level number and a separator character,
 * this function should return a function which then would recieve an array of strings(the function is called using the spread operator)
 * which then is recieved by an array in the arguement. This function returns a single string of all the messages which have level higher than or equal to the set level, separated by the set separator.
 * */

'use strict';

const fs = require('fs');


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

const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

function logger(msg) {
    ws.write(`${msg.text}\n`);
}
const Logger  = (
    function logger(){
        let m_level;
        let m_setSeparator;


        return {
            setL: function(level) {
                m_level = level;
            },
            setS: function(separator) {
                m_setSeparator = separator;
            },
            getL: function(){
                return m_level;
            },
            getSep: function(){
                return m_setSeparator;
            }
        }
    }
)();
function joinedLogger(level, sep) {
    let myLogger = Logger;
    myLogger.setL(level);
    myLogger.setS(sep);
    return function (...messages) {
        const setLevel = myLogger.getL();
        const separator = myLogger.getSep();
        console.log(setLevel, separator)
        const finalMessages = [];
        for(const message of messages){
            if(message.level >= setLevel){
                finalMessages.push(message.text);
            }
        }
        ws.write(finalMessages.join(separator));
    }
}
// write your code here

function main() {
    const firstLine = readLine().trim().split(" ");
    const level = parseInt(firstLine[0]);
    const sep = firstLine[1];
    const myLog = joinedLogger(level, sep);

    const n = parseInt(readLine().trim());
    let messages = [];
    for (let i = 0; i < n; ++i) {
        const line = readLine().trim().split(" ");
        const level = parseInt(line[0]);
        const text = line[1];
        messages.push({ level, text });
    }
    myLog(...messages);
    ws.end();
}
