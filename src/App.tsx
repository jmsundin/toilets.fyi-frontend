import './App.css'
import { FiMenu, FiSearch, FiNavigation, FiMapPin } from 'react-icons/fi'
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { LatLngExpression } from 'leaflet'
import { useState } from 'react'

// Los Angeles coordinates
const LA_CENTER: LatLngExpression = [34.0522, -118.2437]
const ZOOM_LEVEL = 13

function App() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const MapController = ({ coords }: { coords: [number, number] }) => {
    const map = useMap();
    map.setView(coords, ZOOM_LEVEL);
    return null;
  };

  const handleLocationRequest = () => {
    // Request user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          // Error callback
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Please make sure location services are enabled.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  }

  return (
    <div className="map-container">
      <div className="search-container">
        <div className="search-bar">
          {/* <button className="icon-button" aria-label="Menu">
            <FiMenu size={20} />
          </button> */}
          
          <input 
            type="text" 
            className="search-input"
            placeholder="Search for toilets..."
          />
          
          <button className="icon-button" aria-label="Search">
            <FiSearch size={20} />
          </button>
        </div>
        
        <div className="action-buttons">
          <button className="action-button" aria-label="Get directions">
            <FiNavigation size={20} />
          </button>
          
          <button 
            className="action-button"
            onClick={handleLocationRequest}
            aria-label="Get current location"
          >
            <FiMapPin size={20} />
          </button>
        </div>
      </div>
      
      <MapContainer 
        center={LA_CENTER} 
        zoom={ZOOM_LEVEL} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.carto.com/">CARTO</a>'
        />
        {userLocation && (
          <>
            <MapController coords={userLocation} />
            <Marker position={userLocation} />
          </>
        )}
      </MapContainer>
    </div>
  )
}

export default App
