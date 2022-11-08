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
      // This is green.A700 as hex.
      main: '#52BE80',
      contrastText: '#fff',
      darker: '#053e85',
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
      main: '#E74C3C ',
      contrastText: '#fff',

    },
    verde: {
      main: '#27AE60',
      contrastText: '#fff',
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
