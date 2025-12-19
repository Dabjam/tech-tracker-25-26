import { useState, useEffect } from 'react';

const useTechnologiesApi = () => {
    const [technologies, setTechnologies] = useState(() => {
        const saved = localStorage.getItem('technologies');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('technologies', JSON.stringify(technologies));
    }, [technologies]);

    const addTechnology = (tech) => {
        const newTech = {
            ...tech,
            id: Date.now().toString(),
            status: tech.status || 'not-started',
            notes: tech.notes || ''
        };
        setTechnologies(prev => [...prev, newTech]);
    };

    const deleteTechnology = (id) => {
        setTechnologies(prev => prev.filter(t => t.id !== id));
    };

    const deleteAllTechnologies = () => {
        setTechnologies([]);
        localStorage.removeItem('technologies');
    };

    const updateAllStatuses = (newStatus) => {
        setTechnologies(prev => prev.map(t => ({ ...t, status: newStatus })));
    };

    const batchAddTechnologies = (newData) => {
        const processed = newData.map(t => ({
            ...t,
            id: t.id || Math.random().toString(36).substr(2, 9),
            status: t.status || 'not-started'
        }));
        setTechnologies(prev => [...prev, ...processed]);
    };

    const exportTechnologiesAsJson = () => {
        const dataStr = JSON.stringify(technologies, null, 2);
        const link = document.createElement('a');
        link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        link.download = 'tech_backup.json';
        link.click();
    };

    return {
        technologies,
        setTechnologies,
        addTechnology,
        deleteTechnology,
        deleteAllTechnologies,
        batchAddTechnologies,
        updateAllStatuses,
        exportTechnologiesAsJson
    };
};

export default useTechnologiesApi;