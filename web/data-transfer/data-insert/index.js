"use strict";
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const parse = require('csv-parse');

const file = './S2648.csv'

fs.readFile(file, function (err, fileData) {
    if (err) {
        console.error(err.message);
    }
    parse(fileData, {columns: true, trim: true, delimiter: ';'}, function(err, rows) {

        const pattern = /^\w+/;

        const log = 'output.log';
        fs.writeFileSync(log, '');
        let logStream = fs.createWriteStream(log, {flags:'a'});

        let db = new sqlite3.Database('./iwdb.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the database.');
        });
        const sql = `SELECT id, sequence
                            FROM pdb
                            WHERE pdb.pdb  = ?`;

        rows.forEach(element => {
            let pdb = element.PDB.match(pattern)[0].toUpperCase();
            pdb = pdb.slice(0, 4) + "_" + pdb.slice(4);
            
            let id;
            let sequence;

            db.get(sql, [pdb], (err, row) => {
                if (err) {
                    return console.error(err.message);
                }
                if(row){
                    id = row.id;
                    sequence = row.sequence;

                    let seq_l = sequence.length;
                    if(seq_l > element.POSITION) {
                        if(sequence[element.POSITION-1] === element.WILD_TYPE){
                            db.run(`INSERT INTO data(user_id, pdb_id, wildtype, position, mutation, ddg, ph, temperature) VALUES ('1','${id}','${element.WILD_TYPE}','${element.POSITION}','${element.MUTANT}','${element.DDG}','${element.PH}','${element.TEMPERATURE}')`, function(err) {
                                if (err) {
                                    return console.log(err.message);
                                }
                            });   
                        } else {
                            logStream.write(`${pdb}:${element.WILD_TYPE}-${element.POSITION}->${element.MUTANT}: Position not equal to wildtype! \n`);
                        }
                    } else {
                        logStream.write(`${pdb}:${element.WILD_TYPE}-${element.POSITION}->${element.MUTANT}: Position overflow! \n`);
                    }
                }else{
                    logStream.write(`No data found with the PDB: ${pdb}`);
                }
            });
        });
        //logStream.end();
    db.close();
    })
  })