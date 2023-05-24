import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from '@mui/material/Button';
import { getPatternHT200,PostPatternHT200 } from "../js/apiFunctionsHT200";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
export default function PatternHT200View() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data,setData] = useState([{number:0,cycletime:0,offsettime:0,sequencenumber:0,splitnumber:0,workmode:0}])
    const [modalConfig,setModalConfig] = useState(false);
    const [currentPattern,setCurrentPattern] = useState({number:0,cycletime:0,offsettime:0,sequencenumber:0,splitnumber:0,workmode:0});
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const handleChange = (event) => {
        setCurrentPattern({
            ...currentPattern,
            [event.target.name]: event.target.value,
        });

    };
    const readData = async () => {
        let data = await getPatternHT200("23:45:15:56", "192.168.1.122");
        console.log(data)
            for (let j = 0; j < 16; j++) {

                let target = data[j].workmode
                if (target === 1) {
                    data[j].workmode = "Fixed Time"
                } else if (target === 2) {
                    data[j].workmode = "Green Wave"
                } else if (target === 3) {
                    data[j].workmode = "Sense Control"
                } else if (target === 4) {
                    data[j].workmode = "Flash Control"
                } else if (target === 5) {
                    data[j].workmode = "All red Control"
                } else if (target === 6) {
                    data[j].workmode = "Lamp Off Control"
                } else {
                    data[j].workmode = "Ninguno"
                }

            }
        

        setData(data)

    }

    const  modificarPatron = (__data)=>{
        setModalConfig(true);
        setCurrentPattern(__data);
        console.log(__data)
    }

    const aplicarCambios = ()=>{
   
        let aux_pattern = JSON.parse(JSON.stringify(currentPattern))
        let aux_data = JSON.parse(JSON.stringify(data))
        aux_pattern.offsettime = parseInt(aux_pattern.offsettime)
        aux_pattern.sequencenumber = parseInt(aux_pattern.sequencenumber)
        let  modify_data =   aux_data.map((item)=>{
            if(aux_pattern.number === item.number){
                return aux_pattern;
            }else{
                return item
            }
        })
       setData(modify_data)
       setModalConfig(false)
    }
    const uploadData = async() =>{
        let array_data = []
        let aux_data = JSON.parse(JSON.stringify(data))
        for (let j = 0; j < 16; j++) {

            let target = aux_data[j].workmode
            if (target === "Fixed Time") {
                aux_data[j].workmode = 1
            } else if (target === "Green Wave") {
                aux_data[j].workmode = 2
            } else if (target === "Sense Control") {
                aux_data[j].workmode = 3
            } else if (target === "Flash Control") {
                aux_data[j].workmode = 4
            } else if (target === "All red Control") {
                aux_data[j].workmode = 5
            } else if (target === "Lamp Off Control") {
                aux_data[j].workmode = 6
            } else {
                aux_data[j].workmode = 0
            }

        }

        for(let i = 0;i<100;i++){
            if(i <16){
                array_data.push(aux_data[i].number)
                array_data.push(aux_data[i].cycletime & 0xff)
                array_data.push(aux_data[i].cycletime >> 8)
                array_data.push(aux_data[i].offsettime)
                array_data.push(aux_data[i].splitnumber)
                array_data.push(aux_data[i].sequencenumber)
                array_data.push(aux_data[i].workmode)
            }else{
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
            }
        }
        await PostPatternHT200({trama:array_data,mac:"12:32:12:23"})
    }

    return (
        <>

            <Container maxWidth="md">
                <h1>Vista Pattern</h1>
                <Grid container spacing={2}>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} fullWidth onClick={readData}>Leer Datos</Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" sx={{ height: '100%' }} color='oscuro' fullWidth onClick={uploadData} >Cargar Datos</Button>
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                         <TableCell
                                                key={"Acciones"}
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Acciones
                                            </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row,index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                         <TableCell key={index} align={"center"}>
                                                         <IconButton color="oscuro" aria-label="add an alarm" onClick={()=>{modificarPatron(row)}} >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton color="rojo" aria-label="add an alarm" >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                            </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>
                </Grid>
            </Container>


            <Modal isOpen={modalConfig} >
                <ModalHeader>
                    <div>
                        <h1>
                            Editar
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>

                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Split</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentPattern.splitnumber}
                                    label="Split"
                                    name="splitnumber"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>ciclo 1</MenuItem>
                                    <MenuItem value={2}>ciclo 2</MenuItem>
                                    <MenuItem value={3}>ciclo 3</MenuItem>
                                    <MenuItem value={4}>ciclo 4</MenuItem>
                                    <MenuItem value={5}>ciclo 5</MenuItem>
                                    <MenuItem value={6}>ciclo 6</MenuItem>
                                    <MenuItem value={7}>ciclo 7</MenuItem>
                                    <MenuItem value={8}>ciclo 8</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Modo de Trabajo</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentPattern.workmode}
                                    label="Modo de Trabajo"
                                    name="workmode"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"Fixed Time"}>Fixed Time</MenuItem>
                                    <MenuItem value={"Green Wave"}>Green Wave</MenuItem>
                                    <MenuItem value={"Sense Control"}>Sense Control</MenuItem>
                                    <MenuItem value={"Flash Control"}>Flash Control</MenuItem>
                                    <MenuItem value={"All red Control"}>All red Control</MenuItem>
                                    <MenuItem value={"Lamp Off Control"}>Lamp Off Control</MenuItem>
                                    <MenuItem value={"Ninguno"}>Ninguno</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField id="outlined-basic" label="Offset" variant="outlined" name="offsettime" onChange={handleChange} value={currentPattern.offsettime} type="number" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField id="outlined-basic" label="secuencia" variant="outlined" name="sequencenumber" onChange={handleChange} value={currentPattern.sequencenumber} type="number" />
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color="rojo" sx={{ marginLeft: 1 }}  onClick={()=>{aplicarCambios()}} >
                        aplicar
                    </Button>
                    <Button variant="contained" onClick={() => { setModalConfig(false) }} color="oscuro" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );

}


const columns = [
    { id: 'number', label: 'Number', minWidth: 100 },
    //{ id: 'cycletime', label: 'Cycletime', minWidth: 100 },
    { id: 'sequencenumber', label: 'Sequence Number', minWidth: 100 },
    { id: 'splitnumber', label: 'Split Number', minWidth: 100 },
    { id: 'offsettime', label: 'OffsetTime', minWidth: 100 },
    { id: 'workmode', label: 'Workmode', minWidth: 100 },
];
