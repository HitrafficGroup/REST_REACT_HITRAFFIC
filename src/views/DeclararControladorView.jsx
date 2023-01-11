import React, { useState, useEffect, useRef } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
export default function DeclararControladorView() {
    const controlerState = useSelector(state => state.controlers)
    const [grupo,setGrupo] = useState("");
    const [nombreSemaforo,setNombreSemaforo] = useState("");
    const [nombreControlador,setNombreControlador]  = useState("");
    const declararControlador =()=>{
        Swal.fire({
            title: 'Creacion de controlador',
            text: "Se va a crear el siguiente controlador",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Completado',
                'Controlador Agregado Con Exito ! ',
                'success'
              )
            }
          })
        }
        // const DraggableMarker = () => {
        //     return (
        //         <Marker
        //             icon={ubi}
        //             draggable={!flagsimu}
        //             eventHandlers={eventHandlers}
        //             position={position}
        //             ref={markerRef}>
    
        //             <Popup minWidth={90}>
        //                 <span onClick={toggleDraggable}>
        //                     {draggable ? 'Marker is draggable': 'Click here to make marker draggable'}
        //                 </span>
        //             </Popup>
        //         </Marker>
        //     )
        // }
    return (
        <>
            <Container maxWidth="md" >
                <div style={{marginBottom:10,marginTop:20}}>
                    <h4>Formulario de Declaracion de Nuevo Controlador</h4>
                    <p>
                        Llene el siguiente formulario para declarar el nuevo controlador dentro de la base de datos, los datos a
                        rellenar son los de nombre , latitud y longitud.
                    </p>
                </div>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={4}>
                        <TextField id="outlined" value={controlerState.nuevo_controlador.ip}  fullWidth focused  label="Ip:" variant="outlined" aria-readonly={true}  />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField id="outlined" value={controlerState.nuevo_controlador.mac} fullWidth focused  label="Mac" variant="outlined" aria-readonly={true}  />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField id="outlined"   label="Nombre del Controlador" variant="outlined"  fullWidth   />
                    </Grid>
                    <Grid item xs={12} md={4.5}>
                        <TextField id="outlined"   label="Latitud" variant="outlined"  fullWidth />
                    </Grid>
                    <Grid item xs={12} md={4.5}>
                        <TextField id="outlined"   label="Longitud" variant="outlined"  fullWidth />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button variant="contained" startIcon={<LocationOnIcon/>} color="morado1" fullWidth sx={{ height: "100%" }}>GeoLocalizar</Button>
                    </Grid>
                    <Grid item xs={12} md={12}>
                    
                            <MapContainer center={[controlerState.latitud,controlerState.longitud]} zoom={19}   scrollWheelZoom={false} className='map-container'>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            </MapContainer>

                    </Grid>
                    <Grid item xs={12} md={12}>
                        <div>
                            <p>
                                <strong style={{marginLeft:5,marginRight:5}}>Longitud del semaforo:</strong>-2.1231231231234532 <strong style={{marginLeft:5,marginRight:5}}>Latitud del semaforo:</strong>-2.1231231231234532
                            </p>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4.5}>
                        <TextField id="outlined" value={nombreSemaforo} onChange={(e)=>{setNombreSemaforo(e.target.value)}} label="Nombre del semaforo" variant="outlined"  fullWidth />
                    </Grid>
                    <Grid item xs={12} md={4.5}>
                        <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Grupos</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Grupos"
                                    name='grupo'
                                    value={grupo}
                                    onChange={(event,newValue)=>{setGrupo(event.target.value)}}
                                >
                                    <MenuItem value={''}>None</MenuItem>
                                    <MenuItem value={'g1'}>Grupo 1</MenuItem>
                                    <MenuItem value={'g2'}>Grupo 2</MenuItem>
                                    <MenuItem value={'g3'}>Grupo 3</MenuItem>
                                    <MenuItem value={'g4'}>Grupo 4</MenuItem>
                                </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button variant="contained" startIcon={<AddIcon/>} color="primary" fullWidth sx={{ height: "100%" }}>AGREGAR</Button>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <div>
                            <p><strong>Semaforos Declarados:</strong></p>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={12}>
                    <div style={{display:"flex",justifyContent:"center"}}>
                            <Button sx={{height:60}} variant="outlined">CREAR CONTROLADOR</Button>
                        </div>
                    </Grid>
                </Grid>
                <div style={{height:100}}>

                </div>
            </Container>
        </>
    );

}