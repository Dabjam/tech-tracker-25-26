import React from 'react';

function SearchInput({ searchQuery, onSearchChange, resultCount }) {
    return (
        <div className="search-input-container">
            <h2 className="section-title">Поиск технологий</h2>
            <input
                type="text"
                placeholder="Найти по названию или описанию..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
            />
            <p className="search-results-count">Найдено результатов: {resultCount}</p>
        </div>
    );
}

export default React.memo(SearchInput);