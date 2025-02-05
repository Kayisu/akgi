	create database db_akakce
	use db_akakce
	CREATE SCHEMA Products;

	CREATE SCHEMA Seller;

	CREATE SCHEMA Category;

	CREATE SCHEMA [User];

	CREATE TABLE Category.category (
		category_id INT PRIMARY KEY IDENTITY(1,1),
		category_name NVARCHAR(50) NOT NULL
	);

	CREATE TABLE Category.subcategory (
		subcategory_id INT PRIMARY KEY IDENTITY(1,1),
		category_id INT FOREIGN KEY REFERENCES Category.category(category_id),
		subcategory_name NVARCHAR(100) NOT NULL
	);

	CREATE TABLE Category.category_attributes (
		attribute_id INT PRIMARY KEY IDENTITY(1,1),
		subcategory_id INT FOREIGN KEY REFERENCES Category.subcategory(subcategory_id),
		attribute_name NVARCHAR(255) NOT NULL
	);

	CREATE TABLE Products.product (
	
		product_id INT PRIMARY KEY IDENTITY(1,1),
		category_id INT FOREIGN KEY REFERENCES Category.category(category_id),
		subcategory_id INT FOREIGN KEY REFERENCES Category.subcategory(subcategory_id),
		attribute_id INT FOREIGN KEY REFERENCES Category.category_attributes(attribute_id),
		product_name NVARCHAR(75) NOT NULL,
		product_description NVARCHAR(MAX),
		creation_date DATETIME DEFAULT GETDATE(),
		img_url NVARCHAR(255)
	);

	CREATE TABLE Products.product_categories (
		product_id INT FOREIGN KEY REFERENCES Products.product(product_id),
		category_id INT FOREIGN KEY REFERENCES Category.category(category_id),
		subcategory_id INT FOREIGN KEY REFERENCES Category.subcategory(subcategory_id),
		attribute_id INT FOREIGN KEY REFERENCES Category.category_attributes(attribute_id)
	);

	CREATE TABLE Products.product_ratings (
		product_id INT PRIMARY KEY FOREIGN KEY REFERENCES Products.product(product_id),
		average_rating DECIMAL(3,2) DEFAULT 0, 
	);


CREATE TABLE Products.product_user_views (
    product_id INT,
    user_id INT,
    PRIMARY KEY (product_id, user_id)
);

CREATE TABLE Products.product_visits (
    product_id INT PRIMARY KEY,
    visit_count INT
);

	CREATE TABLE Seller.seller (
		seller_id INT PRIMARY KEY IDENTITY(1,1),
		seller_name NVARCHAR(100) NOT NULL,
		seller_rating DECIMAL(3,2) CHECK (seller_rating BETWEEN 0 AND 5)
	);

	CREATE TABLE Seller.seller_products (
		seller_product_id INT PRIMARY KEY IDENTITY(1,1),
		seller_id INT FOREIGN KEY REFERENCES Seller.seller(seller_id),
		product_id INT FOREIGN KEY REFERENCES Products.product(product_id),
		price DECIMAL(10,2) NOT NULL
	);

	CREATE TABLE [User].users (
		[user_id] INT PRIMARY KEY IDENTITY(1,1),
		name NVARCHAR(75) NOT NULL,
		email NVARCHAR(150) UNIQUE NOT NULL,
		password NVARCHAR(75) NOT NULL
	);

	CREATE TABLE Products.product_images (
		image_id INT PRIMARY KEY IDENTITY(1,1),
		product_id INT FOREIGN KEY REFERENCES Products.product(product_id),
		img_url NVARCHAR(2083)
	);

	CREATE TABLE Products.product_attribute_values (
		attribute_value_id INT PRIMARY KEY IDENTITY(1,1),
		attribute_id INT FOREIGN KEY REFERENCES Category.category_attributes(attribute_id),
		attribute_value NVARCHAR(255) NOT NULL
	);

	CREATE TABLE [User].user_reviews (
		review_id INT PRIMARY KEY IDENTITY(1,1),
		[user_id] INT FOREIGN KEY REFERENCES [User].users([user_id]),
		product_id INT FOREIGN KEY REFERENCES Products.product(product_id),
		review_text NVARCHAR(MAX),
		rating DECIMAL(2,1) CHECK (rating BETWEEN 0 AND 5),
		review_date DATETIME DEFAULT GETDATE()
	);

	CREATE TABLE [admin] (
		admin_id INT PRIMARY KEY IDENTITY(1,1),
		login NVARCHAR(75) NOT NULL UNIQUE,
		password NVARCHAR(75) NOT NULL
	);

	CREATE TABLE search_history (
		search_id INT PRIMARY KEY IDENTITY(1,1),
		[user_id] INT FOREIGN KEY REFERENCES [User].users([user_id]),
		search_text NVARCHAR(255) NOT NULL,
		search_date DATETIME DEFAULT GETDATE()
	);
	CREATE TABLE Products.product_popularity (
		popularity_id INT PRIMARY KEY IDENTITY(1,1),  -- Otomatik artan birincil anahtar
		product_id INT NOT NULL,                      -- Ürün ID (Zorunlu)
		popularity_value INT,                         -- Popülerlik deðeri
		FOREIGN KEY (product_id) REFERENCES Products.product(product_id)  -- Dýþ anahtar
);
	CREATE TABLE [User].activity_logs (
		log_id INT PRIMARY KEY IDENTITY(1,1),
		[user_id] INT FOREIGN KEY REFERENCES [User].users([user_id]),
		activity NVARCHAR(MAX),
		log_date DATETIME DEFAULT GETDATE()
	);
	CREATE TABLE faq (
		faq_id INT PRIMARY KEY IDENTITY(1,1),
		question NVARCHAR(MAX) NOT NULL,
		answer NVARCHAR(MAX) NOT NULL
	);
	CREATE TABLE Products.user_favorites (
		product_id int foreign key references Products.product(product_id),
		user_id int foreign key references [User].users(user_id))
