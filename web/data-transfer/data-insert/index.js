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

        let db = new sqlite3.Database('./iwdb.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the database.');
        });
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
  })