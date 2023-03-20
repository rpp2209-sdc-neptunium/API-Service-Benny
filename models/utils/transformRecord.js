function transformString (string) {
  let newString = "";
  for (let i = 0; i < string.length; i++) {
    if (string[i] === "'") {
      newString += "'";
    }
    newString += string[i];
  }
  return newString;
};

var transformRecord = (record) => {
  record.body = transformString(record.body);
  record.summary = transformString(record.summary);
  record.response = transformString(record.response || '');
  record.email = transformString(record.email);
  record.name = transformString(record.name);
  record.reported = record.reported || false;
  record.helpfulness = 0;
  record.photos = record.photos.map((url) => { return transformString(url) });

  return record;
}

module.exports = transformRecord;