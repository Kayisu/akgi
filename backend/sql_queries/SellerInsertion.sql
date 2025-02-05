use db_akakce

--DBCC CHECKIDENT ('[Seller].seller', RESEED, 0);

INSERT INTO Seller.seller (seller_name, seller_rating)
SELECT 
    CONCAT('Satýcý ', n.number) AS seller_name,  
    ROUND((RAND(CHECKSUM(NEWID())) * 5), 2) AS seller_rating  
FROM 
    (SELECT TOP 200 ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS number 
     FROM master.dbo.spt_values) n;

SELECT * FROM Seller.seller;

-- Seller tablosundaki verileri silme
--delete from Seller.seller;



--DBCC CHECKIDENT ('[Seller].seller_products', RESEED, 0);

WITH ProductWithSeller AS (
    
    SELECT 
        p.product_id,
        s.seller_id,
        ROW_NUMBER() OVER (PARTITION BY p.product_id ORDER BY NEWID()) AS seller_row --her satýcýya ilgili ürün id için ayrý id atýyor
    FROM 
        Products.product p
    CROSS JOIN 
        Seller.seller s
),
SelectedSellers AS (
    
    SELECT 
        ps.product_id,
        ps.seller_id
    FROM 
        ProductWithSeller ps
    WHERE 
        ps.seller_row <= ABS(CHECKSUM(NEWID())) % 10 + 1 
)
INSERT INTO Seller.seller_products (seller_id, product_id, price)
SELECT 
    ss.seller_id,
    ss.product_id,
    ROUND(RAND(CHECKSUM(NEWID())) * 9900 + 100, 2) AS price 
FROM 
    SelectedSellers ss;



	select *from Seller.seller_products

	use db_akakce