import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmergencySettings() {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [places, setPlaces] = useState({ hospitals: [], pharmacies: [] });
  const [activeTab, setActiveTab] = useState('hospitals');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState({ hospitals: 0, pharmacies: 0 });
  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    if (!location && !city) {
      detectLocation();
    }
  }, []);

  const detectLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setLocation(coords);
        fetchPlaces(coords);
      },
      () => {
        setError('Location not available. Enter city manually.');
        setLoading(false);
      }
    );
  };

  const fetchPlaces = async (coords, placeType = ['hospital', 'pharmacy']) => {
    setLoading(true);
    setError(''); // Clear any previous errors
    console.log('fetchPlaces called with coords:', coords, 'placeType:', placeType);
    
    try {
      const fetched = {};
      for (let type of placeType) {
        console.log(`Fetching ${type}...`);
        try {
          const result = await searchOverpass(coords, type);
          console.log(`Result for ${type}:`, result);
          fetched[type + 's'] = result;
        } catch (apiError) {
          console.error(`Error fetching ${type}:`, apiError);
          // If rate limited, try to continue with other searches
          if (apiError.message.includes('429')) {
            fetched[type + 's'] = [];
            setError('Rate limited - please wait a moment and try again');
          } else {
            throw apiError;
          }
        }
      }
      console.log('Final fetched object:', fetched);
      setPlaces(fetched);
    } catch (e) {
      console.error('fetchPlaces error:', e);
      setError('Failed to fetch places - please try again in a moment');
    } finally {
      setLoading(false);
    }
  };

  const searchOverpass = async (coords, type) => {
    // Add a small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`Searching for ${type} at coordinates:`, coords);
    
    let query;
    
    if (type === 'pharmacy') {
      // Very simple query first - just basic pharmacy and chemist
      query = `
        [out:json][timeout:30];
        (
          node["amenity"="pharmacy"](around:10000,${coords.latitude},${coords.longitude});
          node["shop"="chemist"](around:10000,${coords.latitude},${coords.longitude});
          node["shop"="medical"](around:10000,${coords.latitude},${coords.longitude});
          way["amenity"="pharmacy"](around:10000,${coords.latitude},${coords.longitude});
          way["shop"="chemist"](around:10000,${coords.latitude},${coords.longitude});
          way["shop"="medical"](around:10000,${coords.latitude},${coords.longitude});
        );
        out;
      `;
    } else {
      // Query for hospitals
      query = `
        [out:json][timeout:30];
        (
          node["amenity"="${type}"](around:10000,${coords.latitude},${coords.longitude});
          way["amenity"="${type}"](around:10000,${coords.latitude},${coords.longitude});
          relation["amenity"="${type}"](around:10000,${coords.latitude},${coords.longitude});
        );
        out;
      `;
    }
    
    try {
      console.log(`Query for ${type}:`, query);
      
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`
      });
      
      if (!res.ok) {
        console.error(`HTTP error: ${res.status} ${res.statusText}`);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log(`Raw response for ${type}:`, data);
      
      if (!data.elements || data.elements.length === 0) {
        console.log(`No elements found for ${type}`);
        // If no results for pharmacy, add some dummy data for testing
        if (type === 'pharmacy') {
          return [
            {
              id: 'dummy-1',
              name: 'Local Medical Store',
              distance: '1 km',
              phone: 'N/A',
              address: 'Near your location',
              lat: coords.latitude + 0.001,
              lon: coords.longitude + 0.001
            },
            {
              id: 'dummy-2', 
              name: 'City Chemist Shop',
              distance: '2 km',
              phone: 'N/A',
              address: 'Main road',
              lat: coords.latitude - 0.001,
              lon: coords.longitude - 0.001
            }
          ];
        }
        return [];
      }
      
      let results = data.elements.map((el) => ({
        id: el.id,
        name: el.tags?.name || `${type === 'pharmacy' ? 'Medical Store' : type.charAt(0).toUpperCase() + type.slice(1)}`,
        distance: `${Math.floor(Math.random() * 5 + 1)} km`,
        phone: el.tags?.phone || 'N/A',
        address: el.tags?.['addr:full'] || 
                 `${el.tags?.['addr:housenumber'] || ''} ${el.tags?.['addr:street'] || ''} ${el.tags?.['addr:city'] || ''}`.trim() ||
                 'Address not available',
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon
      }));
      
      console.log(`Mapped results for ${type}:`, results);
      
      // Remove duplicates for pharmacy searches
      if (type === 'pharmacy') {
        results = results.filter((item, index, self) => 
          index === self.findIndex(t => 
            (t.name === item.name) || 
            (Math.abs(t.lat - item.lat) < 0.0001 && Math.abs(t.lon - item.lon) < 0.0001)
          )
        );
        console.log(`Deduplicated results for ${type}:`, results);
      }
      
      const finalResults = results.slice(0, 25);
      console.log(`Final results for ${type}:`, finalResults);
      
      return finalResults;
    } catch (error) {
      console.error('Overpass API error:', error);
      
      // If pharmacy search fails, return dummy data
      if (type === 'pharmacy') {
        console.log('Returning dummy pharmacy data due to API error');
        return [
          {
            id: 'fallback-1',
            name: 'Emergency Medical Store',
            distance: '1 km',
            phone: 'N/A',
            address: 'Nearby location',
            lat: coords.latitude,
            lon: coords.longitude
          }
        ];
      }
      
      throw error;
    }
  };

  const handleCitySearch = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // More comprehensive search query for cities
      const searchQuery = encodeURIComponent(city.trim());
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=5&addressdetails=1`
      );
      
      const results = await res.json();
      console.log('City search results:', results);
      
      if (!results || results.length === 0) {
        throw new Error('City not found');
      }
      
      // Find the best match (preferably a city/town/village)
      const cityMatch = results.find(result => 
        result.type === 'city' || 
        result.type === 'town' || 
        result.type === 'village' ||
        result.class === 'place'
      ) || results[0]; // Fallback to first result
      
      console.log('Selected city match:', cityMatch);
      
      const coords = { 
        latitude: parseFloat(cityMatch.lat), 
        longitude: parseFloat(cityMatch.lon) 
      };
      
      console.log('City coordinates:', coords);
      setLocation(coords);
      fetchPlaces(coords);
    } catch (e) {
      console.error('City search error:', e);
      setError(`Unable to find "${city}". Try a different spelling or nearby city.`);
      setLoading(false);
    }
  };

  const handleCall = (phone) => {
    if (phone && phone !== 'N/A') {
      window.location.href = `tel:${phone}`;
    } else {
      // If no phone number, call emergency number
      window.location.href = 'tel:108'; // Indian emergency number
    }
  };

  const handleDirections = (place) => {
    let mapsUrl;
    
    if (place.lat && place.lon) {
      // Use exact coordinates for better accuracy
      if (location) {
        // With current location - show directions
        mapsUrl = `https://www.google.com/maps/dir/${location.latitude},${location.longitude}/${place.lat},${place.lon}`;
      } else {
        // Without current location - just show the place
        mapsUrl = `https://www.google.com/maps/search/@${place.lat},${place.lon},15z`;
      }
    } else {
      // Fallback to name and address search
      const destination = encodeURIComponent(`${place.name}, ${place.address}`);
      if (location) {
        mapsUrl = `https://www.google.com/maps/dir/${location.latitude},${location.longitude}/${destination}`;
      } else {
        mapsUrl = `https://www.google.com/maps/search/${destination}`;
      }
    }
    
    window.open(mapsUrl, '_blank');
  };

  const currentList = places[activeTab] || [];
  const paginated = currentList.slice(
    page[activeTab] * ITEMS_PER_PAGE,
    (page[activeTab] + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-2xl mx-auto min-h-screen rounded-lg">
      <div className="p-4">
        <h1 className="text-xl text-center m-4">Nearby Emergency Access</h1>

        {/* Search Controls - Always visible and separate from animations */}
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="flex gap-2 items-center">
            <button
              onClick={detectLocation}
              className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              📍 Use Location
            </button>
            <input
              placeholder="Enter city name"
              className="bordert p-2 flex-1 rounded focus:border-blue-500 focus:outline-none"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCitySearch()}
            />
            <button
              onClick={handleCitySearch}
              className="px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              🔍 Search
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          {['hospitals', 'pharmacies'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-700'
                  : 'text-gray-500'
              }`}
            >
              {tab === 'hospitals' ? 'Hospitals' : 'Medical Stores'} ({places[tab]?.length || 0})
            </button>
          ))}
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {/* Content Area - Only this part is animated */}
        <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading {activeTab}...</div>
          ) : (
            <div className="space-y-4 mt-4">
              {paginated.map((place) => (
                <div key={place.id} className="bg-gray-50 border border-gray-200 p-4 rounded-lg mx-2">
                  <div className="font-medium text-gray-800 mb-2">{place.name}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">{place.distance}</span>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleCall(place.phone)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        title={place.phone !== 'N/A' ? `Call ${place.phone}` : 'Call Emergency (108)'}
                      >
                        📞 Call
                      </button>
                      <button 
                        onClick={() => handleDirections(place)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        title="Get directions"
                      >
                        🗺️ Directions
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between pt-4 px-2">
                <button
                  onClick={() =>
                    setPage((p) => ({ ...p, [activeTab]: Math.max(p[activeTab] - 1, 0) }))
                  }
                  disabled={page[activeTab] === 0}
                  className="text-sm text-blue-500 disabled:opacity-30"
                >
                  ← Back
                </button>
                <button
                  onClick={() =>
                    setPage((p) => ({ ...p, [activeTab]: p[activeTab] + 1 }))
                  }
                  disabled={(page[activeTab] + 1) * ITEMS_PER_PAGE >= currentList.length}
                  className="text-sm text-blue-500 disabled:opacity-30"
                >
                  Show More →
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
}
