import React from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome({ setUserRole }) {
    const navigate = useNavigate();

    const selectRole = (role) => {
        setUserRole(role);
        navigate('/technologies');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#f8fafc' }}>
            <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
                <h1 style={{ fontSize: 'clamp(24px, 5vw, 40px)', marginBottom: '10px' }}>Добро пожаловать</h1>
                <p style={{ color: '#64748b', marginBottom: '40px' }}>Выберите режим работы с приложением</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                    <div onClick={() => selectRole('user')} style={roleCardStyle}>
                        <div style={{ fontSize: '40px' }}>👨‍💻</div>
                        <h3>Пользователь</h3>
                        <p>Просмотр технологий, заметок и отслеживание прогресса.</p>
                    </div>

                    <div onClick={() => selectRole('admin')} style={{ ...roleCardStyle, borderColor: '#2563eb' }}>
                        <div style={{ fontSize: '40px' }}>🛠️</div>
                        <h3>Администратор</h3>
                        <p>Полное управление базой, импорт и массовые действия.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const roleCardStyle = {
    flex: '1 1 280px',
    maxWidth: '350px',
    padding: '30px',
    background: 'white',
    borderRadius: '24px',
    border: '2px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
};

export default Welcome;