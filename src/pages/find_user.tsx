import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { GetMap } from './map';

const useStyles = makeStyles(() => ({
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
}));

function FindUser() {
    const [lat, setLat] = useState<any>();
    const [lng, setLng] = useState<any>();

    const classes = useStyles();

    const addTransact = () => {
        
    }

    const find = () => {
        const error = (err: any) => {
            if (err) {
                console.log("asd");
            }
        };

        navigator.geolocation.getCurrentPosition(function (position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
        }, error);
    };

    return (
        <div className={classes.buttonContainer}>
            <Button variant="contained" color="primary" onClick={find}>
                Click Me
            </Button>
            {
                (lat && lng) && <GetMap lat={lat} lng={lng} />
            }
        </div>
    );
}

export default FindUser;
