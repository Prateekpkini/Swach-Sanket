import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Square,
  Navigation,
  Home,
  Locate,
  Compass,
  LogOut,
} from "lucide-react";

/* ================= ROUTES ================= */
const ROUTES = [
  {
    id: 1,
    name: "Route A - Northern Panchayats",
    area: "Yelahanka, Hesaraghatta, Jala Hobli",
    color: "#3b82f6",
    panchayats: [
      { id: 101, name: "Yelahanka GP", address: "Yelahanka", lat: 13.1007, lng: 77.5963 },
      { id: 102, name: "Kogilu GP", address: "Kogilu", lat: 13.1249, lng: 77.5819 },
      { id: 103, name: "Vidyaranyapura GP", address: "Vidyaranyapura", lat: 13.0794, lng: 77.554 },
    ],
  },
];

/* ================= CSS ================= */
if (!document.getElementById("leaflet-css")) {
  const css = document.createElement("link");
  css.id = "leaflet-css";
  css.rel = "stylesheet";
  css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
  document.head.appendChild(css);
}
if (!document.getElementById("leaflet-routing-css")) {
  const css = document.createElement("link");
  css.id = "leaflet-routing-css";
  css.rel = "stylesheet";
  css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet-routing-machine/3.2.12/leaflet-routing-machine.min.css";
  document.head.appendChild(css);
}

