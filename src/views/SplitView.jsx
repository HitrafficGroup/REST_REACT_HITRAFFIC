import React from "react";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import Button from '@mui/material/Button';
import { getSplitHT200 } from "../js/apiFunctionsHT200";
export default function SplitView(){


    const readData = async () => {
        let data = await getSplitHT200("23:45:15:56", "192.168.1.122");
        console.log(data)
    }


    return(
    <>
    <Container maxWidth="md">
    <h1>Vista Split</h1>
        <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                    <Button variant="contained" color='verde2'  sx={{ height: '100%' }} onClick={readData}  >Leer Datos</Button>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Button variant="contained" sx={{ height: '100%' }} color='oscuro' >Cargar Datos</Button>
                </Grid>
        </Grid>
    </Container>
    
    </>
    );
}