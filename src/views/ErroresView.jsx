import CardInformation from '../components/CardInformation';
import CardController from "../components/CardController";
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { DataGrid} from '@mui/x-data-grid';
import { useSelector} from 'react-redux';
import {getRegistrosControlador} from "../js/apiFunctions";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import GridOnIcon from '@mui/icons-material/GridOn';
import "../css/ErroresView.css";
const columns = [

    //{field:'id',headerName:'ID',width:90},
    {
        field: 'fecha',
        headerName: 'Tiempo Registrado',
        width: 400,
        editable: false,
    },
    {
        field: 'evento',
        headerName: 'Tipo de Eventos',
        width: 400,
        editable: false,
    },
];




export default function ErroresView() {
    const controlerState = useSelector(state => state.controlers);
    const [errores,setErrores] = useState(rows)
    const [deshabilitar,setDeshabilitar] = useState(true);
    const [deshabilitar2,setDeshabilitar2] = useState(false);

    const getDatosFromRestApi = async () =>{
        try {
            setDeshabilitar2(true);
            let data = await getRegistrosControlador(controlerState.mac,controlerState.ip,0)
            let tablaData = data[controlerState.mac].registro;
            let dataFormat = tablaData.map((data,index)=>{
                return {
                    id:index+1,
                    fecha:data.fecha,
                    evento: data.evento
                }
            })
            setErrores(dataFormat.reverse());
            setDeshabilitar(false)
            setDeshabilitar2(false)
        } catch (error) {
            setDeshabilitar2(false)
        }
       

    }
    
    return (
        <>
            <Container maxWidth="md" >
                <div className='titulos-errores'>
                    <h4>Tabla de Registro de Errores</h4>
                </div>
                <Grid container spacing={2}>
                <Grid item md={4} xs={12}>
                    <Button color="verde2" sx={{height:'100%'}} fullWidth variant="contained" onClick={getDatosFromRestApi}>Leer Datos</Button>
                </Grid>
             
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <div style={{ height: 400, width: '100%' }} className={deshabilitar? 'disabled-errores':'habilited-errores'}>
                            <DataGrid
                                rows={errores}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                checkboxSelection
                                disableSelectionOnClick
                                experimentalFeatures={{ newEditingApi: true }}
                            />
                        </div>
                    </Grid>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Button variant="contained"   sx={{height:'100%',bgcolor:'#CB4335'}} disabled={deshabilitar} fullWidth onClick={getDatosFromRestApi}  endIcon={<PictureAsPdfIcon />}>Generar PDF</Button>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Button variant="contained"  sx={{height:'100%',bgcolor:'#117A65'}} disabled={deshabilitar} fullWidth onClick={getDatosFromRestApi}  endIcon={<GridOnIcon />} >Generar Excel</Button>
                </Grid>

                </Grid>
                <div style={{height:15}}>

                </div>
            </Container>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar2}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <CardController/>
        <CardInformation/>
        </>
    );

}


const rows = [

];