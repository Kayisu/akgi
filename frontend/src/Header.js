import React, { useState } from 'react';
import './styles/Header.css';
import { useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn, setIsLoggedIn, setSearchResults, searchResults }) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [query, setQuery] = useState('');

    const handleLogout = async () => {
        const user = JSON.parse(sessionStorage.getItem('user'));

        if (!user || !user.user_id) {
            console.error('Kullanıcı bilgileri bulunamadı ya da eksik. Lütfen tekrar giriş yapın.');
            alert('Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user.user_id }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Logout başarılı:', data.message);
                sessionStorage.removeItem('user'); 
                setIsLoggedIn(false); 
                navigate('/'); 
            } else {
                console.error('Logout sırasında hata oluştu:', data.error);
            }
        } catch (err) {
            console.error('Logout işlemi sırasında hata oluştu:', err);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/search?query=${query}`);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="header-container">
            <header className="header">
                <button className="header-back-button" onClick={handleBack}>
                    &#11164;
                </button>
                <div className="logo" onClick={() => navigate('/')}>
                    <span className="logo-text">ak akçe</span>
                    <span className="logo-subtext">kara gün içindir</span>
                </div>
                <input
                    type="text"
                    placeholder="Ürün ara..."
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
                {isLoggedIn ? (
                    <div className="account-menu">
                        <button
                            className="account-button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            Hesabım
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <button onClick={() => navigate('/account')}>Hesap Sayfası</button>
                                <button onClick={() => navigate('/favorites')}>Favoriler</button>
                                <button onClick={handleLogout}>Çıkış Yap</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')}>Giriş Yap</button>
                )}
            </header>
        </div>
    );
};

export default Header;