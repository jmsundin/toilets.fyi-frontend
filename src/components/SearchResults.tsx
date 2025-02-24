import { Toilet } from '../types';

interface SearchResultsProps {
  results: Toilet[];
  onResultClick: (toilet: Toilet) => void;
}

export function SearchResults({ results, onResultClick }: SearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="search-results">
      {results.map(toilet => (
        <button
          key={toilet.id}
          className="result-item"
          onClick={() => onResultClick(toilet)}
        >
          <h3>{toilet.name}</h3>
          <p>{toilet.street}</p>
          <div className="result-amenities">
            {toilet.accessible && <span>♿ Accessible</span>}
            {toilet.unisex && <span>🚻 Gender neutral</span>}
          </div>
        </button>
      ))}
    </div>
  );
} 