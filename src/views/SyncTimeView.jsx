import { React, useEffect, useState } from "react"
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';



export default function SyncTimeView() {

    const [tiempoActual, setTiempoActual] = useState(new Date().toTimeString())
    const [fechaActual, setFechaActual] = useState(new Date().toDateString())

    const horaActual = () => {
        let tiempo = new Date().toTimeString();
        let fecha = new Date().toDateString();
        setFechaActual(fecha);
        setTiempoActual(tiempo);
    }

    useEffect(() => {
        setInterval(() => {
            horaActual();
        }, 1000);
    }, [])

    return (<>
        <Container maxWidth="md">
            <h1>Sincronizar Hora y Fecha </h1>

            <Grid container spacing={2}>
                <Grid xs={12}>
                    <h3>Hora Actual:</h3> <p>{fechaActual}-{tiempoActual}</p>
                </Grid>
                <Grid xs={12}>
                    <h3>Hora del Controlador:</h3> <p>{fechaActual}-{tiempoActual}</p>
                </Grid>
                <Grid xs={6}>
                    <h4>Funciones del Controlador:</h4>
                </Grid>
                <Grid xs={3}>
                    <Button variant="contained" color="verde">
                        Obtener Tiempo
                    </Button>
                </Grid>
                <Grid xs={3}>
                    <Button variant="contained" color="verde">
                        Actualizar Tiempo
                    </Button>
                </Grid>
            </Grid>
        </Container>
    </>);
}