import React, { useState, useCallback, useMemo, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';

function SearchWithDebounce({ onSearchChange, resultsCount, totalCount }) {
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const debouncedSearchTerm = useDebounce(inputValue, 500);
    
    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setInputValue(value);
        setIsTyping(true);
    }, []);

    useEffect(() => {
        if (inputValue) {
            setIsTyping(inputValue !== debouncedSearchTerm);
        }
    }, [inputValue, debouncedSearchTerm]);
    
    // Вызываем поиск после debounce
    useEffect(() => {
        onSearchChange(debouncedSearchTerm);
        if (debouncedSearchTerm === inputValue) {
            setIsTyping(false);
        }
    }, [debouncedSearchTerm, onSearchChange, inputValue]);

    // Статистика поиска
    const searchStats = useMemo(() => {
        const hasResults = resultsCount > 0;
        const allResults = resultsCount === totalCount;
        
        let message = '';
        if (!inputValue) {
            message = `Всего технологий: ${totalCount}`;
        } else if (isTyping) {
            message = 'Идет поиск...';
        } else if (!hasResults) {
            message = 'Ничего не найдено';
        } else if (allResults) {
            message = `Все ${totalCount} технологий соответствуют запросу`;
        } else {
            message = `Найдено: ${resultsCount} из ${totalCount}`;
        }
        
        return {
            message,
            hasResults,
            allResults,
            isEmpty: !hasResults && !isTyping && inputValue
        };
    }, [resultsCount, totalCount, inputValue, isTyping]);

    return (
        <div className="search-controls-container">
            <h3 className="section-title">🔍 Поиск технологий (Debounce 500ms)</h3>
            
            <div className="search-input-wrapper" style={{ position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Искать по названию, описанию или заметкам..."
                    value={inputValue}
                    onChange={handleInputChange}
                    className="search-input"
                    style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                        backgroundColor: 'var(--color-card-bg)',
                        color: 'var(--color-text)'
                    }}
                />
                
                {isTyping && (
                    <span className="typing-indicator" style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-subtext)',
                        fontSize: '12px'
                    }}>
                        Ввод...
                    </span>
                )}
            </div>
            
            <div className="search-stats" style={{ marginTop: '10px' }}>
                <p style={{ 
                    fontSize: '14px', 
                    color: searchStats.isEmpty ? 'var(--color-danger)' : 
                           searchStats.allResults ? 'var(--color-success)' : 'var(--color-subtext)',
                    fontWeight: searchStats.isEmpty ? 'bold' : 'normal'
                }}>
                    {searchStats.message}
                </p>
                
                {inputValue && !isTyping && resultsCount > 0 && (
                    <div style={{ 
                        marginTop: '5px',
                        padding: '5px',
                        backgroundColor: 'rgba(90, 125, 255, 0.05)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: 'var(--color-subtext)'
                    }}>
                        <strong>💡 Подсказка:</strong> Поиск работает с задержкой 500мс. 
                        Предыдущие запросы отменяются при новом вводе.
                    </div>
                )}
            </div>
        </div>
    );
}

export default React.memo(SearchWithDebounce);