const cors = require('cors');
const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');


app.use(cors());
app.use(express.json());
require('dotenv').config();
app.use('/Images', express.static(path.join(__dirname, 'Images')));


const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: 'localhost',
    database: 'db_akakce',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

sql.connect(config)
    .then(() => console.log('Connected to database'))
    .catch((err) => console.error('Database connection failed:', err));

//#region User



app.get('/api/favorites/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .execute('GetUserFavorites');

        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Failed to fetch user favorites.' });
    }
});

app.post('/api/toggle-favorite', async (req, res) => {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).json({ error: 'Kullanıcı ID ve ürün ID gereklidir.' });
    }

    try {
        const pool = await sql.connect(config);

        await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('product_id', sql.Int, product_id)
            .execute('ToggleFavorite');

        res.status(200).json({ message: 'Favori durumu değiştirildi.' });
    } catch (error) {
        console.error('Favori durumu değiştirilirken hata oluştu:', error);
        res.status(500).json({ error: 'Favori durumu değiştirilemedi.' });
    }
});



app.get('/api/get-user-id', (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }
    res.json({ userId });
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('name', sql.NVarChar(75), username)
            .input('email', sql.NVarChar(150), email)
            .input('password', sql.NVarChar(75), hashedPassword)
            .query(`
                INSERT INTO [User].users (name, email, password)
                VALUES (@name, @email, @password)
            `);

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        if (error.originalError && error.originalError.info && error.originalError.info.number === 2627) {
            return res.status(400).json({ error: 'Email already exists.' });
        }
        console.error(error);
        res.status(500).json({ error: 'An error occurred while registering the user.' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email/Username and password are required.' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('email', sql.NVarChar(150), email)
            .query(`
                 SELECT * FROM [User].users WHERE email = @email
            `);

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                await pool.request()
                    .input('UserID', sql.Int, user.user_id)
                    .input('Activity', sql.NVarChar(255), 'Login işlemi')
                    .execute('LogLoginActivity');
                res.status(200).json({ message: 'Login successful.', user_id: user.user_id });
            } else {
                res.status(401).json({ error: 'Invalid email/username or password.' });
            }
        } else {
            res.status(401).json({ error: 'Invalid email/username or password.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

app.post('/logout', async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
        console.error('Logout: UserID eksik.');
        return res.status(400).json({ error: 'UserID gerekli.' });
    }

    try {
        const pool = await sql.connect(config);

        // Kullanıcı hâlâ var mı kontrol ediyoruz
        const userCheck = await pool.request()
            .input('UserID', sql.Int, user_id)
            .query('SELECT user_id FROM [User].users WHERE user_id = @UserID');

        // Kullanıcı veritabanında yoksa direkt başarı yanıtı döndürüyoruz
        if (userCheck.recordset.length === 0) {
            return res.status(200).json({ message: 'Kullanıcı zaten silinmiş veya yok.' });
        }

        await pool.request()
            .input('UserID', sql.Int, user_id)
            .input('Activity', sql.NVarChar(255), 'Logout işlemi')
            .execute('LogLoginActivity');

        res.status(200).json({ message: 'Logout başarılı.' });
    } catch (error) {
        console.error('Logout sırasında hata oluştu:', error);
        res.status(500).json({ error: 'Bir hata oluştu.' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT user_id, name, email FROM [User].users
        `);
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

app.post('/delete-account', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email bilgisi gerekli.' });
    }

    try {
        const pool = await sql.connect(config);


        const userResult = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT user_id FROM [User].users WHERE email = @email');

        if (userResult.recordset.length === 0) {

            return res.status(200).json({ message: 'Kullanıcı zaten silinmiş veya yok.' });
        }

        const user_id = userResult.recordset[0].user_id;

        const deleteResult = await pool.request()
            .input('user_id', sql.Int, user_id)
            .execute('DeleteUser');

        res.status(200).json({ message: 'Hesap ve yorumlar başarıyla silindi.' });

    } catch (error) {
        console.error('Hesap silinirken bir hata oluştu:', error);
        res.status(500).json({ message: 'Bir sunucu hatası oluştu.' });
    }
});

app.post('/update-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const pool = await sql.connect(config);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.request()
            .input('email', sql.VarChar, email)
            .input('hashedPassword', sql.VarChar, hashedPassword)
            .query('UPDATE [User].[users] SET [password] = @hashedPassword WHERE [email] = @email');

        res.json({ message: 'Şifre başarıyla güncellendi.' });
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ message: 'Şifre güncellenirken bir hata oluştu.' });
    }
});

app.post('/update-email', async (req, res) => {
    const { oldEmail, newEmail } = req.body;

    if (!oldEmail || !newEmail) {
        return res.status(400).json({ message: 'Mevcut ve yeni email belirtilmelidir.' });
    }

    let pool;

    try {
        pool = await sql.connect(config);

        const updateQuery = `
            UPDATE [User].[users]
            SET email = @newEmail
            WHERE email = @oldEmail
        `;

        const result = await pool
            .request()
            .input('oldEmail', sql.VarChar, oldEmail)
            .input('newEmail', sql.VarChar, newEmail)
            .query(updateQuery);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Email başarıyla güncellendi.' });
        } else {
            res.status(404).json({ message: 'Belirtilen email adresi bulunamadı.' });
        }
    } catch (error) {
        console.error('Email güncelleme hatası:', error.message);
        res.status(500).json({ message: 'Sunucu hatası, email güncellenemedi.' });
    } finally {
        if (pool) {
            pool.close();
        }
    }
});

app.delete('/api/users/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const pool = await sql.connect(config);
        const userCheck = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query('SELECT user_id FROM [User].users WHERE user_id = @user_id');

        if (userCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        await pool.request()
            .input('user_id', sql.Int, user_id)
            .execute('DeleteUser');

        res.status(200).json({ message: 'Kullanıcı başarıyla silindi.' });
    } catch (error) {
        console.error('Kullanıcı silinirken hata oluştu:', error);
        res.status(500).json({ message: 'Kullanıcı silinemedi.' });
    }
});

//#endregion

//#region Category

app.get('/api/categories', async (req, res) => {
    try {
        const result = await sql.query`SELECT category_name FROM Category.category`;
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

app.get('/api/subcategories/:category', async (req, res) => {
    const { category } = req.params;
    try {
        const result = await sql.query`
            SELECT sc.subcategory_id, sc.subcategory_name
            FROM Category.subcategory sc
            JOIN Category.category c ON sc.category_id = c.category_id
            WHERE c.category_name = ${category}`;
        res.json(result.recordset); // recordset doğrudan döndürülüyor
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ error: 'Failed to fetch subcategories' });
    }
});

app.get('/api/subcategory/:subcategoryId', async (req, res) => {
    const { subcategoryId } = req.params;
    try {
        const result = await sql.query`
            SELECT sc.subcategory_name, c.category_name
            FROM Category.subcategory sc
            JOIN Category.category c ON sc.category_id = c.category_id
            WHERE sc.subcategory_id = ${subcategoryId}`;
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ error: 'Subcategory not found' });
        }
    } catch (error) {
        console.error('Error fetching subcategory details:', error);
        res.status(500).json({ error: 'Failed to fetch subcategory details' });
    }
});

app.get('/api/attributes/:subcategoryId', async (req, res) => {
    const { subcategoryId } = req.params;
    try {
        const result = await sql.query`
        select a.attribute_id, a.attribute_name from Category.category_attributes a
        join Category.subcategory sc 
        on sc.subcategory_id = a.subcategory_id
        where sc.subcategory_id = ${subcategoryId}`;
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching attributes:', error);
        req.status(500).json({ error: 'Failed to fetch attributes' });
    }
})

app.get('/api/attribute/:attribute_id', async (req, res) => {
    const { attribute_id } = req.params;

    try {
        const result = await sql.query`
            SELECT attribute_id, attribute_name, subcategory_id
            FROM Category.category_attributes
            WHERE attribute_id = ${attribute_id}
        `;
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ error: 'Attribute not found.' });
        }
    } catch (error) {
        console.error('Error fetching attribute details:', error);
        res.status(500).json({ error: 'Failed to fetch attribute details.' });
    }
});

//#endregion

//#region Products
app.post('/api/view-product', async (req, res) => {
    const { product_id, user_id } = req.body;
    if (!user_id) {
        return res.status(401).json({ error: 'Ürünü görüntülemek için giriş yapmanız gerekiyor.' });
    }

    try {
        const pool = await sql.connect(config);

        const userViewResult = await pool.request()
            .input('product_id', sql.Int, product_id)
            .input('user_id', sql.Int, user_id)
            .query('SELECT * FROM Products.product_user_views WHERE product_id = @product_id AND user_id = @user_id');

        if (userViewResult.recordset.length > 0) {
            return res.status(200).json({ message: 'Kullanıcı zaten ürünü görüntüledi.' });
        }

        await pool.request()
            .input('product_id', sql.Int, product_id)
            .input('user_id', sql.Int, user_id)
            .query('INSERT INTO Products.product_user_views (product_id, user_id) VALUES (@product_id, @user_id)');

        const productViewResult = await pool.request()
            .input('product_id', sql.Int, product_id)
            .query('SELECT * FROM Products.product_visits WHERE product_id = @product_id');

        if (productViewResult.recordset.length > 0) {
            await pool.request()
                .input('product_id', sql.Int, product_id)
                .query('UPDATE Products.product_visits SET visit_count = visit_count + 1 WHERE product_id = @product_id');
        } else {
            await pool.request()
                .input('product_id', sql.Int, product_id)
                .query('INSERT INTO Products.product_visits (product_id, visit_count) VALUES (@product_id, 1)');
        }

        res.status(200).json({ message: 'Ürün görüntüleme kaydedildi.' });
    } catch (error) {
        console.error('Görüntüleme kaydedilirken bir hata oluştu:', error);
        res.status(500).json({ error: 'Görüntüleme kaydedilemedi.' });
    }
});

app.get('/api/view-count/:product_id', async (req, res) => {
    const { product_id } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('product_id', sql.Int, product_id)
            .query('SELECT visit_count FROM Products.product_visits WHERE product_id = @product_id');

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ error: 'Ürün bulunamadı.' });
        }
    } catch (error) {
        console.error('Görüntüleme sayısı alınırken bir hata oluştu:', error);
        res.status(500).json({ error: 'Görüntüleme sayısı alınamadı.' });
    }
});

app.get('/api/products/', async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    try {
        const result = await sql.query(`
            SELECT *
            FROM (
                SELECT 
                    au.product_id,
                    au.product_name, 
                    au.img_url, 
                    au.lowest_price, 
                    au.average_rating,
                    ROW_NUMBER() OVER (ORDER BY au.popularity_value DESC) AS RowNum
                FROM Anasayfa_Urunler au
            ) AS RowConstrainedResult
            WHERE RowNum > ${offset} AND RowNum <= ${offset + limit}
            ORDER BY RowNum
        `);
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/api/products/:product_id/prices', async (req, res) => {
    const { product_id } = req.params;
    const productId = parseInt(product_id, 10);

    if (isNaN(productId)) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('product_id', sql.Int, productId)
            .query(`
                SELECT sp.price, s.seller_name, s.seller_rating 
                FROM Seller.seller_products sp 
                JOIN Seller.seller s ON sp.seller_id = s.seller_id 
                WHERE sp.product_id = @product_id 
                ORDER BY sp.price ASC
            `);


        if (result.recordset.length > 0) {
            res.json(result.recordset);
        } else {
            res.status(404).json({ error: 'Prices or seller ratings not found' });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

app.get('/api/products/:product_id', async (req, res) => {
    const { product_id } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('product_id', sql.Int, product_id)
            .query('SELECT * FROM Products.product WHERE product_id = @product_id');

        if (result.recordset.length > 0) {
            res.json(result.recordset);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ error: 'Failed to fetch product details' });
    }
});

app.get('/api/products/:productId/attributes', async (req, res) => {
    const { productId } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('productId', sql.Int, productId)
            .query(`
                SELECT ca.attribute_name, pav.attribute_value
                FROM Products.product p
                JOIN Category.category_attributes ca ON p.attribute_id = ca.attribute_id
                JOIN Products.product_attribute_values pav ON ca.attribute_id = pav.attribute_id
                WHERE p.product_id = @productId
            `);


        if (result.recordset.length > 0) {
            res.json(result.recordset);
        } else {
            res.status(404).json({ error: 'Attributes not found' });
        }
    } catch (error) {
        console.error('Error fetching attributes for productId:', productId, error);
        res.status(500).json({ error: 'Failed to fetch attributes' });
    }
});


app.get('/api/products/attribute/:attribute_id', async (req, res) => {
    const { orderByClause, sortOrder } = req.query;
    const { attribute_id } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('attribute_id', sql.Int, attribute_id)
            .input('orderByClause', sql.NVarChar(50), orderByClause)
            .input('sortOrder', sql.NVarChar(4), sortOrder)
            .execute('GetProductsByAttributeId');

        res.json({ products: result.recordset });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});


app.get('/api/products/category/:category_name', async (req, res) => {
    const { category_name } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('category_name', sql.VarChar, category_name)
            .execute('GetProductsByCategory'); 
        const paginatedData = result.recordset.slice(offset, offset + limit);

        res.json(paginatedData);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});


//#endregion

//#region Review

app.get('/api/get-reviews/:product_id', async (req, res) => {
    const { product_id } = req.params;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('product_id', sql.Int, product_id)
            .query(`
                SELECT r.review_id, r.review_text, r.rating, r.review_date, u.name AS user_name
                FROM [User].user_reviews r
                JOIN [User].users u ON r.user_id = u.user_id
                WHERE r.product_id = @product_id
                ORDER BY r.review_date DESC
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});



app.post('/api/post-reviews', async (req, res) => {
    const { product_id, review_text, rating, user_id } = req.body;

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('product_id', sql.Int, product_id)
            .input('user_id', sql.Int, user_id)
            .input('review_text', sql.NVarChar, review_text)
            .input('rating', sql.Int, rating)
            .query(`    
                exec AddReviewAndUpdateRating
                @user_id = @user_id,
                @product_id = @product_id,
                @review_text = @review_text,
                @rating = @rating
            `);

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Failed to add review' });
    }
});

//#endregion

//#region Admin
app.post("/api/admin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input("username", sql.NVarChar, username)
            .input("password", sql.NVarChar, password)
            .query(
                `SELECT * FROM [dbo].[admin] 
           WHERE [login] = @username AND [password] = @password`
            );

        if (result.recordset.length > 0) {
            res.status(200).json({ success: true, message: "Giriş başarılı!" });
        } else {
            res.status(401).json({ success: false, message: "Geçersiz giriş bilgileri." });
        }
    } catch (err) {
        console.error("Sunucu hatası:", err);
        res.status(500).json({ success: false, message: "Sunucu hatası!" });
    }
});

app.get("/api/admins", async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .query("SELECT admin_id, [login], [password] FROM [dbo].[admin]");

        res.json(result.recordset);
    } catch (error) {
        console.error("Adminler çekilemedi:", error);
        res.status(500).send("Adminler çekilemedi.");
    }
});

