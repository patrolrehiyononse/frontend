// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const GPSDisplay = () => {
//   const [gpsData, setGPSData] = useState<any>();

//   useEffect(() => {
//     const socket = io('ws://127.0.0.1:8000/ws/gps/');  // Replace with your backend URL

//     const fetchGPSData = () => {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           const data = { latitude, longitude };
//           setGPSData(data);
//           socket.emit('gps_data', data);  // Send GPS data to the server
//         },
//         (error) => console.error('Error getting GPS data:', error),
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//       );
//     };

//     const gpsDataInterval = setInterval(fetchGPSData, 1000);  // Fetch every 1 second

//     return () => {
//       clearInterval(gpsDataInterval);
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <h2>GPS Data</h2>
//       {gpsData && (
//         <p>
//           Latitude: {gpsData.latitude}, Longitude: {gpsData.longitude}
//         </p>
//       )}
//     </div>
//   );
// };

// export default GPSDisplay;


// WebSocketComponent.js

// import React, { useEffect } from 'react';

// const WebSocketComponent = () => {
//   useEffect(() => {
//     const socket = new WebSocket('ws://localhost:8000/ws/some_path/');

//     socket.onopen = (event) => {
//       console.log('WebSocket opened.');
//       socket.send(JSON.stringify({ message: 'Hello, WebSocket!' }));
//     };

//     socket.onmessage = (event) => {
//       const message = JSON.parse(event.data).message;
//       console.log('Received message:', message);
//     };

//     socket.onclose = (event) => {
//       console.log('WebSocket closed.');
//     };

//     return () => {
//       // Close the WebSocket connection when the component unmounts
//       socket.close();
//     };
//   }, []);

//   return (
//     <div>
//       <p>WebSocket Example</p>
//     </div>
//   );
// };

// export default WebSocketComponent;

import React, { useEffect, useState } from 'react';

const GPSDisplay = () => {
  const [gpsData, setGPSData] = useState<any>();
  let socket: WebSocket;

  useEffect(() => {
    // Replace with your backend WebSocket URL
    const socketUrl = 'ws://127.0.0.1:8000/ws/some_path/';

    socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      setGPSData(data);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    const fetchGPSData = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const email = localStorage.getItem("email")
          const data = { latitude, longitude, email };
          console.log(data)
          socket.send(JSON.stringify(data)); // Send GPS data to the server
        },
        (error) => console.error('Error getting GPS data:', error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    const gpsDataInterval = setInterval(fetchGPSData, 1000); // Fetch every 1 second

    return () => {
      clearInterval(gpsDataInterval);
      socket.close();
    };
  }, []);

  return (
    <div>
      <h2>GPS Data</h2>
      {gpsData && (
        <p>
          Latitude: {gpsData.latitude}, Longitude: {gpsData.longitude}
        </p>
      )}
    </div>
  );
};

export default GPSDisplay;

