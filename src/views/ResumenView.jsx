import CardInformation from '../components/CardInformation';
import CardController from "../components/CardController";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import "../css/ResumenView.css";
import CalendarSemaforo from '../components/CalendarSemaforo';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import {getAllDataIp} from "../js/apiFunctions";
import { useSelector } from 'react-redux';
export default function ResumenView() {
    const controlerState = useSelector(state => state.controlers);
    const getDataFromRestApi = async() =>{
        const mac  =  controlerState.mac;
        const ip = controlerState.ip;
        let data = await getAllDataIp(mac,ip);
        console.log(data);
    } 
    return (
        <>
            <Container maxWidth="md" >
                <div className='titulos-resumen'>
                    <h4>Resumen del Controlador</h4>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CalendarSemaforo />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" onClick={getDataFromRestApi} startIcon={<DeleteIcon />}>
                            LEER DATOS
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </>
    );

}