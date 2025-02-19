import './App.css'
import { FiMenu, FiSearch, FiNavigation, FiMapPin } from 'react-icons/fi'
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { LatLngExpression, Icon } from 'leaflet'
import { useState, useEffect } from 'react'
import { LocationModal } from './components/LocationModal'
import { Toilet } from './types'

// Los Angeles coordinates
const LA_CENTER: LatLngExpression = [34.0522, -118.2437]
const ZOOM_LEVEL = 13

// Custom icon for user location
const userIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function App() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [selectedToilet, setSelectedToilet] = useState<Toilet | null>(null);

  useEffect(() => {
    const fetchToilets = async () => {
      try {
        const response = await fetch('/api/toilets');
        const data = await response.json();
        console.log('Fetched toilets:', data); // Debug log
        setToilets(data);
      } catch (error) {
        console.error('Error fetching toilets:', error);
      }
    };

    fetchToilets();
  }, []);

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

  // Helper function to validate coordinates
  const isValidCoordinate = (lat: string, lng: string): boolean => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    return !isNaN(latitude) && !isNaN(longitude) &&
           latitude >= -90 && latitude <= 90 &&
           longitude >= -180 && longitude <= 180;
  };

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
        
        {!selectedToilet && (
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
        )}
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
            <Marker position={userLocation} icon={userIcon} />
          </>
        )}
        {toilets
          .filter(toilet => isValidCoordinate(toilet.latitude, toilet.longitude))
          .map((toilet) => {
            const lat = parseFloat(toilet.latitude);
            const lng = parseFloat(toilet.longitude);
            return (
              <Marker
                key={toilet.id}
                position={[lat, lng]}
                eventHandlers={{
                  click: () => setSelectedToilet(toilet),
                }}
              />
            );
        })}
      </MapContainer>

      {selectedToilet && (
        <LocationModal
          toilet={selectedToilet}
          onClose={() => setSelectedToilet(null)}
        />
      )}
    </div>
  )
}

export default App
