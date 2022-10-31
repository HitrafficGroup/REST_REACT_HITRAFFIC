import React,{useState,useMemo,useCallback,useRef}  from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import '../css/HomeView.css'

export default function CustomMap(){
    const center = [-2.889889285482916, -78.96312349450281]
    const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState(center)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            setPosition(marker.getLatLng())
          }
        },
      }),
      [],
    )
    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d)
    }, [])
    const markerRef = useRef(null)
    const semaforo = new L.Icon({
      iconUrl: require('../assets/semaforo3.png'),
      iconRetinaUrl: require('../assets/semaforo3.png'),
      iconSize:     [50, 50], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] 

  });


  const DraggableMarker = () => {

   
  
    return (
      <Marker
        icon={semaforo}
        draggable={true}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}>
      
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {draggable
              ? 'Marker is draggable'
              : 'Click here to make marker draggable'}
          </span>
        </Popup>
      </Marker>
    )
  }
    return(
        <>
        
      <MapContainer center={position} zoom={19} scrollWheelZoom={false} className='map-container'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
         <DraggableMarker />
      </MapContainer>
        </>
    );
  
}