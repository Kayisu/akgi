import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const AccountPage = ({ isLoggedIn, setIsLoggedIn }) => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem('user'));
        if (userInfo && userInfo.email) {
            setCurrentEmail(userInfo.email);
        }
    }, []);

    const handlePasswordUpdate = async () => {
        try {
            const response = await fetch('http://localhost:5000/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: currentEmail,
                    newPassword: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Şifre başarıyla güncellendi!');
                setPassword('');
            } else {
                alert(`Hata: ${data.message}`);
            }
        } catch (error) {
            console.error('Şifre güncellenirken bir hata oluştu:', error);
            alert('Şifre güncellenirken bir hata oluştu.');
        }
    };

    const handleEmailUpdate = async () => {
        try {
            const response = await fetch('http://localhost:5000/update-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    oldEmail: currentEmail,
                    newEmail: newEmail,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Email başarıyla güncellendi!');
                setCurrentEmail(newEmail);

                const updatedUser = { ...JSON.parse(sessionStorage.getItem('user')), email: newEmail };
                sessionStorage.setItem('user', JSON.stringify(updatedUser));

                setNewEmail('');
            } else {
                alert(`Hata: ${data.message}`);
            }
        } catch (error) {
            console.error('Email güncellenirken bir hata oluştu:', error);
            alert('Email güncellenirken bir hata oluştu.');
        }
    };

    const handleAccountDelete = async () => {
        const confirmDelete = window.confirm(
            'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!'
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/delete-account', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: currentEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Hesabınız başarıyla silindi.');
                sessionStorage.removeItem('user');
                setIsLoggedIn(false);
                navigate('/');
            } else {
                alert(`Hata: ${data.message}`);
            }
        } catch (error) {
            console.error('Hesap silinirken bir hata oluştu:', error);
            alert('Hesap silinirken bir hata oluştu.');
        }
    };

    const handleBack = () => {
        navigate(-1); 
    };

    return (
        <Layout>
            <div style={styles.container}>
                <h1>Hoş geldiniz {currentEmail}</h1>

           
                <div style={styles.section}>
                    <h3>Şifreyi Güncelle</h3>
                    <div style={styles.inputContainer}>
                        <input
                            type="password"
                            placeholder="Yeni Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                        <button onClick={handlePasswordUpdate} style={styles.button}>
                            Güncelle
                        </button>
                    </div>
                </div>

            
                <div style={styles.section}>
                    <h3>E-Postayı Güncelle</h3>
                    <div style={styles.inputContainer}>
                        <input
                            type="email"
                            placeholder="Yeni E-Posta"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            style={styles.input}
                        />
                        <button onClick={handleEmailUpdate} style={styles.button}>
                            Güncelle
                        </button>
                    </div>
                </div>

             
                <button onClick={handleAccountDelete} style={styles.deleteButton}>
                    Hesabı Sil
                </button>
            </div>
        </Layout>
    );
};

const styles = {
    container: {
        textAlign: 'center',
        padding: '20px',
        minHeight: 'calc(100vh - 60px)', 
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        padding: '5px 10px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    section: {
        margin: '20px 0',
        textAlign: 'center',
    },
    inputContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        padding: '10px',
        width: '300px',
        marginRight: '10px',
    },
    button: {
        padding: '5px 15px',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '15px 30px',
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        marginTop: '30px',
    },
};

export default AccountPage;
