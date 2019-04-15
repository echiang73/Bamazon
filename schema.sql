DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(50) NOT NULL,
  product_description VARCHAR(100) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  sales_price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL
);

-- CREATE TABLE departments(
--   position INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
--   artists VARCHAR(100) NOT NULL,
--   album VARCHAR(100) NOT NULL,
--   album_year INT(4) NOT NULL,
--   raw_total DECIMAL(10,4) NOT NULL,
--   US_score DECIMAL(10,4) NOT NULL,
--   UK_score DECIMAL(10,4) NOT NULL,
--   Europe_score DECIMAL(10,4) NOT NULL,
--   raw_row DECIMAL(10,4) NOT NULL
-- );


SELECT * FROM products;
-- SELECT * FROM departments;