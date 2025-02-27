import './App.css'
import { FiMenu, FiSearch, FiNavigation, FiMapPin, FiFilter } from 'react-icons/fi'
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { LatLngExpression, Icon } from 'leaflet'
import { useState, useEffect, useCallback } from 'react'
import { LocationModal } from './components/LocationModal'
import { Toilet } from './types'
import L from 'leaflet'
import 'leaflet-routing-machine'
// import { RoutingMachine } from './components/RoutingMachine'
import { FaRestroom } from 'react-icons/fa'
import ReactDOMServer from 'react-dom/server'
import Fuse from 'fuse.js'
import { SearchResults } from './components/SearchResults'
import { debounce } from 'lodash'
import { FilterModal } from './components/FilterModal'
import { SlideMenu } from './components/SlideMenu'
import { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import axios from 'axios'

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

// Add these new interfaces
interface UserProfile {
  id: string;
  favorites: number[];  // toilet IDs
  comments: Comment[];
}

interface Comment {
  id: number;
  toiletId: number;
  text: string;
  createdAt: string;
}

// Add this interface for Nominatim search results
interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}

// Add a new icon for searched locations
const searchedLocationIcon = new Icon({
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
  const [showDirections, setShowDirections] = useState(false);
  const [shouldCenterUser, setShouldCenterUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Toilet[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([34.0522, -118.2437]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    accessible: false,
    unisex: false
  });
  const [userToilets, setUserToilets] = useState<Toilet[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [addressResults, setAddressResults] = useState<NominatimResult[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchToilets = async () => {
      try {
        const response = await fetch('/api/toilets');
        const data = await response.json();
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
        setMapCenter(coords);
        setShouldCenterUser(false);
      }
    }, [map, coords, shouldCenterUser]);

    // Add this effect to respond to mapCenter changes
    useEffect(() => {
      map.setView(mapCenter, ZOOM_LEVEL);
    }, [map, mapCenter]);

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

  // Initialize Fuse instance
  const fuse = new Fuse(toilets, {
    keys: [
      'name',
      'street',
      'city',
      'state',
      'location_description',
      { name: 'accessible', getFn: (toilet) => toilet.accessible ? 'accessible' : '' },
      { name: 'unisex', getFn: (toilet) => toilet.unisex ? 'gender neutral' : '' }
    ],
    threshold: 0.3,
    includeScore: true
  });

  // Add a function to filter toilets based on current filters
  const getFilteredToilets = useCallback(() => {
    return toilets.filter(toilet => 
      (!filters.accessible || toilet.accessible) &&
      (!filters.unisex || toilet.unisex)
    );
  }, [toilets, filters]);

  // Update the search function to use filtered toilets
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const filteredResults = fuse.search(query)
        .map(result => result.item)
        .filter(toilet => 
          (!filters.accessible || toilet.accessible) &&
          (!filters.unisex || toilet.unisex)
        );
      setSearchResults(filteredResults);
    }, 500),
    [toilets, filters]
  );

  // Add this function to search for addresses using Nominatim
  const searchAddresses = useCallback(
    debounce(async (query: string) => {
      if (!query.trim() || query.length < 3) {
        setAddressResults([]);
        return;
      }
      
      setIsSearchingAddress(true);
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: query,
            format: 'json',
            addressdetails: 1,
            limit: 5,
            countrycodes: 'us' // Limit to US addresses
          },
          headers: {
            'User-Agent': 'ToiletFinderApp' // Required by Nominatim's usage policy
          }
        });
        
        setAddressResults(response.data);
      } catch (error) {
        console.error('Error searching addresses:', error);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 500),
    []
  );

  // Update the handleSearchInput function
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Search for toilets in our database
    debouncedSearch(query);
    
    // Also search for addresses using Nominatim
    searchAddresses(query);
  };

  // Handle search result click
  const handleResultClick = (toilet: Toilet) => {
    const lat = parseFloat(toilet.latitude);
    const lng = parseFloat(toilet.longitude);
    
    setSelectedToilet(toilet);
    setSearchQuery('');
    setSearchResults([]);
    setMapCenter([lat, lng]);
  };

  // Update function to handle address selection
  const handleAddressSelect = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Create a temporary "toilet" object to display in the modal
    const addressLocation: Toilet = {
      id: -2, // Use -2 to distinguish from user location (-1) and actual toilets
      name: "Searched Location",
      street: result.display_name.split(',')[0],
      city: '',
      state: '',
      accessible: false,
      unisex: false,
      latitude: result.lat,
      longitude: result.lon,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Set the selected toilet and searched location
    setSelectedToilet(addressLocation);
    setSearchedLocation([lat, lng]);
    
    // Clear search results
    setSearchQuery('');
    setAddressResults([]);
    setSearchResults([]);
    
    // Center the map on the selected location
    setMapCenter([lat, lng]);
  };

  // Update submission handler
  const handleToiletSubmission = async (newToilet: Omit<Toilet, 'id' | 'created_at' | 'updated_at'>) => {
    if (!session) {
      alert('Please login to submit a toilet location');
      return;
    }

    try {
      const response = await fetch('/api/toilets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ ...newToilet, user_id: session.user.id })
      });

      if (!response.ok) throw new Error('Failed to submit toilet');
      const data = await response.json();
      setToilets(prev => [...prev, data]);
    } catch (error) {
      console.error('Error submitting toilet:', error);
      alert('Failed to submit toilet location');
    }
  };

  // Update edit handler
  const handleToiletEdit = async (toiletId: number, updates: Partial<Toilet>) => {
    if (!session) {
      alert('Please login to edit toilet locations');
      return;
    }

    try {
      const response = await fetch(`/api/toilets/${toiletId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update toilet');
      const data = await response.json();
      setToilets(prev => prev.map(t => t.id === toiletId ? data : t));
    } catch (error) {
      console.error('Error updating toilet:', error);
      alert('Failed to update toilet location');
    }
  };

  return (
    <div className="map-container">
      <div className="search-container">
        <div className="search-bar">
          <button 
            className="icon-button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menu"
          >
            <FiMenu size={20} />
          </button>

          <input 
            type="text" 
            className="search-input"
            placeholder="Search for toilets or addresses..."
            value={searchQuery}
            onChange={handleSearchInput}
          />
          
          <button 
            className="icon-button"
            onClick={() => setShowFilterModal(true)}
            aria-label="Filter"
          >
            <FiFilter size={20} />
          </button>

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
        
        <SearchResults 
          results={searchResults}
          addressResults={addressResults}
          onResultClick={handleResultClick}
          onAddressClick={handleAddressSelect}
          isSearchingAddress={isSearchingAddress}
        />
      </div>
      
      <MapContainer 
        center={mapCenter} 
        zoom={ZOOM_LEVEL} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.carto.com/">CARTO</a>'
        />
        <MapController coords={userLocation || mapCenter} />
        
        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={userIcon}
            eventHandlers={{
              click: handleUserMarkerClick
            }}
          />
        )}
        
        {/* Searched location marker */}
        {searchedLocation && (
          <Marker 
            position={searchedLocation} 
            icon={searchedLocationIcon}
            eventHandlers={{
              click: () => {
                // If we have a selected toilet with id -2, it's our searched location
                if (selectedToilet && selectedToilet.id === -2) {
                  // The marker is already selected, do nothing
                } else {
                  // Find the searched location toilet object and select it
                  const lat = searchedLocation[0].toString();
                  const lng = searchedLocation[1].toString();
                  
                  const searchedLocationData: Toilet = {
                    id: -2,
                    name: "Searched Location",
                    street: "Searched Address",
                    city: '',
                    state: '',
                    accessible: false,
                    unisex: false,
                    latitude: lat,
                    longitude: lng,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  };
                  
                  setSelectedToilet(searchedLocationData);
                }
              }
            }}
          />
        )}
        
        {/* Toilet markers */}
        {getFilteredToilets()
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
          session={session}
          onClose={() => {
            setSelectedToilet(null);
            setShowDirections(false);
          }}
          onGetDirections={handleGetDirections}
        />
      )}

      {showFilterModal && (
        <FilterModal
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            debouncedSearch(searchQuery);
          }}
        />
      )}

      <SlideMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        session={session}
      />
    </div>
  )
}

export default App
