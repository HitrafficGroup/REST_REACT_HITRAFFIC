import React, { useState } from 'react';
import Select from '@mui/material/Select';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Switch from '@mui/material/Switch';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'time',
        headerName: 'Tiempo Registrado',
        width: 400,
        editable: false,
    },
    {
        field: 'tipo',
        headerName: 'Tipo de Eventos',
        width: 400,
        editable: false,
    },
];

const rows = [
    { id: 1, time: '2022/10/28 10:55:12 Viernes', tipo: 'Encendido de Controlador' },
    { id: 2, time: '2022/10/27 08:01:57 Jueves', tipo: 'Encendido de Controlador' },
    { id: 3, time: '2022/10/26 08:00:34 Miercoles', tipo: 'Encendido de Controlador' },
    { id: 4, time: '2022/10/25 08:05:06 Martes', tipo: 'Encendido de Controlador' },
    { id: 5, time: '2022/10/25 08:05:05 Martes', tipo: 'Encendido de Controlador' },
    { id: 6, time: '2022/10/24 16:23:01 Lunes', tipo: 'Encendido de Controlador' },
    { id: 7, time: '2022/10/24 16:23:01 Lunes', tipo: 'Encendido de Controlador' },
];
export default function ErroresView() {

    return (
        <>
            <Container maxWidth="md" >
                <h1>Definicion de las Entradas Digitales</h1>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Button variant="contained">Leer Datos</Button>
                </Grid>
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={rows}
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
                <Grid item xs={12}>
                    <Button variant="contained">Borrar Datos</Button>
                </Grid>
                </Grid>
            </Container>
        </>
    );

}