import React from 'react';
import { Toilet } from '../types';
import './SearchResults.css';

// Add this interface for Nominatim results
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface SearchResultsProps {
  results: Toilet[];
  addressResults?: NominatimResult[];
  onResultClick: (toilet: Toilet) => void;
  onAddressClick?: (address: NominatimResult) => void;
  isSearchingAddress?: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  addressResults = [], 
  onResultClick,
  onAddressClick,
  isSearchingAddress = false
}) => {
  if (results.length === 0 && addressResults.length === 0) {
    return null;
  }

  return (
    <div className="search-results">
      {results.length > 0 && (
        <>
          <div className="results-section-header">Toilets</div>
          <ul>
            {results.map((toilet) => (
              <li key={toilet.id} onClick={() => onResultClick(toilet)}>
                <div className="result-name">{toilet.name}</div>
                <div className="result-address">{toilet.street}, {toilet.city}</div>
                <div className="result-tags">
                  {toilet.accessible && <span className="tag accessible">Accessible</span>}
                  {toilet.unisex && <span className="tag unisex">Gender Neutral</span>}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {addressResults.length > 0 && onAddressClick && (
        <>
          <div className="results-section-header">Addresses</div>
          <ul>
            {addressResults.map((address) => (
              <li key={address.place_id} onClick={() => onAddressClick(address)}>
                <div className="result-address">{address.display_name}</div>
              </li>
            ))}
          </ul>
        </>
      )}

      {isSearchingAddress && (
        <div className="searching-indicator">Searching addresses...</div>
      )}
    </div>
  );
}; 