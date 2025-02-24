import { FiX } from 'react-icons/fi';
import './FilterModal.css';

interface FilterModalProps {
  onClose: () => void;
  filters: {
    accessible: boolean;
    unisex: boolean;
  };
  onFilterChange: (filters: { accessible: boolean; unisex: boolean }) => void;
}

export function FilterModal({ onClose, filters, onFilterChange }: FilterModalProps) {
  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal">
        <div className="filter-modal-header">
          <h2>Filters</h2>
          <button onClick={onClose} className="close-button" aria-label="Close">
            <FiX size={24} />
          </button>
        </div>

        <div className="filter-modal-content">
          <div className="filter-option">
            <label className="filter-label">
              <input
                type="checkbox"
                checked={filters.accessible}
                onChange={(e) => onFilterChange({ ...filters, accessible: e.target.checked })}
              />
              <span>♿ Wheelchair accessible</span>
            </label>
          </div>

          <div className="filter-option">
            <label className="filter-label">
              <input
                type="checkbox"
                checked={filters.unisex}
                onChange={(e) => onFilterChange({ ...filters, unisex: e.target.checked })}
              />
              <span>🚻 Gender neutral</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 