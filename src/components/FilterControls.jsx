const FILTERS = [
    { label: 'Все', value: 'all' },
    { label: 'Не начато', value: 'not-started' },
    { label: 'В процессе', value: 'in-progress' },
    { label: 'Выполнено', value: 'completed' },
];

function FilterControls({ activeFilter, onFilterChange }) {
    return (
        <div className="filter-controls-container">
            <h2 className="section-title">Фильтр по статусу</h2>
            <div className="filter-buttons-group">
                {FILTERS.map(filter => (
                    <button
                        key={filter.value}
                        onClick={() => onFilterChange(filter.value)}
                        className={`btn filter-btn ${activeFilter === filter.value ? 'btn-active' : ''}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default FilterControls;