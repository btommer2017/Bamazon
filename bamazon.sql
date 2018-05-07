DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE shopping_cart(
 id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(45) NULL,
  price NUMERIC(10,2) NULL,
  quantity INTEGER(10) NULL,
  total NUMERIC(10,2) NULL
);

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price NUMERIC(10,2) NULL,
  stock_quantity INTEGER(10) NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wiffle Ball Bat", "Sports", 4.99, 100 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wiffle Ball", "Sports", 1.99, 100 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nerf Football", "Sports", 4.99, 50 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Official NFL Football", "Sports", 59.99, 25 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Baseball Cap", "Clothing", 14.99, 30 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Basketball Shoes One Size Fits All", "Clothing", 99.99, 150 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Plain Yellow T-shirt xl", "Clothing", 9.99, 30 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Plain Yellow T-shirt md", "Clothing", 9.99, 30 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Plain Yellow T-shirt sm", "Clothing", 9.99, 30 );

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Green Turtleneck xl", "Clothing", 11.99, 20 );