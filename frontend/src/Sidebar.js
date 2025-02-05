import React, { useEffect } from 'react';
import './styles/Sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from './SidebarContext';

const Sidebar = ({ content, backButtonPath }) => {
    const { isMenuOpen, toggleMenu } = useSidebar();
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        if (backButtonPath) {
            navigate(backButtonPath);
        } else {
            navigate('/');
        }
    };

    useEffect(() => {
      
        toggleMenu(false);
    }, [location.pathname, toggleMenu]);

    return (
        <>
            <div className="hamburger-icon" onClick={toggleMenu}>
                ☰
            </div>
            <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
                <div className="back-button" onClick={handleBack}>⮜ geri dön</div>
                {content}
            </div>
        </>
    );
};

export default Sidebar;