import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function TechnologyDetail() {
    const { techId } = useParams();
    const navigate = useNavigate();
    const { technologies, setTechnologies } = useTechnologiesApi();
    
    const [isEditing, setIsEditing] = useState(false);
    const tech = technologies.find(t => t.id.toString() === techId?.toString());
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        if (tech) setEditData({ ...tech });
    }, [tech]);

    if (!tech || !editData) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--color-text)' }}>
                <h2>⚠️ Технология не найдена</h2>
                <Link to="/technologies" className="btn btn-primary">Вернуться к списку</Link>
            </div>
        );
    }

    const handleSave = () => {
        const updatedList = technologies.map(t => t.id === tech.id ? editData : t);
        setTechnologies(updatedList);
        setIsEditing(false);
    };

    // Динамические стили, учитывающие тему
    const containerStyle = {
        maxWidth: '800px',
        margin: '20px auto',
        padding: '30px',
        background: 'var(--color-card-bg)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        color: 'var(--color-text)',
        boxShadow: 'var(--shadow-light)'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontSize: '16px',
        boxSizing: 'border-box',
        outline: 'none',
        marginBottom: '15px'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: '700',
        color: 'var(--color-subtext)',
        marginBottom: '5px',
        textTransform: 'uppercase'
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={containerStyle}>
                <div style={{ marginBottom: '20px' }}>
                    <Link to="/technologies" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>← Назад к списку</Link>
                </div>

                {!isEditing ? (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h1 style={{ margin: 0 }}>{tech.title}</h1>
                                <p style={{ color: 'var(--color-subtext)', fontSize: '18px' }}>{tech.category}</p>
                            </div>
                            <button onClick={() => setIsEditing(true)} className="btn btn-primary">✏️ Редактировать</button>
                        </div>
                        
                        <div style={{ marginTop: '30px' }}>
                            <h4 style={labelStyle}>Статус</h4>
                            <p style={{ fontSize: '18px' }}>{formatStatus(tech.status)}</p>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <h4 style={labelStyle}>Описание</h4>
                            <p style={{ lineHeight: '1.6' }}>{tech.description || 'Описание отсутствует'}</p>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <h4 style={labelStyle}>Заметки</h4>
                            <div style={{ 
                                padding: '15px', 
                                background: 'var(--color-bg)', 
                                borderRadius: '10px', 
                                border: '1px solid var(--border-color)',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {tech.notes || 'Здесь пока пусто...'}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2>Редактирование</h2>
                        
                        <label style={labelStyle}>Название</label>
                        <input 
                            style={inputStyle} 
                            value={editData.title} 
                            onChange={e => setEditData({...editData, title: e.target.value})} 
                        />

                        <label style={labelStyle}>Категория</label>
                        <input 
                            style={inputStyle} 
                            value={editData.category} 
                            onChange={e => setEditData({...editData, category: e.target.value})} 
                        />

                        <label style={labelStyle}>Статус</label>
                        <select 
                            style={inputStyle} 
                            value={editData.status} 
                            onChange={e => setEditData({...editData, status: e.target.value})}
                        >
                            <option value="not-started">🔴 Не начато</option>
                            <option value="in-progress">🟡 В процессе</option>
                            <option value="completed">🟢 Изучено</option>
                        </select>

                        <label style={labelStyle}>Заметки</label>
                        <textarea 
                            style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }} 
                            value={editData.notes} 
                            onChange={e => setEditData({...editData, notes: e.target.value})} 
                        />

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1 }}>💾 Сохранить</button>
                            <button onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ flex: 1 }}>Отмена</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const formatStatus = (s) => {
    if (s === 'completed') return '🟢 Изучено';
    if (s === 'in-progress') return '🟡 В процессе';
    return '🔴 Не начато';
};

export default TechnologyDetail;