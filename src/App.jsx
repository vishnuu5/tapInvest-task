import React, { useEffect, useState, useRef } from 'react';
import CanvasMap from './components/CanvasMap';

export default function App() {
  const [position, setPosition] = useState(null);
  const [path, setPath] = useState([]);
  const [networkType, setNetworkType] = useState('unknown');
  const watchIdRef = useRef(null);
  const intervalRef = useRef(null); // Save interval reference

  const startTracking = () => {
    const fakePath = [
      { latitude: 12.9716, longitude: 77.5946 },
      { latitude: 12.972, longitude: 77.595 },
      { latitude: 12.9724, longitude: 77.5954 },
      { latitude: 12.9728, longitude: 77.5958 },
    ];

    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= fakePath.length) {
        clearInterval(intervalRef.current); // stop after last point
        return;
      }

      const point = fakePath[i];
      setPosition(point);          // Update current position
      setPath((prev) => [...prev, point]); // Add to path
      i++;
    }, 1000);
  };

  const stopTracking = () => {
    clearInterval(intervalRef.current); // Stop fake interval
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
  };

  // Network Information API
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      setNetworkType(connection.effectiveType);
      connection.addEventListener('change', () => {
        setNetworkType(connection.effectiveType);
      });
    }
  }, []);

  return (
    <div className="app">
      <h1>Smart Jogger Assistant</h1>
      <p><strong>Network:</strong> {networkType}</p>

      {position && (
        <p>
          <strong>Current Location:</strong> {position.latitude.toFixed(6)}, {position.longitude.toFixed(6)}
        </p>
      )}

      <div>
        <button onClick={startTracking}>Start Jog</button>
        <button onClick={stopTracking}>Stop Jog</button>
      </div>

      <CanvasMap path={path} />
    </div>
  );
}