app.post("/api/admin/home", async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: "Username ve password gereklidir" });
    }

    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input("login", sql.VarChar, login)
            .input("password", sql.VarChar, password)
            .query(`
          INSERT INTO [dbo].[admin] ([login], [password])
          VALUES (@login, @password)
        `);

        res.status(201).json({ message: "Yeni admin başarıyla eklendi" });
    } catch (error) {
        console.error("Admin eklenirken hata oluştu:", error);
        res.status(500).json({ message: "Bir hata oluştu" });
    }
});

app.get('/api/logs', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT log_id,user_id, activity, log_date FROM [User].[activity_logs]
        `);
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs.' });
    }
});
//#endregion

//#region Search
app.get('/search', async (req, res) => {
    const { query, page = 1 } = req.query;

    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Arama terimi boş olamaz.' });
    }

    const limit = 50;
    const offset = (page - 1) * limit;

    try {
        const pool = await sql.connect(config);

        const countResult = await pool.request()
            .input('query', sql.NVarChar, `%${query.toLowerCase()}%`)
            .query(`
                SELECT COUNT(DISTINCT p.product_id) AS total
                FROM [db_akakce].[Products].[product] p
                LEFT JOIN [db_akakce].[Seller].[seller_products] sp ON p.product_id = sp.product_id
                WHERE LOWER(p.product_name) LIKE @query
            `);

        const totalProducts = countResult.recordset[0].total;
        const totalPages = Math.ceil(totalProducts / limit);

        const result = await pool.request()
            .input('query', sql.NVarChar, `%${query.toLowerCase()}%`)
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limit)
            .query(`
                WITH MinPrice AS (
                    SELECT 
                        sp.product_id, 
                        MIN(sp.price) AS min_price
                    FROM [db_akakce].[Seller].[seller_products] sp
                    GROUP BY sp.product_id
                )
                SELECT *
                FROM (
                    SELECT 
                        p.product_id,
                        p.product_name, 
                        p.product_description, 
                        p.img_url,
                        mp.min_price AS price,
                        ar.average_rating,  
                        ROW_NUMBER() OVER (ORDER BY p.product_name) AS RowNum
                    FROM [db_akakce].[Products].[product] p
                    LEFT JOIN MinPrice mp ON p.product_id = mp.product_id
                    LEFT JOIN [db_akakce].[Products].[product_ratings] ar ON p.product_id = ar.product_id
                    WHERE LOWER(p.product_name) LIKE @query
                ) AS RowConstrainedResult
                WHERE RowNum > @offset AND RowNum <= (@offset + @limit)
                ORDER BY RowNum
            `);

        const products = result.recordset;

        res.json({
            products,
            totalProducts,
            totalPages,
            currentPage: parseInt(page, 10),
        });
    } catch (error) {
        console.error('Veritabanı hatası:', error);
        res.status(500).json({ error: 'Veritabanı hatası' });
    }
});
//#endregion

//#region FAQ

app.get('/api/faq', async (req, res) => {
    try {
        const pool = await sql.connect(config);

        const result = await pool.request().query(`
            SELECT [faq_id], [question], [answer]
            FROM [dbo].[faq]
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Database sorgusu hatası:', err);
        res.status(500).send('Bir hata oluştu.');
    }
});

//#endregion

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));