import cimdataLocations from '@/library/cimdataLocations';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
/* Eigentlich wollen wir https://github.com/yuzhva/react-leaflet-markercluster
nutzen, aktuell ist das Paket aber nicht mit react-leaflet 4 kompatibel.
Künftig prüfen, ob es ein Update gab, die @changey-Version ist nur ein
Klon mit Bugfix, um Kompatibel mit react-leaflet 4 zu sein. */
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import { getDistance } from '@/library/helpers';

const defaultCenter = { lat: 51.1864708, lng: 10.0671016 };
const defaultZoom = 6;

// Prüfen, ob das Gerät Geolocation unterstützt
const navigatorAvailable = Boolean(window?.navigator?.geolocation);

export default function LocationFinder() {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [userLocation, setUserLocation] = useState(null);
  const [locations, setLocations] = useState(cimdataLocations);

  async function showNearLocations() {
    try {
      const location = await getUserLocation();
      const userCenter = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      const locationsInRadius = getLocationsInRadius(userCenter);
      setLocations(locationsInRadius);
      setMapCenter(userCenter);
      setZoom(11);
      setUserLocation(userCenter);
    } catch (error) {
      // https://developer.mozilla.org/en-US/docs/Web/API/PositionError
      console.log(error);
    }
  }

  const reset = () => {
    setLocations(cimdataLocations);
    setZoom(defaultZoom);
    setMapCenter(defaultCenter);
    setUserLocation(null);
  };

  return (
    <section>
      {navigatorAvailable && (
        <button onClick={showNearLocations}>
          Zeige Standorte in meiner Nähe
        </button>
      )}
      <button onClick={reset}>Zeige alle Standorte</button>
      {/* Die Props von MapContainer werden nur beim ersten Rendern der Karte
        berücksichtig, spätere Änderungen haben keine Auswirkung! */}
      <MapContainer
        center={mapCenter}
        zoom={defaultZoom}
        scrollWheelZoom={false}
      >
        {/* MapController hat Zugriff auf die Leaflet-Karte, Änderungen bei
          den Props haben Auswirkungen. */}
        <MapController center={mapCenter} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {locations.map(({ latLng, title }) => (
            <Marker key={title} position={latLng}>
              <Popup>
                <strong>{title}</strong>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <strong>Ihr Standort</strong>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </section>
  );
}

function MapController({ center, zoom }) {
  /* map enthält die Leaflet-Instanz. */
  const map = useMap();

  /* Hier werden Methoden der Leaflet-Bibliothek verwendet, ganz unabhängig
        von React!
        https://leafletjs.com/reference-1.7.1.html#map-methods-for-modifying-map-state
        (Achtung: Da map.setView() das map-Objekt zurückgibt, müssen wir bei der Callback-
        Funktion in useEffect geschweifte Klammern verwenden, um die automatische Rückgabe
        bei einzeiligen Pfeilfunktionen zu vermeiden. React würde sonst map für die 
        "Aufräum-Funktion" des Effekts halten und als Funktion aufrufen, was zum Absturz 
        des Programms führen würde.)
        */
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

function getUserLocation() {
  // https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  /* Die ältere geolocation-API basiert auf Callback-Funktionen statt
      Promises. Hier wird sie in ein Promise verpackt, um sie in asynchronen
      Funktionen nutzen zu können. */
  return new Promise((resolve, reject) => {
    window.navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function getLocationsInRadius(center, radius = 10) {
  const locationsInRadius = cimdataLocations.filter(({ latLng }) => {
    const distance = getDistance(
      latLng.lat,
      latLng.lng,
      center.lat,
      center.lng
    );

    return distance <= radius;
  });

  return locationsInRadius;
}