/* ================= MAIN COMPONENT ================= */
export default function DriverDashboard() {
  const [status, setStatus] = useState("idle");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [currentPanchayatIndex, setCurrentPanchayatIndex] = useState(0);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [heading, setHeading] = useState(null);
  const [distanceToNext, setDistanceToNext] = useState(null);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routingControlRef = useRef(null);

  const currentPanchayat = selectedRoute?.panchayats[currentPanchayatIndex];

  /* Load Leaflet scripts */
  useEffect(() => {
    const loadScript = (src, id) =>
      new Promise((resolve, reject) => {
        if (document.getElementById(id)) return resolve();
        const s = document.createElement("script");
        s.id = id;
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });
    (async () => {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js", "leaflet-js");
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet-routing-machine/3.2.12/leaflet-routing-machine.min.js",
        "leaflet-routing-js"
      );
      setLeafletLoaded(true);
    })();
  }, []);

  /* GPS tracking */
  useEffect(() => {
    if (status !== "active") return;
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed, heading } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setSpeed(speed ? (speed * 3.6).toFixed(1) : 0); // m/s → km/h
        setHeading(heading ?? null);
      },
      (err) => console.error("Geo error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [status]);

  /* Calculate distance between coordinates (stable reference for effects) */
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }, []);

  /* Compute distance to next panchayat */
  useEffect(() => {
    if (userLocation && currentPanchayat) {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        currentPanchayat.lat,
        currentPanchayat.lng
      );
      setDistanceToNext(dist);
    }
  }, [userLocation, currentPanchayat, calculateDistance]);

  /* Initialize map */
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || !selectedRoute || status !== "active" || !currentPanchayat) return;
    const L = window.L;
    if (!L) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([currentPanchayat.lat, currentPanchayat.lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);
      mapInstanceRef.current = map;
    } else {
      // keep map centered with current target if already created
      mapInstanceRef.current.setView([currentPanchayat.lat, currentPanchayat.lng], 13);
    }
  }, [leafletLoaded, selectedRoute, status, currentPanchayat]);

  /* Routing and markers */
  useEffect(() => {
    const L = window.L;
    if (!L || !leafletLoaded || !selectedRoute || !currentPanchayat || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // remove previous routing control if any
    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch {
        /* ignore */
      }
      routingControlRef.current = null;
    }

    // place marker for the current panchayat
    const targetMarker = L.marker([currentPanchayat.lat, currentPanchayat.lng])
      .addTo(map)
      .bindPopup(currentPanchayat.name);

    if (userLocation) {
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(userLocation.lat, userLocation.lng),
          L.latLng(currentPanchayat.lat, currentPanchayat.lng),
        ],
        router: L.Routing.osrmv1({ serviceUrl: "https://router.project-osrm.org/route/v1" }),
        addWaypoints: false,
        show: false,
        lineOptions: { styles: [{ color: selectedRoute.color, weight: 5 }] },
        createMarker: () => null,
      }).addTo(map);
    }

    map.setView([currentPanchayat.lat, currentPanchayat.lng], 13);

    // cleanup marker when deps change
    return () => {
      try {
        map.removeLayer(targetMarker);
      } catch {
        /* ignore */
      }
    };
  }, [userLocation, currentPanchayatIndex, currentPanchayat, leafletLoaded, selectedRoute]);

  /* Route controls */
  const startRoute = (route) => {
    setSelectedRoute(route);
    setStatus("active");
    setCurrentPanchayatIndex(0);
  };

  const resetRoute = () => {
    setStatus("idle");
    setSelectedRoute(null);
    setCurrentPanchayatIndex(0);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    routingControlRef.current = null;
  };

  /* Convert heading degrees to direction text */
  const getDirection = (deg) => {
    if (deg == null) return "N/A";
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(deg / 45) % 8];
  };

  /* ================= UI ================= */
  if (status === "idle") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-8 mb-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-xl">
                <Navigation size={40} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">MRF Driver Dashboard</h1>
                <p className="text-green-100">Select route for navigation</p>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("auth_token");
                window.location.href = "/";
              }}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ROUTES.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div
                  className="p-6 text-white"
                  style={{ background: `linear-gradient(135deg, ${r.color} 0%, ${r.color}cc 100%)` }}
                >
                  <h2 className="text-2xl font-bold mb-1">{r.name}</h2>
                  <p>{r.area}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Home className="text-gray-500" size={18} />
                    <span>{r.panchayats.length} Panchayats</span>
                  </div>
                  <button
                    onClick={() => startRoute(r)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex justify-center gap-2 items-center"
                  >
                    <Play size={20} />
                    Start Navigation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-5xl mx-auto mb-6">
          <div
            className="rounded-2xl shadow-xl text-white p-4 flex justify-between items-center"
            style={{ background: `linear-gradient(135deg, ${selectedRoute.color} 0%, ${selectedRoute.color}cc 100%)` }}
          >
            <h2 className="text-xl font-bold">{selectedRoute.name}</h2>
            <button
              onClick={resetRoute}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg flex items-center gap-2"
            >
              <Square size={16} /> Stop
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Navigation size={20} /> Turn-by-Turn Navigation
            </h3>
            <button
              onClick={() => setShowMap(!showMap)}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm"
            >
              {showMap ? "Hide" : "Show"}
            </button>
          </div>

          {showMap && (
            <div className="relative h-[600px] bg-gray-900">
              {leafletLoaded ? (
                <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
              ) : (
                <div className="h-full flex items-center justify-center text-white">
                  <Locate size={48} className="animate-spin opacity-50" />
                  <p>Loading map...</p>
                </div>
              )}

              {/* Overlay Info */}
              {userLocation && currentPanchayat && (
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">Current Speed</div>
                    <div className="text-3xl font-bold text-blue-600">{speed} km/h</div>
                  </div>
                  <div className="text-center">
                    <Compass
                      size={36}
                      className="mx-auto text-gray-700"
                      style={{ transform: `rotate(${heading || 0}deg)`, transition: "transform 0.5s linear" }}
                    />
                    <div className="text-sm font-semibold text-gray-600">{getDirection(heading)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Next Stop</div>
                    <div className="font-bold">{currentPanchayat.name}</div>
                    {distanceToNext != null && (
                      <div className="text-gray-600 text-sm">
                        {distanceToNext < 1
                          ? `${(distanceToNext * 1000).toFixed(0)} m`
                          : `${distanceToNext.toFixed(2)} km`}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center text-gray-600 font-semibold">
          {distanceToNext !== null && currentPanchayat && (
            <p>
              {distanceToNext < 0.3
                ? `Arriving at ${currentPanchayat.name}`
                : heading !== null
                ? `Head ${getDirection(heading)} towards ${currentPanchayat.name}`
                : `Navigating towards ${currentPanchayat.name}`}
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}
