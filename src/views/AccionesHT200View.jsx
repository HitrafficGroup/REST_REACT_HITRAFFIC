
import React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from '@mui/material/Button';


export default function AccionesHT200View(){


    return(
        <>
            <Container maxWidth="md">
                <h1>Acciones View</h1>
                <Grid container spacing={2}>
                <Grid item md={3} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} fullWidth >Leer Datos</Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" sx={{ height: '100%' }} color='oscuro' fullWidth >Cargar Datos</Button>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}