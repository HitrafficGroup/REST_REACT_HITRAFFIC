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