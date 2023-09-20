import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

const ClockDashboard: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" component="div">
        {formatTime(time)}
      </Typography>
      <div style={{ width: '182px', height: '182px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Clock value={time} size={180} renderNumbers={true} />
      </div>
    </div>
  );
};

export default ClockDashboard;
