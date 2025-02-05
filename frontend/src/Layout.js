import React from 'react';
import Sidebar from './Sidebar';
import './styles/Layout.css';

const Layout = ({ children, sidebarContent }) => {
    return (
        <div className="layout">
            {sidebarContent && <Sidebar content={sidebarContent} />}
            <div className="page-content">{children}</div>
        </div>
    );
};

export default Layout;