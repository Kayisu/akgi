import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [faqs, setFaqs] = useState([]); 

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/faq');
                const data = await response.json();
                setFaqs(data); 
            } catch (error) {
                console.error('FAQ verisi alınırken hata oluştu:', error);
            }
        };

        fetchFaqs();
    }, []); 

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Sık Sorulan Sorular</h1>
            {faqs.map((faq) => (
                <div key={faq.faq_id} style={{ marginBottom: '20px' }}>
                    <strong>{faq.question}</strong>
                    <p>{faq.answer}</p>
                </div>
            ))}
        </div>
    );
};

export default FAQ;
