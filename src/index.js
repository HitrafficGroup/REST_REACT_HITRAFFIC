import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {store} from './app/store'
import { Provider } from 'react-redux'

const theme = createTheme({
  palette: {
    verde2: {
      main: '#52BE80',
      contrastText: '#fff',
      dark: '#1E8449',
    },
    oscuro: {
      main: '#2E4053',
      contrastText: '#fff',
      darker: '#053e85',
    },
    anaranjado1:{
      main: '#EB984E',
      contrastText: '#fff',
      dark: '#CA6F1E',

    },
    morado1:{
      main: '#A569BD',
      contrastText: '#fff',
    },
    seleccion:{
      main:'#34495E ',
      contrastText: '#fff',
    },
    crema: {
      main: '#F0B27A',
      contrastText: '#fff',
    },
    advertencia: {
      main: '#F5B041',
      contrastText: '#fff',
    },
    rojo: {
      main: '#CD5C5C',
      contrastText: '#fff',
      dark: '#CB4335',

    },
    verde: {
      main: '#27AE60',
      contrastText: '#fff', 
      dark: '#0E6251',
    },
    destello: {
      main: '#85C1E9',
      contrastText: '#fff',
    },
    apagado: {
      main: '#212F3D',
      contrastText: '#fff',
    },
    azulm: {
      main: '#2471A3',
      contrastText: '#fff',
      dark: '#1A5276',
    },
    amarillo: {
      main: '#F5B041',
      contrastText: '#fff',
    },
    gris:{
      main: '#566573',
      contrastText: '#fff',
    }


  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
