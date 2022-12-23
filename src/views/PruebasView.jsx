import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
export default function PruebasView() {

    return (
        <>
            <Container maxWidth="md" >
                <h1>Definicion de las Entradas Digitales</h1>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button variant="contained">Leer Datos</Button>
                </Grid>
                </Grid>
            </Container>
        </>
    );

}