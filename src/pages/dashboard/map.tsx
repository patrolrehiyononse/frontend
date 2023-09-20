import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { MarkerF, InfoWindowF } from '@react-google-maps/api'

const API_KEY = 'AIzaSyDg1RaeqcvZ61vW-JZLLzW3rRxgCDuFpRg';
const REFRESH_INTERVAL = 2000; // 1 minute

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: 0,
    lng: 0,
};

const Map = (props: any) => {
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [center, setCenter] = useState({ lat: 0, lng: 0 })

    const [clickMarker, setClickMarker] = useState<any>({});
    const [selectedMarker, setSelectedMarker] = useState<any>();

    const [data, setData] = useState<any>([]);
    const [token, setToken] = useState<any>('');

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
        const access_token = localStorage.getItem("access_token");
        const getData = async () => {
            try {
                const response = await axios.get('/api/dashboard/', {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
                setData(response.data)
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        getData();
        const intervalId = setInterval(() => {

            getData();
        }, REFRESH_INTERVAL);

        setCenter({
            lat: 7.131229,
            lng: 125.640110
        })

        return () => {
            clearInterval(intervalId);
        };

    }, [])

    const handleMarkerClick = (index: any) => {
        setClickMarker({ ...clickMarker, [index]: true });
        setSelectedMarker(index);
    };

    const handleInfoWindowClose = (index: any) => {
        setClickMarker({ ...clickMarker, [index]: false });
    };

    console.log(data)

    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <div style={{ height: '100%', width: '100%' }}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={15}
                >
                    {data.map((items: any, index: any) => {
                        return (
                            <MarkerF position={{ lat: parseFloat(items.lat), lng: parseFloat(items.lng) }}
                                icon={"http://maps.google.com/mapfiles/ms/icons/purple-dot.png"}
                                onClick={() => handleMarkerClick(index)}
                                key={index}
                            >
                                {clickMarker[index] && selectedMarker === index && (
                                    <InfoWindowF onCloseClick={() => handleInfoWindowClose(index)} position={location}>
                                        <div>
                                            <p>{items.person.rank.rank_code} {items.person.full_name}</p>
                                            <p>Lat: {items.lat}</p>
                                            <p>Lng: {items.lng}</p>
                                            {/* <p>Date time: {moment(row.datetime).format("MMMM Do YYYY, h:mm:ss a")}</p> */}
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

export default Map;
