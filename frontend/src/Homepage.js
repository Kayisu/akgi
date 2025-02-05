import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/ProductCard.css';

const Homepage = ({ categories, isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const defaultImageUrl = '/default.png'; 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products', {
                    params: { page }
                });
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Ürünler alınamadı:', error);
                setError('Ürünler alınamadı. Lütfen daha sonra tekrar deneyin.');
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page]);

    const handleCategoryClick = (category) => {
        navigate(`category/${category}`);
    };

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    const sidebarContent = (
        <>
            <h3>Kategoriler</h3>
            <ul>
                {categories.map((category, index) => (
                    <li
                        key={index}
                        onClick={() => handleCategoryClick(category)}
                        style={{ cursor: 'pointer' }}
                    >
                        {category}
                    </li>
                ))}
            </ul>
        </>
    );

    return (
        <Layout
            sidebarContent={sidebarContent}
            isBackButtonVisible={false}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
        >
            <div className="page">
                <h1>Popüler Ürünler</h1>

                {loading && <p>Yükleniyor...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="product-list">
                    {products.map((product) => (
                        <div
                            className="product-card"
                            key={product.product_id}
                            onClick={() => handleProductClick(product.product_id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={product.img_url || defaultImageUrl}
                                alt={product.product_name}
                                onError={(e) => e.target.src = defaultImageUrl} // Resim yüklenemezse varsayılan resmi göster
                                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                            />
                            <h2>{product.product_name}</h2>
                            <p>Fiyat: {product.lowest_price} TL</p>
                            <p>Ortalama Puan: {product.average_rating || 'Henüz değerlendirme yok'}</p>
                        </div>
                    ))}
                </div>
                <div className="pagination">
                    <button className='button' onClick={() => setPage(page - 1)} disabled={page === 1}>Önceki</button>
                    <span>Sayfa {page}</span>
                    <button className='button' onClick={() => setPage(page + 1)} disabled={products.length < 50}>Sonraki</button>
                </div>
            </div>
        </Layout>
    );
};

export default Homepage;
