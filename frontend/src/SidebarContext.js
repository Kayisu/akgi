import React, { createContext, useState, useContext } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [sidebarContent, setSidebarContent] = useState(null);

    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    return (
        <SidebarContext.Provider value={{ isMenuOpen, toggleMenu, sidebarContent, setSidebarContent }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => useContext(SidebarContext);