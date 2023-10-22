CREATE TYPE userType AS ENUM (
    'buyer',
    'seller'
);

-- UserInfo
CREATE TABLE UserInfo(
	user_id SERIAL PRIMARY KEY,
	user_name VARCHAR NOT NULL,
	user_password VARCHAR NOT NULL,
	user_type_name userType NOT NULL,
	created_at DATE DEFAULT NOW()
)

-- CatalogInfo
CREATE TABLE CatalogInfo(
	catalog_id SMALLSERIAL PRIMARY KEY,
	user_id INT NOT NULL,
	created_at DATE DEFAULT NOW(),
	FOREIGN KEY (user_id) REFERENCES UserInfo(user_id)
)

-- ProductsInfo
CREATE TABLE ProductsInfo(
	product_id SERIAL PRIMARY KEY,
	product_name VARCHAR NOT NULL,
	product_price NUMERIC(5,2) NOT NULL,
	catalog_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	FOREIGN KEY (catalog_id) REFERENCES CatalogInfo(catalog_id)
)

-- OrderInfo
CREATE TABLE OrderInfo(
	order_id SERIAL PRIMARY KEY,
	catalog_id INT NOT NULL,
	user_id INT NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	FOREIGN KEY (catalog_id) REFERENCES CatalogInfo(catalog_id),
	FOREIGN KEY (user_id) REFERENCES UserInfo(user_id)
)