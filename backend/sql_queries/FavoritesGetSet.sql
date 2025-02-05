use db_akakce

alter PROCEDURE GetUserFavorites
    @user_id INT
AS
BEGIN
    
    SELECT 
        uf.product_id,
        p.product_name,
        p.img_url,
        sp.price AS lowest_price,
        COALESCE(pr.average_rating, 0) AS average_rating
    FROM Products.user_favorites uf
    JOIN Products.product p ON uf.product_id = p.product_id
    JOIN (
        
        SELECT 
            sp.product_id,
            MIN(sp.price) AS price
        FROM Seller.seller_products sp
        GROUP BY sp.product_id
    ) sp ON p.product_id = sp.product_id
    LEFT JOIN Products.product_ratings pr ON p.product_id = pr.product_id
    WHERE uf.user_id = @user_id
    ORDER BY p.product_name; 
END;
GO


insert into Products.user_favorites values 

(691,112)


select * from [User].users


alter PROCEDURE ToggleFavorite
    @user_id INT,
    @product_id INT
AS
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM Products.user_favorites
        WHERE user_id = @user_id AND product_id = @product_id
    )
    BEGIN
        DELETE FROM Products.user_favorites
        WHERE user_id = @user_id AND product_id = @product_id;
    END
    ELSE
    BEGIN
        INSERT INTO Products.user_favorites (user_id, product_id)
        VALUES (@user_id, @product_id);
    END
END;
GO


