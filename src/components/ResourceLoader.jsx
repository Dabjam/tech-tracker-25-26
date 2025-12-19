import React, { useState, useCallback } from 'react';
import useTechResourcesApi from '../hooks/useTechResourcesApi';

function ResourceLoader({ techName, onResourceSelect, existingResources = [] }) {
    const [showResources, setShowResources] = useState(false);
    const { resources, loading, error, fetchResources, resetResources } = useTechResourcesApi();
    
    const handleLoadResources = useCallback(async () => {
        if (!techName) return alert('Введите название!');
        setShowResources(true);
        await fetchResources(techName);
    }, [techName, fetchResources]);

    return (
        <div className="resource-loader-container">
            <button type="button" onClick={handleLoadResources} className="btn btn-info">
                🔍 Найти ресурсы для {techName || '...'}
            </button>
        </div>
    );
}

export default ResourceLoader;