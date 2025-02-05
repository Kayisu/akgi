import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Reviews.css';

const Reviews = ({ productId, isLoggedIn, userId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/get-reviews/${productId}`);
                setReviews(response.data);
                setLoading(false);
            } catch (err) {
                setError('Yorumlar alınamadı. Lütfen tekrar deneyin.');
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/post-reviews', {
                product_id: productId,
                review_text: reviewText,
                rating: parseInt(rating, 10),
                user_id: userId 
            });
            setReviewText('');
            setRating(0);
           
            const response = await axios.get(`http://localhost:5000/api/get-reviews/${productId}`);
            setReviews(response.data);
        } catch (err) {
            setError('Yorum eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    const handleRatingClick = (value) => {
        setRating(value);
    };

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="reviews">
            <h3>Yorumlar</h3>
            {isLoggedIn ? (
                <form onSubmit={handleSubmitReview} className="review-form">
                    <div>
                        <label htmlFor="reviewText">Yorumunuz:</label><br />
                        <textarea
                            id="reviewText"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            required
                        />
                    </div>
                    <div className="rating-buttons">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                type="button"
                                key={value}
                                className={`rating-button ${rating === value ? 'selected' : ''}`}
                                data-rating={value}
                                onClick={() => handleRatingClick(value)}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                    <button type="submit">Yorumu Gönder</button>
                </form>
            ) : (
                <p>Yorum eklemek için lütfen giriş yapın.</p>
            )}

            {reviews.length === 0 ? (
                <p>Henüz yorum yok.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.review_id} className="review">
                        <p><strong>{review.user_name}</strong></p>
                        <p>{review.review_text}</p>
                        <p className="review-rating">Puan: {review.rating}</p>
                        <p className="review-date">Tarih: {new Date(review.review_date).toLocaleDateString()}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default Reviews;