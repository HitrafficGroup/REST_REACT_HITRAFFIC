import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import Button from '@mui/material/Button';

const theme = createTheme({
  palette: {
    verde: {
      // This is green.A700 as hex.
      main: '#52BE80',
      contrastText: '#fff',
      darker: '#053e85',
    },
    crema:{
      main: '#F0B27A',
      contrastText: '#fff',
    },
    advertencia:{
      main: '#F5B041',
      contrastText: '#fff',
    }
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider theme={theme}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
