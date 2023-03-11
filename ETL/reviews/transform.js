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
  record.response = transformString(record.response);
  record.reviewer_email = transformString(record.reviewer_email);
  record.reviewer_name = transformString(record.reviewer_name);

  return record;
}

module.exports = transformRecord;