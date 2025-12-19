import React from 'react';
import { NavLink } from 'react-router-dom';

function Header({ progressPercentage }) {
    return (
        <header className="app-header">
            <div className="header-top">
                <h1>Технологический трекер: Практика 23-24</h1>
            </div>
            
            {/* Панель навигации */}
            <nav className="main-nav">
                <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
                    Главная
                </NavLink>
                <NavLink to="/statistics" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
                    Статистика
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
                    Настройки
                </NavLink>
            </nav>

            {/* Прогресс-бар */}
            <div className="progress-bar-container">
                <div 
                    className="progress-bar" 
                    style={{ width: `${progressPercentage}%` }}
                >
                    {progressPercentage.toFixed(0)}%
                </div> 
            </div>
        </header>
    );
}

export default Header;