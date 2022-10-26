import React,{}  from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import 'leaflet/dist/leaflet.css';
import '../css/HomeView.css'
// import semaforo from '../assets/semaforo.png'
// import { Icon } from "leaflet";
export default function CustomMap(){
    const position = [-2.889889285482916, -78.96312349450281]
    // var greenIcon = Icon({
    //     iconUrl: '../assets/semaforo.png',
    //     shadowUrl: '../assets/semaforo.png',
    
    //     iconSize:     [38, 95], // size of the icon
    //     shadowSize:   [50, 64], // size of the shadow
    //     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    //     shadowAnchor: [4, 62],  // the same for the shadow
    //     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    // });

    return(
        <>
        
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} className='map-container'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} >
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>,
        </>
    );
  
}