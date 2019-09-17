/*
select data.id, pdb.pdb, pdb.sequence, data.wildtype, data.position, data.mutation, data.ddg, data.ph, data.temperature from data, pdb
where data.pdb_id = pdb.id
*/

"use strict";
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const parse = require('csv-stringify');

const file = 'output.log';
let working = [];

fs.writeFileSync(file, '');
let logStream = fs.createWriteStream(file, {flags:'a'});
    
let db = new sqlite3.Database('./iwdb.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

let sql = `SELECT * FROM dataset`;

db.all(sql,[],(err, rows ) => {
    if (err) {
        console.error(err.message);
    }
    rows.forEach(row => {
        let seq_l = row.sequence.length;
        if(seq_l > row.position) {
            if(row.sequence[row.position-1] === row.wildtype){
                working.push(row.id);
            } else {
                logStream.write(`${row.id}: Position not equal to wildtype! \n`);
            }
        } else {
            logStream.write(`${row.id}: Position overflow! \n`);
        }
    });
    logStream.write(`Working proteins: \n ${working} \n`);
    logStream.end();
});

db.close();

/*
fs.readFile(file, function (err, fileData) {
    if (err) {
        console.error(err.message);
    }
    parse(fileData, {columns: true, trim: true, delimiter: ';'}, function(err, rows) {

        const pattern = /^\w+/;

        const sql = `SELECT id
                            FROM pdb
                            WHERE pdb.pdb  = ?`;

        rows.forEach(element => {
            let pdb = element.PDB.match(pattern)[0].toUpperCase();
            pdb = pdb.slice(0, 4) + "_" + pdb.slice(4);
            
            let id;

            db.get(sql, [pdb], (err, row) => {
                if (err) {
                    return console.error(err.message);
                }
                row
                ? id = row.id
                : console.log(`No data found with the id ${pdb}`);
                db.run(`INSERT INTO data(user_id, pdb_id, wildtype, position, mutation, ddg) VALUES ('1','${id}','${element.WILD_TYPE}','${element.POSITION}','${element.MUTANT}','${element.DDG}')`, function(err) {
                    if (err) {
                    return console.log(err.message);
                    }
                });   
            });
        });
        db.close();
    })
  })*/