import React, { useState, useRef } from 'react';

function RoadmapImporter({ batchAddTechnologies }) {
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');

    const handleExampleImport = async () => {
        if (!batchAddTechnologies) return; 
        
        try {
            setImporting(true);
            const roadmapData = [
                { 
                    title: 'GraphQL', 
                    description: 'Язык запросов для API', 
                    category: 'Backend', 
                    difficulty: 'intermediate',
                    status: 'not-started',
                    notes: 'Изучить основы GraphQL, схемы, запросы и мутации'
                },
                { 
                    title: 'Docker', 
                    description: 'Платформа для контейнеризации', 
                    category: 'DevOps', 
                    difficulty: 'intermediate',
                    status: 'in-progress',
                    notes: 'Освоить Dockerfile, Docker Compose, управление контейнерами',
                    resources: ['https://docs.docker.com']
                }
            ];

            await new Promise(resolve => setTimeout(resolve, 800));
            batchAddTechnologies(roadmapData);
        } catch (err) {
            console.error("Ошибка при импорте:", err);
        } finally {
            setImporting(false);
        }
    };

    const handleFileImport = (e) => {
        const file = e.target.files[0];
        if (!file || !batchAddTechnologies) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                const arrayData = Array.isArray(data) ? data : [data];
                batchAddTechnologies(arrayData);
            } catch (err) {
                console.error("Ошибка JSON:", err);
                alert("Ошибка в формате файла");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="roadmap-importer" style={{ 
            padding: '25px', 
            backgroundColor: 'var(--color-card-bg)', 
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-light)',
            marginTop: '20px'
        }}>
            <h3 style={{ fontSize: '18px', marginBottom: '25px', textAlign: 'center' }}>🗺️ Импорт дорожных карт</h3>
            
            <div className="import-actions" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '15px' 
            }}>
                
                <button 
                    onClick={handleExampleImport} 
                    className="btn btn-primary" 
                    disabled={importing}
                    style={{ 
                        width: '100%', 
                        padding: '15px', 
                        fontSize: '15px',
                        fontWeight: 'bold',
                        borderRadius: '8px'
                    }}
                >
                    {importing ? '⏳ Загрузка...' : '⚡ Добавить готовые примеры'}
                </button>
                
                <div style={{ position: 'relative', width: '100%' }}>
                    {fileName && (
                        <div style={{
                            textAlign: 'center',
                            fontSize: '12px',
                            color: 'var(--color-success)',
                            fontWeight: 'bold',
                            marginBottom: '5px'
                        }}>
                            ✅ Выбран: {fileName}
                        </div>
                    )}
                    
                    <button 
                        onClick={() => fileInputRef.current.click()} 
                        className="btn"
                        style={{ 
                            width: '100%', 
                            padding: '15px', 
                            fontSize: '15px',
                            fontWeight: 'bold',
                            backgroundColor: '#4a5568', 
                            color: '#ffffff',           
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        📂 Загрузить свой JSON-файл
                    </button>
                    
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileImport}
                        accept=".json"
                        style={{ display: 'none' }}
                    />
                </div>
            </div>
            
            <div style={{ 
                marginTop: '20px', 
                padding: '10px', 
                backgroundColor: 'rgba(0, 0, 0, 0.03)', 
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--color-subtext)',
                textAlign: 'center'
            }}>
                Импортированные данные сохраняются локально.
            </div>
        </div>
    );
}

export default RoadmapImporter;