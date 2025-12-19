import React from 'react';

function QuickActions({ technologies, updateAllStatuses, exportTechnologiesAsJson }) {
    const handleMarkAllDone = () => {
        if (window.confirm('Отметить всё как изученное?')) {
            updateAllStatuses('completed');
        }
    };

    const handleResetAll = () => {
        if (window.confirm('Сбросить все статусы?')) {
            updateAllStatuses('not-started');
        }
    };

    return (
        <div className="quick-actions" style={{ 
            padding: '20px', 
            background: 'var(--color-card-bg)', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)',
            color: 'var(--color-text)'        
        }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>⚡ Быстрые действия</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={handleMarkAllDone} className="btn" style={{ padding: '10px', borderRadius: '8px', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#48bb78' }}>
                    ✅ Выполнить всё
                </button>

                <button onClick={handleResetAll} className="btn" style={{ padding: '10px', borderRadius: '8px', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#ed8936' }}>
                    🔄 Сбросить статусы
                </button>

                <button onClick={exportTechnologiesAsJson} className="btn" style={{ padding: '10px', borderRadius: '8px', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#4a5568' }}>
                    📤 Экспорт JSON
                </button>
            </div>
            
            <p style={{ fontSize: '12px', textAlign: 'center', marginTop: '10px', color: 'var(--color-subtext)' }}>
                Всего: {technologies?.length || 0}
            </p>
        </div>
    );
}

export default QuickActions;