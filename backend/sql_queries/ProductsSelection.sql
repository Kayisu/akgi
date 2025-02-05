use db_akakce

ALTER VIEW Anasayfa_Urunler AS
SELECT 
    p.product_id,        
    p.product_name, 
    p.img_url, 
    sp.price AS lowest_price, 
    pop.popularity_value, 
    COALESCE(r.average_rating, 0) AS average_rating
FROM Products.product p
JOIN (
    SELECT 
        sp.product_id, 
        sp.price, 
        sp.seller_id
    FROM Seller.seller_products sp
    WHERE sp.price = (
        SELECT MIN(price) 
        FROM Seller.seller_products 
        WHERE product_id = sp.product_id
    )
) sp ON p.product_id = sp.product_id
JOIN Seller.seller s ON sp.seller_id = s.seller_id
JOIN Products.product_popularity pop ON p.product_id = pop.product_id
JOIN Category.category c ON p.category_id = c.category_id
LEFT JOIN Products.product_ratings r ON p.product_id = r.product_id;

select top 100 * from AnaSayfa_Urunler order by popularity_value desc



GO
create PROCEDURE GetProductsByCategory
    @category_id INT 
AS
BEGIN
    
    SELECT 
        p.product_name, 
        sp.price, 
        COALESCE(r.average_rating, 0) AS average_rating
    FROM Products.product p
	JOIN (
    SELECT 
        sp.product_id, 
        sp.price, 
        sp.seller_id
    FROM Seller.seller_products sp
    WHERE sp.price = (
        SELECT MIN(price) 
        FROM Seller.seller_products 
        WHERE product_id = sp.product_id
    )
) sp ON p.product_id = sp.product_id
    JOIN Seller.seller s ON sp.seller_id = s.seller_id
    JOIN Products.product_popularity pop ON p.product_id = pop.product_id
    LEFT JOIN Products.product_ratings r ON p.product_id = r.product_id
    WHERE p.category_id = @category_id
    ORDER BY pop.popularity_value DESC; 
END;
Go

EXEC GetProductsByCategory @category_id = 1; 


ALTER PROCEDURE GetProductsByAttributeId
    @attribute_id INT,
    @orderByClause NVARCHAR(50),
    @sortOrder NVARCHAR(4)
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX);

    SET @sql = N'
    SELECT 
        p.product_id,
        p.product_name,
        p.img_url,
        sp.price AS lowest_price,
        COALESCE(r.average_rating, 0) AS average_rating,
        pop.popularity_value
    FROM Products.product p
    JOIN (
        SELECT 
            sp.product_id, 
            MIN(sp.price) AS price
        FROM Seller.seller_products sp
        GROUP BY sp.product_id
    ) sp ON p.product_id = sp.product_id
    LEFT JOIN Products.product_ratings r ON p.product_id = r.product_id
    JOIN Products.product_popularity pop ON p.product_id = pop.product_id
    WHERE p.attribute_id = @attribute_id
    ORDER BY ' + QUOTENAME(@orderByClause) + ' ' + @sortOrder;

    EXEC sp_executesql @sql, N'@attribute_id INT', @attribute_id;
END;

EXEC GetProductsByAttributeId @attribute_id = 1, @orderByClause = 'product_name', @sortOrder = 'desc'


-- the product in product page

select * from Products.product where product_id = 5

--attribute values in product page
	SELECT ca.attribute_name, pav.attribute_value
FROM Products.product p
JOIN Category.category_attributes ca ON p.attribute_id = ca.attribute_id
JOIN Products.product_attribute_values pav ON ca.attribute_id = pav.attribute_id


--seller section in product page
 SELECT sp.price, s.seller_name, s.seller_rating 
                FROM Seller.seller_products sp 
                JOIN Seller.seller s ON sp.seller_id = s.seller_id 
                WHERE sp.product_id = 5
                ORDER BY sp.price ASC