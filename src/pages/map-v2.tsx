import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { MarkerF, InfoWindowF } from '@react-google-maps/api'
import { Button } from '@mui/material';

const API_KEY = 'AIzaSyDg1RaeqcvZ61vW-JZLLzW3rRxgCDuFpRg';
const REFRESH_INTERVAL = 2000; // 1 minutes

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

    const updateLocation = async () => {
        try {
            const response = await axios.post('/api/update_location/', location);
            console.log('Location updated:', response.data);
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                    
                    // setLocation({
                    //     lat: position.coords.latitude,
                    //     lng: position.coords.longitude,
                    // });
                    const email = localStorage.getItem("email")
                    const access_token = localStorage.getItem("access_token")
                    axios.post(`/api/update_location/?email=${email}`,{lat: position.coords.latitude, lng: position.coords.longitude},
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`
                        }
                    })
                    console.log({lat: position.coords.latitude, lng: position.coords.longitude})
                },
                (error) => {
                    console.error('Error fetching location:', error);
                }
            );
        }, REFRESH_INTERVAL);


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
            clearInterval(intervalId);
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
                        onClick={() => setClickMarker(true)}
                    >
                        {clickMarker && (
                            <InfoWindowF onCloseClick={() => setClickMarker(false)} position={location}>
                                <div>
                                    <p>Your current location</p>
                                    {location.lat}
                                    <br/>
                                    {location.lng}
                                </div>
                            </InfoWindowF>
                        )}
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
