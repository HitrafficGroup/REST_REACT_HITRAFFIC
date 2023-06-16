
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
import { getEntradasSW12,postEntradasSW12 } from '../js/apiFunctionsSW12';
import "../css/EntradasView.css";
import { useSelector} from 'react-redux';
import Swal from 'sweetalert2';
export default function EntradasView() {
    const controlerState = useSelector(state => state.controlers);
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
            setDeshabilitar2(true);
            let data = await getEntradasSW12(controlerState.ip);
            updateFirebase('entradas',data)
            console.log(data)
            setEnt1(data[0].check);
            setEnt2(data[1].check);
            setEnt3(data[2].check);
            setEnt4(data[3].check);
            setFase1(data[0].paso);
            setFase2(data[1].paso);
            setFase3(data[2].paso);
            setFase4(data[3].paso);
            setT1(data[0].duracion);
            setT2(data[1].duracion);
            setT3(data[2].duracion);
            setT4(data[3].duracion);
            setDeshabilitar2(false);
            setDeshabilitar(false);
    
    
    
            //console.log(informacion);
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
    const updateFirebase = async (param,__data) => {
        const ref = doc(db, "controladores", `${controlerState.id}`);
        let aux_data = {}
        aux_data[`${param}`] = __data
        await updateDoc(ref,aux_data);
    }
    const cargarDatosRest = async() =>{
        Swal.fire({
            title: 'Deseas Continuar ?',
            text: 'Estos Cambios se guardaran en el Controlador',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, actualizar!',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
        }).then(async(result) => {
            if (result.isConfirmed) {
                setDeshabilitar2(true)
                setDeshabilitar(true)
                let data_entradas = [0]
                //cargarEntradasFirebase(newEntradasFirebase);
                let check1 = ent1 ? '0010':'0000'
                let f1 = check1 + ("0000"+fase1.toString(2)).substr(-4) 
                let binary1 = parseInt(f1,2)-1
                data_entradas.push(binary1)
                data_entradas.push(t1)
                let check2 = ent2 ? '0010':'0000'
                let f2 = check2+("0000"+fase2.toString(2)).substr(-4)
                let binary2 = parseInt(f2,2)-1
                data_entradas.push(binary2)
                data_entradas.push(t2)
                let check3 = ent3 ? '0010':'0000'
                let f3 = check3+ ("0000"+fase3.toString(2)).substr(-4)
                let binary3 = parseInt(f3,2)-1
                data_entradas.push(binary3)
                data_entradas.push(t3)
                let check4 = ent4 ? '0010':'0000'
                let f4 = check4 + ("0000"+fase4.toString(2)).substr(-4)
                let binary4 = parseInt(f4,2)-1
                data_entradas.push(binary4)
                data_entradas.push(t4)
                console.log(data_entradas)
                await postEntradasSW12({trama:data_entradas,ip:controlerState.ip});
                setDeshabilitar(false);
                setDeshabilitar2(false);
               
            }
        })
      
    }
    
    return (
    <>
        <Container maxWidth="md">
            <div className='titulos-entradas'>
                <h4>Configuración de las Entradas Digitales</h4>
            </div>
            <Grid container spacing={3}>
                <Grid item md={3} xs={5}>
                    <FormControlLabel control={<Switch  value={ent1} checked={ent1} onChange={handleEnt1} disabled={deshabilitar} />} label="Entrada 1" />
                </Grid>
                <Grid item md={4.5} xs={7}>
                    <TextField
                        fullWidth
                        id="outlined-controlled"
                        label="Fase a Ejecutar"
                        type="number"
                        value={fase1}
                        onChange={(event)=>{setFase1(parseInt(event.target.value))}}
                        disabled={deshabilitar}
                        placeholder="1 al 16"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item md={4.5} xs={12}>
                    <TextField
                        fullWidth
                        id="outlined-controlled"
                        label="Tiempo de Espera"
                        type="number"
                        value={t1}
                        onChange={(event)=>{setT1(parseInt(event.target.value))}}
                        placeholder="1 al 255"
                        disabled={deshabilitar}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item md={3} xs={5}>
                    <FormControlLabel control={<Switch value={ent2} checked={ent2} onChange={handleEnt2} disabled={deshabilitar} />} label="Entrada 2" />
                </Grid>
                <Grid item md={4.5} xs={7}>
                    <TextField
                        fullWidth
                        id="outlined-controlled"
                        label="Fase a Ejecutar"
                        type="number"
                        disabled={deshabilitar}
                        value={fase2}
                        onChange={(event)=>{setFase2(parseInt(event.target.value))}}
                        placeholder="1 al 16"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item md={4.5} xs={12}>
                    <TextField
                        fullWidth
                        id="outlined-controlled"
                        label="Tiempo de Espera"
                        type="number"
                        disabled={deshabilitar}
                        value={t2}
                        onChange={(event)=>{setT2(parseInt(event.target.value))}}
                        placeholder="1 al 255"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item md={3} xs={5}>
                    <FormControlLabel control={<Switch value={ent3} checked={ent3} onChange={handleEnt3} disabled={deshabilitar} />} label="Entrada 3" />
                </Grid>
                <Grid item md={4.5} xs={7}>
                    <TextField
                        fullWidth
                        id="outlined-controlled"
                        label="Fase a Ejecutar"
                        type="number"
                        value={fase3}
                        disabled={deshabilitar}
                        onChange={(event)=>{setFase3(parseInt(event.target.value))}}
                        
                        placeholder="1 al 16"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item md={4.5} xs={12}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Tiempo de Espera"
                        type="number"
                        value={t3}
                        onChange={(event)=>{setT3(parseInt(event.target.value))}}
                        disabled={deshabilitar}
                        placeholder="1 al 255"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item md={3} xs={5}>
                    <FormControlLabel control={<Switch value={ent4} checked={ent4} onChange={handleEnt4} disabled={deshabilitar} />} label="Entrada 4" />
                </Grid>
                <Grid item md={4.5} xs={7}>
                    <TextField
                        fullWidth
                        id="outlined-controlled"
                        label="Fase a Ejecutar"
                        type="number"
                        value={fase4}
                        disabled={deshabilitar}
                        onChange={(event)=>{setFase4(parseInt(event.target.value))}}
                        placeholder="1 al 16"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item md={4.5} xs={12}>
                    <TextField
                        fullWidth
                        id="outlined-controlled"
                        label="Tiempo de Espera"
                        type="number"
                        value={t4}
                        onChange={(event)=>{setT4(parseInt(event.target.value))}}
                        disabled={deshabilitar}
                        placeholder="1 al 255"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                <Button variant="contained"  fullWidth color="verde2" disabled={deshabilitar2} onClick={traerEntradasFromRestApi} >Leer Datos</Button>
                </Grid>
                <Grid item md={6} xs={12}>
                <Button variant="contained"  fullWidth disabled={deshabilitar} onClick={cargarDatosRest} >Cargar Datos</Button>
                </Grid>
                        
            </Grid>
            <Grid item xs={6}>
                    <div style={{height:30}}>

                    </div>
                </Grid>
        </Container>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar2}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <CardController/>
    </>
    );
}
