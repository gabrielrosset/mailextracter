const createCsvWriter = require('csv-writer').createObjectCsvWriter;

var fileToRead = 'all.txt';
var fileToWrite = 'all.csv';

const csvWriter = createCsvWriter({  
  path: fileToWrite,
  header: [
    {id: 'mail', title: 'mail'}
  ]
});
var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(fileToRead)
});

var mailRegExp = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
const data = [];
var cpt = 1;
var nbDuplicates = 0;

lineReader.on('line', function (line) {
    var match = mailRegExp.exec(line);
    if(Array.isArray(match) && match.length > 0) {
        const duplicates = data.filter(word => {
            return (word.mail === match[0]);
        });
        if(duplicates.length === 0) {
            // console.log(`Line ${cpt} from file:`, line);
            // console.log(`Match is:`, match[0]);
            data.push({ mail: match[0]});
        } else {
            console.log(`Match duplicate for:`, match[0]);
            nbDuplicates++;
        }
    }
    cpt++;
});

lineReader.on('close', function (line) {
    console.log(`${nbDuplicates} duplicates found !`);
    csvWriter  
        .writeRecords(data)
        .then(()=> console.log('The CSV file was written successfully'));
});
