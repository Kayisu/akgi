import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Products.css';
import Reviews from './Reviews';

const ProductPage = ({ isLoggedIn, setIsLoggedIn, userId }) => {
    const { productId } = useParams(); 
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);  
    const [sellerInfo, setSellerInfo] = useState([]);  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [viewCount, setViewCount] = useState(0);
    const [attributes, setAttributes] = useState([]);
    const defaultImageUrl = '/default.png'; // Default image URL

    // Fetch product details
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
                console.log('API Response:', response.data); // Log 

                if (response.data && response.data.length > 0) {
                    const productData = response.data[0];  
                    setProduct(productData);
                    console.log('Product Data:', productData); // Log 
                } else {
                    setError("Ürün bilgileri bulunamadı.");
                    console.error("Ürün bilgileri bulunamadı.");
                }
                setLoading(false);
            } catch (err) {
                setError('Ürün bilgisi alınamadı. Lütfen tekrar deneyin.');
                setLoading(false);
                console.error('Error fetching product details:', err);
            }
        };

        fetchProductDetails();
    }, [productId, isLoggedIn]);  

    // Fiyatlar ve satıcı ratingleri
    useEffect(() => {
        const fetchSellerInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${productId}/prices`);
                console.log('API Response:', response.data); // Log 

                if (response.data) {
                    setSellerInfo(response.data);
                    console.log('Seller Info:', response.data); //Log
                } else {
                    setError("Fiyatlar veya satıcı ratingleri bulunamadı.");
                    console.error("Fiyatlar veya satıcı ratingleri bulunamadı.");
                }
                setLoading(false);
            } catch (err) {
                setError('Fiyatlar veya satıcı ratingleri alınamadı. Lütfen tekrar deneyin.');
                setLoading(false);
                console.error('Error fetching seller info:', err);
            }
        };

        fetchSellerInfo();
    }, [productId, isLoggedIn]);  

    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${productId}/attributes`);
                console.log('Attributes API Response:', response.data); // Log the response
    
                if (response.data) {
                    setAttributes(response.data);
                } else {
                    setError("Attribute değerleri bulunamadı.");
                    console.error("Attribute değerleri bulunamadı.");
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching attributes:', error);
                setError('Attribute değerleri alınamadı. Lütfen tekrar deneyin.');
                setLoading(false);
            }
        };
    
        fetchAttributes();
    }, [productId]);

    // Favori durumu
    useEffect(() => { 
        const checkFavoriteStatus = async () => {
            if (!userId) return; // Kullanıcı ID'si yoksa favori durumu kontrol edilmez

            try {
                const response = await fetch(`http://localhost:5000/api/favorites/${userId}`);
                const favorites = await response.json();
                setIsFavorite(favorites.some((fav) => fav.product_id === product?.product_id));
            } catch (error) {
                console.error('Favori durumu kontrol edilemedi:', error);
            }
        };
    
        checkFavoriteStatus();
    }, [userId, product?.product_id]);

    // Handle product view
    useEffect(() => {
        if (product?.product_id) {
            handleViewProduct(product.product_id);
        }
    }, [product?.product_id]);

    const handleViewProduct = async (productId) => {
        try {
            if (isLoggedIn) {
                const response = await fetch('http://localhost:5000/api/view-product', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product_id: productId, user_id: userId })
                });
                if (!response.ok) {
                    console.error('Ürün görüntüleme kaydı başarısız.', await response.text());
                    return;
                }
            }

            // Görüntülenme sayısını almak için
            const visitsResponse = await fetch(`http://localhost:5000/api/view-count/${productId}`);
            if (visitsResponse.ok) {
                const { visit_count } = await visitsResponse.json();
                setViewCount(visit_count || 0);
            }
        } catch (error) {
            console.error('Ürün görüntüleme isteği atılamadı:', error);
        }
    };

    const handleFavoriteClick = async () => {
        if (!isLoggedIn) {
            alert('Lütfen favorilere eklemek için giriş yapın.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/toggle-favorite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, product_id: product.product_id }),
            });

            if (response.ok) {
                setIsFavorite((prev) => !prev);
                alert(isFavorite ? 'Favorilerden çıkarıldı.' : 'Favorilere eklendi.');
            } else {
                const error = await response.json();
                alert(`Hata: ${error.message}`);
            }
        } catch (error) {
            console.error('Favori durumu değiştirilemedi:', error);
            alert('Favori durumu değiştirilemedi.');
        }
    };

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="product-page">
            {product ? (
                <div className="product-container">
                    <img
                        src={product.img_url || defaultImageUrl}
                        alt={product.product_name}
                        onError={(e) => e.target.src = defaultImageUrl} 
                        className="product-image"
                    />
                    <div className="product-details">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <h2 style={{ marginRight: '8px' }}>{product.product_name}</h2>
                            <button
                                className={`favorite-button ${isFavorite ? 'red' : ''}`}
                                onClick={handleFavoriteClick}
                                aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                            >
                                {isFavorite ? '❤' : '🤍'}
                            </button>
                        </div>
                        <p><strong>Görüntülenme:</strong> {viewCount}</p>
                        <p><strong>Açıklama:</strong> {product.product_description || 'Açıklama bulunamadı.'}</p>
                        <div className="seller-info">
                            {sellerInfo.map((seller, index) => (
                                <div key={index} className="seller-info-item">
                                    <p><strong>Satıcı:</strong> {seller.seller_name || 'Satıcı bilgisi yok'}</p>
                                    <p><strong>Fiyat:</strong> {seller.price} TL</p>
                                    <p><strong>Satıcı Puanı:</strong> {seller.seller_rating || 'Henüz değerlendirme yok'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Ürün bilgileri bulunamadı.</p>
            )}
            <div className="attributes">
                <h3>Ürün Özellikleri</h3>
                {attributes.map((attribute, index) => (
                    <div key={index} className="attribute-item">
                        <p><strong>Özellik {index + 1}:</strong> {attribute.attribute_value}</p>
                    </div>
                ))}
            </div>

            <Reviews productId={productId} isLoggedIn={isLoggedIn} userId={userId} />
        </div>
    );
};

export default ProductPage;