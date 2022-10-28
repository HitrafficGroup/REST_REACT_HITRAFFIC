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

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


export default function EntradasView() {
    return (<>
        <Container maxWidth="md">
            <h1>Definicion de las Entradas Digitales</h1>
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Entrada 1" />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Fase a Ejecutar"
                        type="number"
                        placeholder="1 al 16"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Tiempo de Espera"
                        type="number"
                        placeholder="1 al 255"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Entrada 2" />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Fase a Ejecutar"
                        type="number"
                        placeholder="1 al 16"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Tiempo de Espera"
                        type="number"
                        placeholder="1 al 255"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Entrada 3" />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Fase a Ejecutar"
                        type="number"
                        placeholder="1 al 16"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Tiempo de Espera"
                        type="number"
                        placeholder="1 al 255"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Entrada 4" />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Fase a Ejecutar"
                        type="number"
                        placeholder="1 al 16"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={4.5}>
                    <TextField
                        fullWidth
                        id="outlined-number"
                        label="Tiempo de Espera"
                        type="number"
                        placeholder="1 al 255"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                <Button variant="contained">Leer Datos</Button>
                </Grid>
                <Grid item xs={6}>
                <Button variant="contained">Cargar Datos</Button>
                </Grid>
    
            </Grid>
        </Container>

    </>);
}