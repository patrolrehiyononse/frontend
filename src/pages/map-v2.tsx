import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { MarkerF, InfoWindowF } from '@react-google-maps/api'
import { Button } from '@mui/material';
import app from '../http_settings';

const API_KEY: string = process.env.REACT_APP_GOOGLE_API_KEY!;
const REFRESH_INTERVAL = 3000;

const containerStyle = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: 0,
    lng: 0,
};

const GPSMap: React.FC = () => {
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [clickMarker, setClickMarker] = useState(false);
    let socket: WebSocket;

    const updateLocation = async () => {
        try {
            const response = await axios.post('/api/update_location/', location);
            console.log('Location updated:', response.data);
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    useEffect(() => {
        const socketUrl = 'ws://127.0.0.1:8000/ws/some_path/';

        socket = new WebSocket(socketUrl);

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data)
            //   setGPSData(data);
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


        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                //   updateLocation();

            },
            (error) => {
                console.error('Error fetching location:', error);
            }
        );

        return () => {
            clearInterval(gpsDataInterval);
            socket.close();
        };
    }, []);

    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={location}
                    zoom={15}
                >
                    <MarkerF position={location}
                        icon={"http://maps.google.com/mapfiles/ms/icons/purple-dot.png"}
                    // onClick={() => setClickMarker(true)}
                    >
                        {/* {clickMarker && (
                            <InfoWindowF onCloseClick={() => setClickMarker(false)} position={location}>
                                <div>
                                    <p>Your current location</p>
                                    {location.lat}
                                    <br />
                                    {location.lng}
                                </div>
                            </InfoWindowF>
                        )} */}
                    </MarkerF>
                </GoogleMap>
                <Button href='/' onClick={() => localStorage.clear()}>
                    logout
                </Button>
            </div>
        </LoadScript>
    );
};

export default GPSMap;
