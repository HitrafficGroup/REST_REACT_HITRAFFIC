import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import CardController from '../components/CardController';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {getEntradasControlador} from "../js/apiFunctions";
import { useSelector} from 'react-redux';

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
        const mac = controlerState.mac;
        setDeshabilitar2(true);
        let data = await getEntradasControlador(controlerState.mac,controlerState.ip);
        let informacion = data[`${mac}`];
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
    return (
    <>
        <Container maxWidth="md">
            <h3>Configuracion de las Entradas Digitales</h3>
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
                <Button variant="contained"  disabled={deshabilitar} >Cargar Datos</Button>
                </Grid>
    
            </Grid>
        </Container>
        <div className='horarios-card'>
                <CardController />
            </div>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar2}>
            <CircularProgress color="inherit" />
        </Backdrop>
    </>
    );
}

const initialData = {
entrada1: {checkbox: '0', fase: '0', tiempo: '0'},
entrada2: {checkbox: '0', fase: '0', tiempo: '0'},
entrada3: {checkbox: '0', fase: '0', tiempo: '0'},
entrada4: {checkbox: '0', fase: '0', tiempo: '0'}
}