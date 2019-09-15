"use strict";
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const readline = require('readline');

let db = new sqlite3.Database('./iwdb.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
    
    let s = 0;
    let id = '';
    let seq = '';

    const readInterface = readline.createInterface({
        input: fs.createReadStream('./pdb.txt')
    });

    readInterface.on('line', function(line) {
        if(line[0] === '>'){
            const pattern = /[^>]\w+/;
            id = line.match(pattern)[0].toUpperCase();
        } else {    
            seq = line;
        }
        s++;
        if(s%2 === 0){
            db.run(`INSERT INTO pdb(pdb,sequence) VALUES ('${id}','${seq}')`, function(err) {
                if (err) {
                return console.log(err.message);
                }
            });
            line = 0;
        }
    });

    readInterface.on('close', function(){
        console.log('Data successfuly transfered!')
        db.close();
    });
});


/*readInterface.on('close', function(line){
    console.log('File successfuly read');
    let db = new sqlite3.Database('../../iwdb.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the database.');
      });
    
    ids.forEach(function(currentValue, index, array) {
        db.run(`INSERT INTO pdb(pdb, sequence) VALUES(${currentValue},'${sqs[index]}')`, function(err) {
            if (err) {
              return console.log(err.message);
            }
            console.log('.');
          });
    });

    db.close();
});*/
