import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { MarkerF, InfoWindowF } from '@react-google-maps/api'

const API_KEY = 'AIzaSyDg1RaeqcvZ61vW-JZLLzW3rRxgCDuFpRg';
const REFRESH_INTERVAL = 60000; // 1 minute

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 0,
    lng: 0,
};

const GPSMap = (props: any) => {
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [center, setCenter] = useState({ lat: 0, lng: 0 })

    const [clickMarker, setClickMarker] = useState<any>({});
    const [selectedMarker, setSelectedMarker] = useState<any>();

    const updateLocation = async () => {
        try {
            const response = await axios.post('/api/update_location/', location);
            console.log('Location updated:', response.data);
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 setLocation({
    //                     lat: position.coords.latitude,
    //                     lng: position.coords.longitude
    //                 })
    //                 console.log("Lat", position.coords.latitude)
    //                 console.log("Lng", position.coords.longitude)
    //                 // setLocation({
    //                 //     lat: position.coords.latitude,
    //                 //     lng: position.coords.longitude,
    //                 // });
    //             },
    //             (error) => {
    //                 console.error('Error fetching location:', error);
    //             }
    //         );
    //     }, REFRESH_INTERVAL);

    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             setLocation({
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude,
    //             });
    //             //   updateLocation();
    //             console.log(position)
    //         },
    //         (error) => {
    //             console.error('Error fetching location:', error);
    //         }
    //     );

    //     return () => {
    //         clearInterval(intervalId);
    //     };
    // }, []);

    useEffect(() => {
        setCenter({
            lat: 7.131229,
            lng: 125.640110
        })
    }, [])

    const handleMarkerClick = (index: any) => {
        setClickMarker({ ...clickMarker, [index]: true });
        setSelectedMarker(index);
    };

    const handleInfoWindowClose = (index: any) => {
        setClickMarker({ ...clickMarker, [index]: false });
    };

    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <div style={{ height: '100%', width: '100%' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={11}
                >
                    {props.data.map((items: any, index: any) => {
                        return (
                            <MarkerF position={{ lat: parseFloat(items.lat), lng: parseFloat(items.lng) }}
                                icon={"http://maps.google.com/mapfiles/ms/icons/purple-dot.png"}
                                onClick={() => handleMarkerClick(index)}
                                key={index}
                            >
                                {clickMarker[index] && selectedMarker === index && (
                                    <InfoWindowF onCloseClick={() => handleInfoWindowClose(index)} position={location}>
                                        <div>
                                            <p>Name: {items.person.full_name}</p>
                                            <p>Lat: {items.lat}</p>
                                            <p>Lng: {items.lng}</p>
                                        </div>
                                    </InfoWindowF>
                                )}
                            </MarkerF>
                        )
                    })}
                </GoogleMap>
            </div>
        </LoadScript>
    );
};

export default GPSMap;
