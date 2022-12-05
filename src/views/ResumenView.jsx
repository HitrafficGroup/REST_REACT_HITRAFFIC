import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import "../css/ResumenView.css";
import CalendarSemaforo from '../components/CalendarSemaforo';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import {getResumenControlador} from "../js/apiFunctions";
import { useSelector } from 'react-redux';
export default function ResumenView() {
    const getDataFromRestApi = async() =>{
        let data = await getResumenControlador();
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
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </>
    );

}