const reviews = require('../config/db.js');
const fs = require('fs');
const { parse } = require('csv-parse');

const filePath = '/home/benny/hackreactor/systems-design-capstone/reviews.csv';
// const copyCommand = `
//   COPY reviews(id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness)
//   FROM '/home/benny/hackreactor/systems-design-capstone/reviews.csv'
//   DELIMITER ','
//   CSV HEADER;`;

const readStream = fs.createReadStream(filePath);

module.exports = readStream;

