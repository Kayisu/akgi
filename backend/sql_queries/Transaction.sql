use db_akakce

--Review set & update rating

alter procedure AddReviewAndUpdateRating
    @user_id int,
    @product_id int,
    @review_text nvarchar(max),
    @rating int
	
as
begin
    begin try
        begin transaction;

        insert into [User].user_reviews (user_id, product_id, review_text, rating, review_date)
        values (@user_id, @product_id, @review_text, @rating, getdate());

        update Products.product_ratings
        set average_rating = (
            select avg(cast(rating as float))
            from [User].user_reviews
            where product_id = @product_id
        )
        where product_id = @product_id;

        commit transaction;
    end try
    begin catch
        rollback transaction;
        throw;
    end catch
end;


exec AddReviewAndUpdateRating @user_id = 2, @product_id = 691, @review_text='ýyý',@rating=4

select * from [User].user_reviews


-- User deletion

alter procedure DeleteUser
    @user_id int
as
begin
    begin try
begin transaction;

        delete from [Products].[user_favorites] where user_id = @user_id;

        delete from [User].[user_reviews] where user_id = @user_id;

        delete from [User].[activity_logs] where user_id = @user_id;

        delete from [User].[users] where user_id = @user_id;

        commit transaction;
    end TRY
    begin catch
        if @@TRANCOUNT > 0
            rollback transaction;

        throw;
    end catch;
end;

use db_akakce

select * from [User].users 

