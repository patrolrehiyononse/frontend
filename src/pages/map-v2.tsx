import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript, Polygon } from '@react-google-maps/api';
import { styled } from '@mui/material/styles';
import { MarkerF, InfoWindowF } from '@react-google-maps/api'
import { Button, IconButton, Snackbar } from '@mui/material';
import app from '../http_settings';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadFiles from './upload/upload';
import CloseIcon from '@mui/icons-material/Close';

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

interface Location {
    lat: number;
    lng: number;
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const GPSMap: React.FC = () => {
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [clickMarker, setClickMarker] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [coordinates, setCoordinates] = useState<any>([]);
    const [openToast, setOpenToast] = useState<boolean>(false);
    const [notificationShown, setNotificationShown] = useState<boolean>(false);

    let socket: WebSocket;

    const isLocationInsidePolygon = (userLocation: Location): boolean => {
        if (!window.google?.maps) return false;

        const googlePolygon = new window.google.maps.Polygon({
            paths: coordinates,
        });

        return google.maps.geometry.poly.containsLocation(userLocation, googlePolygon);
    };

    const connectWebSocket = () => {
        const socketUrl = 'ws://127.0.0.1:8000/ws/some_path/';
        // const socketUrl = 'wss://gpsrehiyononse.online/ws/some_path/';

        socket = new WebSocket(socketUrl);

        let options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        socket.onopen = () => {
            console.log('WebSocket connected');
            navigator.geolocation.watchPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    const { latitude, longitude } = position.coords;
                    const email = localStorage.getItem("email")
                    const data = { latitude, longitude, email };
                    socket.send(JSON.stringify(data)); // Send GPS data to the server

                    if (!notificationShown && !isLocationInsidePolygon(location)) {
                        // alert('You are outside the polygon!');
                        setOpenToast(true);
                    }
                },
                (error) => {
                    if (error.code == 1) {
                        console.log("Error: Access is denied!");
                    } else if (error.code == 2) {
                        console.log("Error: Position is unavailable!");
                    }
                },
                options
            );
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data)
            //   setGPSData(data);
        };

        socket.onclose = (event) => {
            console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
            // Retry connection after a delay
            setTimeout(connectWebSocket, 5000);
        };
    }

    // http://127.0.0.1:8000/api/geofencing/72/

    useEffect(() => {
        connectWebSocket()

        app.get(`/api/geofencing/72/`).then((res) => {
            setCoordinates(JSON.parse(res.data.coordinates))
            // setCoordinates(res.data)
            // setCenter(JSON.parse(res.data.center))
        })

        return () => {
            //     clearInterval(gpsDataInterval);
            if (socket) {
                socket.close();
            }
        };
    }, []);

    // useEffect(() => {
    //     const options = {
    //         enableHighAccuracy: true,
    //         timeout: 5000,
    //         maximumAge: 0,
    //     };

    //     const watchId = navigator.geolocation.watchPosition(
    //         (position) => {
    //             const userLocation: Location = {
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude,
    //             };
    //             setLocation(userLocation);

    //             // Check if the user is outside the polygon
    //             if (!notificationShown && !isLocationInsidePolygon(userLocation)) {
    //                 // alert('You are outside the polygon!');
    //                 setOpenToast(true);
    //             }
    //         },
    //         (error) => {
    //             if (error.code === 1) {
    //                 console.log("Error: Access is denied!");
    //             } else if (error.code === 2) {
    //                 console.log("Error: Position is unavailable!");
    //             }
    //         },
    //         options
    //     );

    //     const notificationTimer = setInterval(() => {
    //         setNotificationShown(false);
    //     }, REFRESH_INTERVAL);


    //     return () => {
    //         navigator.geolocation.clearWatch(watchId);
    //         clearInterval(notificationTimer); // Clear the notification timer
    //     };
    // }, [coordinates, notificationShown]);

    const handleLogOut = () => {
        // 
        if (socket) {
            socket.close()
        }
        localStorage.clear()
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenToast(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={location}
                    zoom={15}
                >
                    <Polygon
                        options={{
                            fillColor: "#2196f3",
                            strokeColor: "#2196f3",
                            fillOpacity: 0.5,
                            strokeWeight: 2,
                        }}
                        path={coordinates}
                    />
                    <MarkerF position={location}
                        icon={"http://maps.google.com/mapfiles/ms/icons/purple-dot.png"}
                        onClick={() => setClickMarker(true)}
                    >
                        {clickMarker && (
                            <InfoWindowF onCloseClick={() => setClickMarker(false)} position={location}>
                                <div>
                                    <p>Your current location</p>
                                    {location.lat}
                                    <br />
                                    {location.lng}
                                </div>
                            </InfoWindowF>
                        )}
                    </MarkerF>
                </GoogleMap>
                <Button href='/' onClick={handleLogOut}>
                    logout
                </Button>
                <br />
                <Button variant='contained' startIcon={<CloudUploadIcon />} onClick={() => setShowUploadModal(true)}>
                    upload file
                </Button>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openToast}
                autoHideDuration={6000}
                onClose={handleClose}
                message="You are outside the polygon!"
                action={action}
            />
            <UploadFiles open={showUploadModal} onClose={() => setShowUploadModal(false)} />
        </LoadScript>

    );
};

export default GPSMap;
