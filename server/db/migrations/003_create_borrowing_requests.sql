CREATE TABLE borrowing_requests (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES item(id),
  borrower_id INTEGER NOT NULL REFERENCES "user"(id),
  owner_id INTEGER NOT NULL REFERENCES "user"(id),
  status VARCHAR(20),
  message VARCHAR,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  notification VARCHAR
);