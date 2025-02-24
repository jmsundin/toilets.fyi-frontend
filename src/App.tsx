import './App.css'
import { FiMenu, FiSearch, FiNavigation, FiMapPin } from 'react-icons/fi'
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { LatLngExpression, Icon } from 'leaflet'
import { useState, useEffect } from 'react'
import { LocationModal } from './components/LocationModal'
import { Toilet } from './types'
import L from 'leaflet'
import 'leaflet-routing-machine'
import { RoutingMachine } from './components/RoutingMachine'
import { FaRestroom } from 'react-icons/fa'
import ReactDOMServer from 'react-dom/server'

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

// Replace the existing toilet icon definitions with:
const createToiletIcon = (isSelected: boolean) => {
  const iconHtml = ReactDOMServer.renderToString(
    <FaRestroom 
      size={isSelected ? 32 : 20}
      color={isSelected ? '#ff4444' : '#0b57d0'}
    />
  );

  return L.divIcon({
    html: `<div style="
      background-color: white;
      border-radius: 50%;
      width: ${isSelected ? '56px' : '32px'};
      height: ${isSelected ? '56px' : '32px'};
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid ${isSelected ? '#ff4444' : '#0b57d0'};
      box-shadow: 0 3px 6px rgba(0,0,0,0.3);
    ">${iconHtml}</div>`,
    className: '',
    iconSize: [isSelected ? 56 : 32, isSelected ? 56 : 32],
    iconAnchor: [isSelected ? 28 : 16, isSelected ? 28 : 16]
  });
};

// Add this interface near your other types
interface UserLocation {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  accessible: false;
  unisex: false;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
}

function App() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [selectedToilet, setSelectedToilet] = useState<Toilet | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [shouldCenterUser, setShouldCenterUser] = useState(false);

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
    
    useEffect(() => {
      if (shouldCenterUser) {
        map.setView(coords, ZOOM_LEVEL);
        setShouldCenterUser(false);
      }
    }, [map, coords, shouldCenterUser]);

    return null;
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setShouldCenterUser(true);
        },
        (error) => {
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

  // Add handleGetDirections function
  const handleGetDirections = (destination: { lat: string; lng: string }) => {
    if (!userLocation) {
      handleLocationRequest();
      return;
    }

    const [userLat, userLng] = userLocation;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destination.lat},${destination.lng}&travelmode=walking`;
    
    window.open(googleMapsUrl, '_blank');
  };

  const handleUserMarkerClick = () => {
    if (!userLocation) return;
    
    // Create a UserLocation object from the current location
    const userLocationData: Toilet = {
      id: -1, // Use negative ID to distinguish from toilet locations
      name: "My Location",
      street: `Latitude: ${userLocation[0].toFixed(6)}`,
      city: `Longitude: ${userLocation[1].toFixed(6)}`,
      state: "",
      accessible: false,
      unisex: false,
      latitude: userLocation[0].toString(),
      longitude: userLocation[1].toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSelectedToilet(userLocationData);
  };

  return (
    <div className="map-container">
      <div className="search-container">
        <div className="search-bar">
          <input 
            type="text" 
            className="search-input"
            placeholder="Search for toilets..."
          />
          
          <button className="icon-button" aria-label="Search">
            <FiSearch size={20} />
          </button>

          {!selectedToilet && (
            <button className="icon-button" aria-label="Get directions">
              <FiNavigation size={20} />
            </button>
          )}

          <button 
            className="icon-button location-icon"
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
            <Marker 
              position={userLocation} 
              icon={userIcon}
              eventHandlers={{
                click: handleUserMarkerClick
              }}
            />
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
                icon={createToiletIcon(selectedToilet?.id === toilet.id)}
                eventHandlers={{
                  click: () => setSelectedToilet(toilet),
                }}
              />
            );
        })}
        
        {/* {showDirections && userLocation && selectedToilet && (
          <RoutingMachine 
            userLocation={userLocation}
            destination={[
              parseFloat(selectedToilet.latitude),
              parseFloat(selectedToilet.longitude)
            ]}
          />
        )} */}
      </MapContainer>

      {selectedToilet && (
        <LocationModal
          toilet={selectedToilet}
          onClose={() => {
            setSelectedToilet(null);
            setShowDirections(false);
          }}
          onGetDirections={handleGetDirections}
        />
      )}
    </div>
  )
}

export default App
