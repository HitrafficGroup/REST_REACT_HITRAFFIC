import CardInformation from '../components/CardInformation';
import CardController from "../components/CardController";
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import { db } from "../firebase/firebase-config";
import { updateDoc, doc } from "firebase/firestore";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {getEntradasControlador,setEntradasControlador} from "../js/apiFunctions";
import "../css/EntradasView.css";
import { useSelector} from 'react-redux';
import Swal from 'sweetalert2';
export default function EntradasView() {
    const controlerState = useSelector(state => state.controlers);
    const [entradas,setEntradas] = useState(initialData);
    const [ent1,setEnt1] = useState(false);
    const [ent2,setEnt2] = useState(false);
    const [ent3,setEnt3] = useState(false);
    const [ent4,setEnt4] = useState(false);
    const [fase1,setFase1] = useState(0);
    const [fase2,setFase2] = useState(0);
    const [fase3,setFase3] = useState(0);
    const [fase4,setFase4] = useState(0);
    const [t1,setT1] = useState(0);
    const [t2,setT2] = useState(0);
    const [t3,setT3] = useState(0);
    const [t4,setT4] = useState(0);
    const [deshabilitar,setDeshabilitar] = useState(true);
    const [deshabilitar2,setDeshabilitar2] = useState(false);
    const traerEntradasFromRestApi = async() =>{
        try {
            const mac = controlerState.mac;
            setDeshabilitar2(true);
            let data = await getEntradasControlador(controlerState.mac,controlerState.ip);
            let informacion = data[`${mac}`];
            console.log(informacion);
            setEntradas(informacion);
            if(informacion.entrada1.checkbox ==='1'){
                setEnt1(true);
            }else{
                setEnt1(false);
            }
            if(informacion.entrada2.checkbox ==='1'){
                setEnt2(true);
            }else{
                setEnt2(false);
            }
            if(informacion.entrada3.checkbox ==='1'){
                setEnt3(true);
            }else{
                setEnt3(false);
            }
            if(informacion.entrada4.checkbox === '1'){
                setEnt4(true);
            }else{
                setEnt4(false);
            }
            setFase1(parseInt(informacion.entrada1.fase));
            setFase2(parseInt(informacion.entrada2.fase));
            setFase3(parseInt(informacion.entrada3.fase));
            setFase4(parseInt(informacion.entrada4.fase));
    
            setT1(parseInt(informacion.entrada1.tiempo));
            setT2(parseInt(informacion.entrada2.tiempo));
            setT3(parseInt(informacion.entrada3.tiempo));
            setT4(parseInt(informacion.entrada4.tiempo));
    
            setDeshabilitar2(false);
            setDeshabilitar(false);
    
    
    
            console.log(informacion);
        } catch (error) {
            setDeshabilitar2(false);
        }
    }

    const handleEnt1 = (event) =>{
        setEnt1(event.target.checked);
    }
    const handleEnt2 = (event) =>{
        setEnt2(event.target.checked);
    }
    const handleEnt3 = (event) =>{
        setEnt3(event.target.checked);
    }
    const handleEnt4 = (event) =>{
        setEnt4(event.target.checked);
    }
    const cargarDatosRest =() =>{
        Swal.fire({
            title: 'Deseas Continuar ?',
            text: 'Estos Cambios se guardaran en el Controlador',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, actualizar!',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                setDeshabilitar2(true)
                setDeshabilitar(true)
                let newObject = {
                    tiempo1:t1.toString(),
                    tiempo2:t2.toString(),
                    tiempo3:t3.toString(),
                    tiempo4:t4.toString(),
                    fase1:fase1.toString(),
                    fase2:fase2.toString(),
                    fase3:fase3.toString(),
                    fase4:fase4.toString(),
                    box1:ent1 ? '1':'0',
                    box2:ent2 ? '1':'0',
                    box3:ent3 ? '1':'0',
                    box4:ent4 ? '1':'0',
                    ip:controlerState.ip,
                    mac:controlerState.mac
                }
                let newEntradasFirebase = {
                    entrada1:{checkbox: ent1, fase: fase1.toString(), tiempo: t1.toString()},
                    entrada2:{checkbox: ent2, fase: fase2.toString(), tiempo: t2.toString()},
                    entrada3:{checkbox: ent3, fase: fase3.toString(), tiempo: t3.toString()},
                    entrada4:{checkbox: ent4, fase: fase4.toString(), tiempo: t4.toString()},

                }
                cargarEntradasFirebase(newEntradasFirebase);
                cargarDatosEnetradasRest(newObject);
                console.log(newObject)
               
            }
        })
      
    }
    const cargarEntradasFirebase = async(data)=>{
        const ref = doc(db, "controladores", `${controlerState.mac}`);
        await updateDoc(ref,{
            entradas:data
        });
    }

    const cargarDatosEnetradasRest = async(data) =>{
        await setEntradasControlador(data);
        setDeshabilitar(false);
        setDeshabilitar2(false);
    }
    return (
    <>
        <Container maxWidth="md">
            <div className='titulos-entradas'>
                <h4>Configuración de las Entradas Digitales</h4>
            </div>
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <FormControlLabel control={<Switch  value={ent1} checked={ent1} onChange={handleEnt1} disabled={deshabilitar} />} label="Entrada 1" />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Fase a Ejecutar"
                        type="number"
                        value={fase1}
                        onChange={(event,value)=>{setFase1(value)}}
                        disabled={deshabilitar}
                        placeholder="1 al 16"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Tiempo de Espera"
                        type="number"
                        value={t1}
                        onChange={(event,value)=>{setT1(value)}}
                        placeholder="1 al 255"
                        disabled={deshabilitar}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel control={<Switch value={ent2} checked={ent2} onChange={handleEnt2} disabled={deshabilitar} />} label="Entrada 2" />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Fase a Ejecutar"
                        type="number"
                        disabled={deshabilitar}
                        value={fase2}
                        onChange={(event,value)=>{setFase2(value)}}
                        placeholder="1 al 16"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Tiempo de Espera"
                        type="number"
                        disabled={deshabilitar}
                        value={t2}
                        onChange={(event,value)=>{setT2(value)}}
                        placeholder="1 al 255"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel control={<Switch value={ent3} checked={ent3} onChange={handleEnt3} disabled={deshabilitar} />} label="Entrada 3" />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Fase a Ejecutar"
                        type="number"
                        value={fase3}
                        disabled={deshabilitar}
                        onChange={(event,value)=>{setFase3(value)}}
                        
                        placeholder="1 al 16"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Tiempo de Espera"
                        type="number"
                        value={t3}
                        onChange={(event,value)=>{setT3(value)}}
                        disabled={deshabilitar}
                        placeholder="1 al 255"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel control={<Switch value={ent4} checked={ent4} onChange={handleEnt4} disabled={deshabilitar} />} label="Entrada 4" />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Fase a Ejecutar"
                        type="number"
                        value={fase4}
                        disabled={deshabilitar}
                        onChange={(event,value)=>{setFase4(value)}}
                        placeholder="1 al 16"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Tiempo de Espera"
                        type="number"
                        value={t4}
                        onChange={(event,value)=>{setT4(value)}}
                        disabled={deshabilitar}
                        placeholder="1 al 255"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                <Button variant="contained" color="verde2" disabled={deshabilitar2} onClick={traerEntradasFromRestApi} >Leer Datos</Button>
                </Grid>
                <Grid item xs={6}>
                <Button variant="contained"  disabled={deshabilitar} onClick={cargarDatosRest} >Cargar Datos</Button>
                </Grid>
    
            </Grid>
        </Container>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar2}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <CardController/>
        <CardInformation/>
    </>
    );
}

const initialData = {
entrada1: {checkbox: '0', fase: '0', tiempo: '0'},
entrada2: {checkbox: '0', fase: '0', tiempo: '0'},
entrada3: {checkbox: '0', fase: '0', tiempo: '0'},
entrada4: {checkbox: '0', fase: '0', tiempo: '0'}
}
//me asusta tu manera tan maquiavelica de pensar jajaja 
//hasta planificas posibles escenarios y como deberia sacarme la vuelta jajaja
// parece que te e ense;ado bien jajajaj chndo 