import { React, useEffect, useState } from "react"
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import RelogActual from "../components/RelogActual";
import Swal from 'sweetalert2';
import {getTimeControlador,setTimeControlador} from '../js/apiFunctions'
import { useSelector, useDispatch } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CardController from '../components/CardController';
export default function SyncTimeView() {
    const [tiempoController,setTiempoController] = useState(InitialTime)
    const [fechaController,setFechaController] = useState('Datos de fecha aun no Cargados')
    const [fechaActual,setFechaActual] = useState(new Date().toLocaleString("es-EC", { dateStyle: 'full' }))
    
    const controlerState = useSelector(state => state.controlers)
    const [deshabilitar,setDeshabilitar]= useState(true);
    const [deshabilitar2,setDeshabilitar2] = useState(false);
    const obtenerTiempoFromRestApi = async() =>{
        try{
            setDeshabilitar2(true);
            const response = await getTimeControlador(controlerState.mac,controlerState.ip)
            setTiempoController(response[controlerState.mac])
            const temp = response[controlerState.mac]
            const fechac = `${temp.mes}-${temp.dia}-${temp.year}`
            const dateObj = new Date(fechac)
            const formatDate = dateObj.toLocaleString("es-EC", { dateStyle: 'full' });
            setFechaController(formatDate);
            setDeshabilitar(false);
            setDeshabilitar2(false);
        }catch(e){
            console.log(e)
        }

    }
    const sincronizarTiempoFromRest = async() =>{
        const newData = {
            ip:controlerState.ip,
            mac:controlerState.mac,
            time_zone:"-5"
        }
        try{
            
            Swal.fire({
                title: 'Deseas Continuar ?',
                text:  'Estos Cambios se guardaran en el Controlador',
                icon:  'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Si, actualizar!',
                showDenyButton: true,
                denyButtonText: 'Cancelar',
            }).then((result)=>{
                if(result.isConfirmed){
                    setTimeControlador(newData);
                    Swal.fire({
                        title: "Completado!",
                        text: "Cambios Cargados Con Exito",
                        icon: "success",
                      });
                 
                }
            })        
    

        }catch(e){

        }
    }
    return (<>
        <Container maxWidth="md">
            <h3>Sincronizar Hora y Fecha  Del Controlador </h3>
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <h4>Datos del Computador</h4>
                </Grid>
                <Grid xs={6}>
                    <h5>Hora Actual</h5> 
                    <RelogActual/>
                </Grid>
                <Grid xs={6}>
                    <h5>Fecha Actual</h5> 
                    {fechaActual.toUpperCase()}
                </Grid>
                <Grid xs={12}>
                    <h4>Datos del Controlador</h4>
                </Grid>
                <Grid xs={6}>
                    <h5>Hora del Controlador</h5> 
                    <p>{tiempoController.horas+':'+tiempoController.minutos+':'+tiempoController.segundos}</p>
                </Grid>
                <Grid xs={6}>
                    <h5>Fecha del Controlador</h5> 
                    {fechaController.toUpperCase()}
                </Grid>
                <Grid xs={12}>
                    <h4>Funciones del Controlador</h4>
                </Grid>
                <Grid xs={3}>
                    <Button variant="contained" onClick={obtenerTiempoFromRestApi}  disabled={deshabilitar2} color="verde" sx={{height:'100%'}}>
                     LEER DATOS
                    </Button>
                </Grid>
                <Grid xs={3}>
                    <Button variant="contained" onClick={sincronizarTiempoFromRest} disabled={deshabilitar} sx={{height:'100%'}}>
                        Actualizar DATOS
                    </Button>
                </Grid>
            </Grid>
        </Container>
        <div className='horarios-card'>
                <CardController />
            </div>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar2}>
            <CircularProgress color="inherit" />
        </Backdrop>
    </>);
}
const InitialTime = {
    dia:"00",
    horas: "00",
    indice_dia:"00",
    mes:"00",
    minutos: "00",
    segundos:"00",
    time_zone:"00",
    year: "00"
}


const initialFecha = {
    dia: "-------",
    mes: "---------",
    dianum: "--",
    year: "----"
}