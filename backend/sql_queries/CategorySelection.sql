-- category , subcategory & attribute selection

SELECT sc.subcategory_id, sc.subcategory_name
            FROM Category.subcategory sc
            JOIN Category.category c ON sc.category_id = c.category_id
            WHERE c.category_name = 'Elektronik';

SELECT sc.subcategory_name, c.category_name
            FROM Category.subcategory sc
            JOIN Category.category c ON sc.category_id = c.category_id
            WHERE sc.subcategory_id = '1';

select a.attribute_id, a.attribute_name from Category.category_attributes a
        join Category.subcategory sc 
        on sc.subcategory_id = a.subcategory_id
        where sc.subcategory_id = '1';