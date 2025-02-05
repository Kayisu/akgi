import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import './styles/FavoritePage.css';

const FavoritesPage = ({ userId, categories }) => {
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();
    const defaultImageUrl = '/default.png'; 

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!userId) {
                console.error('User ID is not provided.');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/favorites/${userId}`);
                const data = await response.json();

                if (Array.isArray(data)) {
                    setFavorites(data);
                } else {
                    console.error('API yanıtı beklenen formatta değil:', data);
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        fetchFavorites();
    }, [userId]);

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    return (
        <Layout>
            <div className="favorites-page">
                <h1>Favori Ürünler</h1>
                <div className="favorites-list">
                    {favorites.map((favorite) => (
                        <div
                            className="favorites-card"
                            key={favorite.product_id}
                            onClick={() => handleProductClick(favorite.product_id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={favorite.img_url || defaultImageUrl}
                                alt={favorite.product_name}
                                onError={(e) => e.target.src = defaultImageUrl} 
                            />
                            <div>
                                <h2>{favorite.product_name}</h2>
                                <p>Fiyat: {favorite.lowest_price} TL</p>
                                <p>Ortalama Puan: {favorite.average_rating || 'Henüz değerlendirme yok'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default FavoritesPage;