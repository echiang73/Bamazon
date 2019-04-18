DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(50) NOT NULL,
  product_description VARCHAR(100) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  sales_price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  product_sales DECIMAL(10,2)
);

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL,
  over_head_costs DECIMAL(15,4) NOT NULL
);

SELECT * FROM products;
SELECT * FROM departments;