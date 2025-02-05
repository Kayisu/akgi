use db_akakce


CREATE NONCLUSTERED INDEX idx_product_name ON [db_akakce].[Products].[product](product_name);

DECLARE @query NVARCHAR(255) = '%100%'; 
DECLARE @offset INT = 0;                   
DECLARE @limit INT = 50;                   


WITH MinPrice AS (
    SELECT 
        sp.product_id, 
        MIN(sp.price) AS min_price
    FROM 
        Seller.seller_products sp
    GROUP BY 
        sp.product_id
),
RowConstrainedResult AS (
    SELECT 
        p.product_id,
        p.product_name, 
        p.product_description, 
        p.img_url,
        mp.min_price AS price,
        COALESCE(ar.average_rating, 0) AS average_rating,
        ROW_NUMBER() OVER (ORDER BY p.product_name) AS RowNum
    FROM 
        Products.product p
    LEFT JOIN 
        MinPrice mp ON p.product_id = mp.product_id
    LEFT JOIN 
        Products.product_ratings ar ON p.product_id = ar.product_id
    WHERE 
        LOWER(p.product_name) LIKE @query
)
-- Ýstenen sayfa verilerini döndür
SELECT *
FROM RowConstrainedResult
WHERE RowNum > @offset AND RowNum <= (@offset + @limit)
ORDER BY RowNum;

-- Toplam ürün sayýsýný da kontrol et
SELECT COUNT(DISTINCT p.product_id) AS totalProducts
FROM Products.product p
LEFT JOIN Seller.seller_products sp ON p.product_id = sp.product_id
WHERE LOWER(p.product_name) LIKE @query;
