import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Container,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useForm } from 'react-hook-form';

import { Switch, useLocation, useHistory } from 'react-router-dom';

import img from '../assets/viber_image_2023-09-11_18-36-47-771.jpg';
import logo from '../assets/viber_image_2023-09-11_18-36-46-801.png';
import app from '../http_settings';
import CodeInputDialog from './components/login_components/email_verification';


type FormValues = {
  email: string,
  password: string,
}

const Login: React.FC = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const history = useHistory();
  const [showCodeDialog, setShowCodeDialog] = useState<boolean>(false);
  const [text, setText] = useState();


  const form = useForm<FormValues>();

  const { register, handleSubmit, formState } = form;

  const { errors } = formState;

  const onSubmit =  (data: FormValues) => {
    // Handle login logic here
     app.post('/api/login/', { email: data.email, password: data.password }).then((res: any) => {
      
      localStorage.setItem("access_token", res.data.access_token)
      localStorage.setItem("refresh_token", res.data.refresh_token)
      localStorage.setItem("unit", res.data.unit)
      if (res.data.role === "user") {
        history.push('/user')
      } else if (res.data.role === "admin") {
        history.push('/admin/dashboard')
        // setShowCodeDialog(true)
      }
    })
    localStorage.setItem("email", data.email);
  };

  return (
    <div
      style={{
        background:
          `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${img})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={logo} style={{ width: "100px" }} />

          <strong style={{ fontSize: "20px" }}>Patrol Rehiyon Onse GPS Web Application</strong>
          <br />
          <br />
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  type='email'
                  {...register("email", {
                    required: "Email is Required"
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  {...register("password", {
                    required: "Password is Required"
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Login
                </Button>

                {
                  text ? text : null
                }
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
      {
        showCodeDialog &&
        <CodeInputDialog
          open={showCodeDialog}
          onClose={() => setShowCodeDialog(false)}
        />
      }
    </div>
  );
};

export default Login;
