import { FiNavigation, FiX, FiMapPin } from 'react-icons/fi';
import './LocationModal.css';
import { Toilet } from '../types.ts';

interface LocationModalProps {
  toilet: Toilet;
  onClose: () => void;
}

export function LocationModal({ toilet, onClose }: LocationModalProps) {
  return (
    <div className="modal-overlay">
      <div className="location-modal">
        <div className="modal-header">
          <h2>{toilet.name}</h2>
          <button onClick={onClose} className="close-button" aria-label="Close">
            <FiX size={24} />
          </button>
        </div>

        <div className="modal-content">
          <h3>Home</h3>
          
          <div className="action-buttons">
            <button className="action-button">
              <FiNavigation size={24} />
              <span>Directions</span>
            </button>
          </div>

          <div className="location-details">
            <div className="address">
              <div className="address-row">
                <FiMapPin size={20} color='#0b57d0'/>
                <div className="address-text">
                  <span>{toilet.street}</span>
                  <span>{toilet.city}, {toilet.state}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="amenities">
            {toilet.accessible && (
              <div className="amenity">
                <span>♿ Wheelchair accessible</span>
              </div>
            )}
            {toilet.unisex && (
              <div className="amenity">
                <span>🚻 Gender neutral</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 