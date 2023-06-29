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
import { generatePatternFrame } from "../js/generateFrameApiHT200";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useSelector, useDispatch } from 'react-redux';
import { updateDoc, doc } from "firebase/firestore";
import Swal from 'sweetalert2';
import { db } from "../firebase/firebase-config";
import { updateParamsHT200 } from "../features/controlerht200/controlerHT200Slice";
import CardControllerHT200 from "../components/CardControllerHT200";
export default function PatternHT200View() {
    const controlerState = useSelector(state => state.controlerht200)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data,setData] = useState(controlerState.pattern)
    const [modalConfig,setModalConfig] = useState(false);
    const [currentPattern,setCurrentPattern] = useState(controlerState.pattern[0]);
    const [modalCrear,setModalCrear] = useState(false);
    const dispatch = useDispatch();
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const updateFirebase = async (param, __data) => {
        const ref = doc(db, "controladores", `${controlerState.id}`);
        let aux_data = {}
        aux_data[`${param}`] = __data;
        await updateDoc(ref, aux_data);
    }

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
        console.log(controlerState)
        let controller_data = await getPatternHT200(controlerState.ip);
        controller_data = controller_data.filter(item=> item.number !== 0)
        updateFirebase('pattern',controller_data)
        dispatch(updateParamsHT200({target:'pattern',data:controller_data}));
        setData(controller_data)

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

        array_data = generatePatternFrame(data)
        await PostPatternHT200({trama:array_data,ip:controlerState.ip})
        updateFirebase('pattern',data)
        dispatch(updateParamsHT200({target:'pattern',data:data}));
    }
    const convertWorkmode = (__data)=>{
        if (__data === 1) {
            return "Fixed Time"
        } else if (__data === 2 ) {
            return "Green Wave"
        } else if (__data === 3) {
            return "Sense Control"
        } else if (__data === 4) {
           return "Flash Control"
        } else if (__data === 5) {
            return "All red Control"
        } else if (__data === 6 ) {
            return "Lamp Off Control"
        } else {
           return 0
        }
    }
    const crearPatron=()=>{
        let aux_patron = JSON.parse(JSON.stringify(data))
        let aux_current  = JSON.parse(JSON.stringify(currentPattern))
        let flag = aux_patron.includes(aux_patron.find(el=>el.number===aux_current.number));
        if(!flag){
            aux_patron.push(aux_current)
            aux_patron.sort(function(a, b) {
                return a.number - b.number;
              });
        setData(aux_patron)
        setModalCrear(false)
        
        }else{
            console.log("ya existe esa fase");
        }
        console.log("hola")
    }
    const abrirModalCrear =()=>{
        setModalCrear(true);
    }
    const eliminarPatron=(__data)=>{
        Swal.fire({
            title: 'Deseas Continuar ?',
            text: 'Se Eliminara Esta Configuracion',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, Eliminar!',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                let aux_patron = JSON.parse(JSON.stringify(data))
                aux_patron = aux_patron.filter(item=> item.number !== __data.number)
                setData(aux_patron)

            }
        })
    }

    return (
        <>

            <Container maxWidth="md">
                <h1>Vista Pattern</h1>
                <Grid container spacing={2}>
                <Grid item xs={12} md={4} >
                        <Button color='azulm' variant="contained"  fullWidth onClick={abrirModalCrear}  >crear patron</Button>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} fullWidth onClick={readData}>Leer Datos</Button>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Button variant="contained" sx={{ height: '100%' }} color='oscuro' fullWidth onClick={uploadData} >Cargar Datos</Button>
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                             <TableCell
                                                key={"number"}
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Pattern
                                            </TableCell>
                                            <TableCell
                                                key={"sequencenumber"}
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Sequencenumber
                                            </TableCell>
                                            <TableCell
                                                key={"splitnumber"}
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Splitnumber
                                            </TableCell>
                                            <TableCell
                                                key={"offsettime"}
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Offsettime
                                            </TableCell>
                                         <TableCell
                                                key={"workmode"}
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Workmode
                                            </TableCell>
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
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                        <TableCell  align={"center"}>
                                                            {row.number}
                                                        </TableCell>
                                                        <TableCell  align={"center"}>
                                                            {row.sequencenumber}
                                                        </TableCell>
                                                        <TableCell  align={"center"}>
                                                            {row.splitnumber}
                                                        </TableCell>
                                                        <TableCell  align={"center"}>
                                                            {row.offsettime}
                                                        </TableCell>
                                                        <TableCell  align={"center"}>
                                                            {convertWorkmode(row.workmode)}
                                                            </TableCell>
                                                         <TableCell  align={"center"}>
                                                         <IconButton color="oscuro" aria-label="add an alarm" onClick={()=>{modificarPatron(row)}} >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton color="rojo" aria-label="add an alarm" onClick={()=>{eliminarPatron(row)}} >
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
                                    <MenuItem value={1}>Fixed Time</MenuItem>
                                    <MenuItem value={2}>Green Wave</MenuItem>
                                    <MenuItem value={3}>Sense Control</MenuItem>
                                    <MenuItem value={4}>Flash Control</MenuItem>
                                    <MenuItem value={5}>All red Control</MenuItem>
                                    <MenuItem value={6}>Lamp Off Control</MenuItem>
                                    <MenuItem value={7}>Ninguno</MenuItem>
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

            <Modal isOpen={modalCrear} >
                <ModalHeader>
                    <div>
                        <h1>
                            Crear Patron
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                    <Grid item  md={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Pattern</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentPattern.number}
                                    label="Pattern"
                                    name="number"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>Patron 1</MenuItem>
                                    <MenuItem value={2}>Patron 2</MenuItem>
                                    <MenuItem value={3}>Patron 3</MenuItem>
                                    <MenuItem value={4}>Patron 4</MenuItem>
                                    <MenuItem value={5}>Patron 5</MenuItem>
                                    <MenuItem value={6}>Patron 6</MenuItem>
                                    <MenuItem value={7}>Patron 7</MenuItem>
                                    <MenuItem value={8}>Patron 8</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
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
                                    <MenuItem value={1}>Fixed Time</MenuItem>
                                    <MenuItem value={2}>Green Wave</MenuItem>
                                    <MenuItem value={3}>Sense Control</MenuItem>
                                    <MenuItem value={4}>Flash Control</MenuItem>
                                    <MenuItem value={5}>All red Control</MenuItem>
                                    <MenuItem value={6}>Lamp Off Control</MenuItem>
                                    <MenuItem value={7}>Ninguno</MenuItem>
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
                    <Button variant="contained" color="rojo" sx={{ marginLeft: 1 }}  onClick={crearPatron} >
                        aplicar
                    </Button>
                    <Button variant="contained" onClick={() => { setModalCrear(false) }} color="oscuro" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <CardControllerHT200 />
        </>
    );

}

