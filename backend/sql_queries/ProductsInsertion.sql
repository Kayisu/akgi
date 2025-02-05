use db_akakce




CREATE TABLE #TempAttributes (
    category_id INT,
    subcategory_id INT,
    attribute_id INT, 
    attribute_count INT 
);

WITH RankedAttributes AS (
    SELECT 
        c.category_id,
        sc.subcategory_id,
        ca.attribute_id,
        ROW_NUMBER() OVER (PARTITION BY c.category_id, sc.subcategory_id ORDER BY ca.attribute_id) AS attribute_count
    FROM Category.category c
    JOIN Category.subcategory sc ON c.category_id = sc.category_id
    JOIN Category.category_attributes ca ON sc.subcategory_id = ca.subcategory_id
)
INSERT INTO #TempAttributes (category_id, subcategory_id, attribute_id, attribute_count)
SELECT category_id, subcategory_id, attribute_id, attribute_count
FROM RankedAttributes;


DECLARE @max_count INT = 100; 
WITH Numbers AS (

    SELECT TOP (@max_count) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS product_count
    FROM master.dbo.spt_values
)
INSERT INTO Products.product (category_id, subcategory_id, attribute_id, product_name, product_description, creation_date, img_url)
SELECT 
    ta.category_id,
    ta.subcategory_id,
    ta.attribute_id, 
    CONCAT('Ürün ', ROW_NUMBER() OVER (ORDER BY ta.category_id, ta.subcategory_id, ta.attribute_count, n.product_count)) AS product_name, 
    CONCAT('Ürün ', ROW_NUMBER() OVER (ORDER BY ta.category_id, ta.subcategory_id, ta.attribute_count, n.product_count), ' açýklamasý.') AS description, 
    GETDATE() AS creation_date, 
    CONCAT('http://localhost:5000/Images/urun_', ta.category_id, '_', ta.subcategory_id, '_', ta.attribute_count, '_', n.product_count, '.png') AS img_url 
FROM #TempAttributes ta
CROSS JOIN Numbers n; 

DROP TABLE #TempAttributes;


INSERT INTO Products.product_attribute_values (attribute_id, attribute_value)
SELECT 
    t.attribute_id, 
    CONCAT(t.attribute_name, ' ', v.num) AS attribute_value 
FROM 
    (SELECT 
         ca.attribute_id, 
         ca.attribute_name
     FROM 
         Category.category_attributes ca
    ) AS t
CROSS APPLY 
    (VALUES (1), (2), (3)) AS v(num) 
ORDER BY 
    t.attribute_id, 
    v.num; 
SELECT * FROM  Products.product_attribute_values

INSERT INTO Products.product_categories (product_id, category_id, subcategory_id,attribute_id)
SELECT 
    p.product_id,            
    c.category_id,           
    sc.subcategory_id,        
	a.attribute_id			 
FROM 
    Products.product p       
JOIN 
    Category.category c      
    ON p.category_id = c.category_id
JOIN 
    Category.subcategory sc  
    ON p.subcategory_id = sc.subcategory_id
JOIN
	Category.category_attributes a
	ON p.attribute_id = a.attribute_id
ORDER BY 
    p.product_id,            
    c.category_id,           
    sc.subcategory_id,      
	a.attribute_id;

SELECT * FROM Products.product_categories;


INSERT INTO Products.product_images (product_id,img_url)
	SELECT p.product_id, p.img_url FROM Products.product p



select * from Products.product_images



INSERT INTO Products.product_popularity (product_id, popularity_value)
SELECT 
    p.product_id, 
    ISNULL(pv.view_count, 0) * 0.5 + ISNULL(pv.view_count, 0) * 0.3 + ISNULL(pr.average_rating, 0) * 20 AS popularity_value

FROM 
    Products.product p
LEFT JOIN Products.product_views pv ON p.product_id = pv.product_id
LEFT JOIN Products.product_visits pv2 ON p.product_id = pv2.product_id
LEFT JOIN Products.product_ratings pr ON p.product_id = pr.product_id;

select * from   Products.product_popularity


--DBCC CHECKIDENT ('[Products].product_ratings', RESEED, 0);
INSERT INTO Products.product_ratings (product_id, average_rating)
SELECT 
    p.product_id, 
    COALESCE(AVG(r.rating), 0) AS average_rating  
FROM 
    Products.product p
LEFT JOIN [User].user_reviews r ON p.product_id = r.product_id 
GROUP BY 
    p.product_id;  

select * from Products.product_ratings


insert into Products.product_visits (product_id,visit_count)
select product_id,0
from Products.product


create TRIGGER trg_UpdateProductVisits
ON Products.product_user_views
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @product_id INT;
    DECLARE @user_id INT;

    SELECT @product_id = inserted.product_id, @user_id = inserted.user_id
    FROM inserted;

    
    IF NOT EXISTS (
        SELECT 1
        FROM Products.product_user_views
        WHERE product_id = @product_id AND user_id = @user_id
    )
    BEGIN
        UPDATE Products.product_visits
        SET visit_count = visit_count + 1
        WHERE product_id = @product_id;

       
        IF @@ROWCOUNT = 0
        BEGIN
            INSERT INTO Products.product_visits (product_id, visit_count)
            VALUES (@product_id, 1);
        END
    END
END;




