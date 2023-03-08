exports.products =  `CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_id INTEGER UNIQUE NOT NULL
);`;

exports.results = `CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products (id),
  review_id INTEGER NOT NULL REFERENCES reviews (review_id)
);`;

exports.reviews = `CREATE TABLE IF NOT EXISTS reviews (
  review_id SERIAL PRIMARY KEY,
  id INTEGER UNIQUE NOT NULL,
  rating INTEGER NOT NULL,
  date TIMESTAMP NOT NULL,
  summary VARCHAR(100),
  body VARCHAR(1000),
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer INTEGER NOT NULL REFERENCES reviewers (id),
  response VARCHAR(1000),
  helpfulness INTEGER
);`;

exports.reviewers = `CREATE TABLE IF NOT EXISTS reviewers (
  id SERIAL PRIMARY KEY,
  reviewer_name VARCHAR(50),
  reviewer_email VARCHAR(100) UNIQUE
);`;
