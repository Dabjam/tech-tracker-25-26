import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
    const location = useLocation();

    const [userRole, setUserRole] = useState(() => {
        return localStorage.getItem('userRole') || 'user';
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const role = localStorage.getItem('userRole') || 'user';
            setUserRole(role);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        const role = localStorage.getItem('userRole') || 'user';
        if (role !== userRole) {
            setUserRole(role);
        }
    });

    const getLinkClass = (path) => 
        `nav-link ${location.pathname === path ? 'active-link' : ''}`;

    return (
        <nav className="main-nav">
            <Link to="/" className={getLinkClass('/')}>
                Главная
            </Link>
            <Link to="/technologies" className={getLinkClass('/technologies')}>
                Все технологии
            </Link>
            <Link to="/add" className={getLinkClass('/add')}>
                Добавить технологию
            </Link>
            <Link to="/stats" className={getLinkClass('/stats')}>
                📊 Статистика
            </Link>
            <Link to="/settings" className={getLinkClass('/settings')}>
                ⚙️ Настройки
            </Link>
            
            {userRole === 'admin' && (
                <Link to="/admin" className={getLinkClass('/admin')}>
                    🔒 Админ-панель
                </Link>
            )}
        </nav>
    );
}

export default Navigation;