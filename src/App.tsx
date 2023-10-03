import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import FindUser from './pages/find_user';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import Base from './pages/base';
import Dashboard from './pages/dashboard';
import PersonDashboard from './pages/components/person'
import Login from './pages/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import GPSMap from './pages/map-v2';

function App() {

  const isAuthenticated = true;

  return (
    <div className="App">
      {/* <Base/> */}
      {/* <GPSMap /> */}
      {/* <Login/> */}
      <Router>
        <Switch>
          <Route path="/login" render={() => <Login />} />
          <Route path="/admin" render={() => isAuthenticated ? <Base /> : <Redirect to="/login" />} />
          <Route path="/user" render={() => isAuthenticated ? <GPSMap /> : <Redirect to="/login" />} />
          <Redirect from="/" to="/login" />
        </Switch>
      </Router>
      {/* <BrowserRouter>
        <Routes>
        <Route path="/" element={<Base />}/>
        <Route path='/find_patroller' element={<FindUser />} />
        <Route path='/person' element={<PersonDashboard />} />
        
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter> */}
      {/* <FindUser /> */}
      {/*// <GetMap  />*/}
    </div>
  );

}


export default App;
