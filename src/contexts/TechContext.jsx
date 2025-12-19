import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TechContext = createContext();

export const TechProvider = ({ children }) => {
    const LOCAL_STORAGE_KEY = 'techTrackerData';
    
    // Инициализируем state с localStorage сразу
    const [technologies, setTechnologies] = useState(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    // Сохранение при каждом изменении
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(technologies));
    }, [technologies]);

    const deleteTechnology = useCallback((id) => {
        setTechnologies(prev => prev.filter(tech => tech.id !== id));
    }, []);

    const addTechnology = useCallback((tech) => {
        setTechnologies(prev => [...prev, { ...tech, id: Date.now() }]);
    }, []);

    const updateTechnology = useCallback((id, updates) => {
        setTechnologies(prev => 
            prev.map(tech => tech.id === id ? { ...tech, ...updates } : tech)
        );
    }, []);

    const updateMultipleTechnologies = useCallback((ids, updates) => {
        setTechnologies(prev =>
            prev.map(tech => ids.includes(tech.id) ? { ...tech, ...updates } : tech)
        );
    }, []);

    const importTechnologies = useCallback((newTechs, mergeMode = false) => {
        if (mergeMode) {
            setTechnologies(prev => [...prev, ...newTechs]);
        } else {
            setTechnologies(newTechs);
        }
    }, []);

    const addDemoTechnologies = useCallback(() => {
        const demoTechs = [
            { id: Date.now(), name: 'React', description: 'JavaScript библиотека для UI', status: 'in-progress', category: 'Frontend' },
            { id: Date.now() + 1, name: 'Node.js', description: 'JavaScript runtime для backend', status: 'completed', category: 'Backend' },
            { id: Date.now() + 2, name: 'MongoDB', description: 'NoSQL база данных', status: 'not-started', category: 'Database' },
            { id: Date.now() + 3, name: 'Docker', description: 'Контейнеризация приложений', status: 'in-progress', category: 'DevOps' },
            { id: Date.now() + 4, name: 'GraphQL', description: 'Query язык для API', status: 'completed', category: 'Backend' },
        ];
        setTechnologies(prev => [...prev, ...demoTechs]);
    }, []);

    return (
        <TechContext.Provider value={{
            technologies,
            deleteTechnology,
            addTechnology,
            updateTechnology,
            updateMultipleTechnologies,
            importTechnologies,
            addDemoTechnologies,
        }}>
            {children}
        </TechContext.Provider>
    );
};

export const useTech = () => useContext(TechContext);