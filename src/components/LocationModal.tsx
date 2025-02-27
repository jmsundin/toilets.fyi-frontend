import { FiNavigation, FiX, FiMapPin } from 'react-icons/fi';
import './LocationModal.css';
import { Toilet } from '../types.ts';
import { Session } from '@supabase/supabase-js';

interface LocationModalProps {
  toilet: Toilet;
  onClose: () => void;
  onGetDirections: (destination: { lat: string; lng: string }) => void;
  session: Session | null;
  onEdit?: (updates: Partial<Toilet>) => void;
}

export function LocationModal({ toilet, onClose, onGetDirections, session, onEdit }: LocationModalProps) {
  const handleDirectionsClick = () => {
    onGetDirections({
      lat: toilet.latitude,
      lng: toilet.longitude
    });
  };

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
          <div className="header-row">
            <h3>Turn by Turn Directions</h3>
            <button className="action-button" onClick={handleDirectionsClick}>
              <FiNavigation size={24} />
            </button>
          </div>

          <div className="location-details">
            <div className="address">
              <div className="address-row clickable" onClick={handleDirectionsClick}>
                <FiMapPin size={20} color='#0b57d0'/>
                <div className="address-text">
                  <span>{toilet.street}</span>
                  <span>{toilet.city}, {toilet.state}</span>
                </div>
              </div>
            </div>

            {toilet.location_description && (
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span>{toilet.location_description}</span>
              </div>
            )}

            {toilet.phone && (
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span>{toilet.phone}</span>
              </div>
            )}
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

          {toilet.additional_notes && (
            <div className="additional-notes">
              <h4>Additional Notes</h4>
              <p>{toilet.additional_notes}</p>
            </div>
          )}

          {/* Show edit button only if user is authenticated and owns the entry */}
          {session && toilet.user_id === session.user.id && (
            <div className="edit-controls">
              <button 
                className="edit-button"
                onClick={() => {/* Add edit functionality */}}
              >
                Edit Location
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 