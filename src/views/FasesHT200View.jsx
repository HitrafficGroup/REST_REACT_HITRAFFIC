import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Swal from 'sweetalert2';
import { getFasesHT200,PostFasesHT200 } from "../js/apiFunctionsHT200";
import { useSelector, useDispatch } from 'react-redux';
import { updateDoc, doc } from "firebase/firestore";
import { updateParamsHT200 } from "../features/controlerht200/controlerHT200Slice";
import { generatePhaseFrame } from "../js/generateFrameApiHT200";
import { db } from "../firebase/firebase-config";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
//iconos
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
//
import CardControllerHT200 from "../components/CardControllerHT200";


export default function FasesHT200View() {
    const controlerState = useSelector(state => state.controlerht200);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [fases,setFases] = useState(controlerState.fases);
    const [modalConfig,setModalConfig] = useState(false);
    const [currentFase,setCurrentFase] = useState(currentFase_init);
    const [modalCrear,setModalCrear] = useState(false);
    const dispatch = useDispatch();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const updateFirebase = async (param, __data) => {
        const ref = doc(db, "controladores", `${controlerState.id}`);
        let aux_data = {}
        aux_data[`${param}`] = __data;
        await updateDoc(ref, aux_data);
    }
    const updateFase = ()=>{
        let aux_fases = JSON.parse(JSON.stringify(fases))
        let fases_edited = aux_fases.map((item)=>{
            if(item.number === currentFase.number){
                return currentFase
            }else{
                return item
            }
        })
        
        setFases(fases_edited)
        setModalConfig(false)
    }
    const readData=async()=>{
        let controller_data = await getFasesHT200(controlerState.ip);
        let data_filter = controller_data.filter(item=> item.number !== 0)
        setFases(data_filter)
        updateFirebase('fases',data_filter)
        dispatch(updateParamsHT200({target:'fases',data:data_filter}));
  
    }
    const abrirModalConfig =(__data)=>{
        setModalConfig(true);
        let aux_data = JSON.parse(JSON.stringify(__data))
        setCurrentFase(aux_data);
 
    }
    const handleTextField = (event) => {
        setCurrentFase({
            ...currentFase,
            [event.target.name]: parseInt(event.target.value),
        });

    };
    const uploadData = async() =>{
        let array_data = generatePhaseFrame(fases)
        updateFirebase('fases',fases);
        dispatch(updateParamsHT200({target:'fases',data:fases}));
    
        await PostFasesHT200({trama:array_data,ip:controlerState.ip});
      
    }
    const abrirModalCrear=()=>{
        setModalCrear(true)
        setCurrentFase(currentFase_init)
        
    }
    const crearFase=()=>{
        let aux_fases = JSON.parse(JSON.stringify(fases))
        let aux_current  = JSON.parse(JSON.stringify(currentFase))
        let flag = aux_fases.includes(aux_fases.find(el=>el.number===aux_current.number));
        if(!flag){
            aux_fases.push(aux_current)
            aux_fases.sort(function(a, b) {
                return a.number - b.number;
              });
        setFases(aux_fases)
        setModalCrear(false)
        
        }else{
            console.log("ya existe esa fase");
        }
    }
    const eliminarFase =(__data)=>{
          
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
                let aux_fases = JSON.parse(JSON.stringify(fases))
                aux_fases = aux_fases.filter(item=> item.number !== __data.number)
                setFases(aux_fases)

            }
        })
       
    }


    return (
        <>

            <Container maxWidth="md">
                <h1 style={{ marginBottom: 20 }}>Vista Fases</h1>
                <Grid container spacing={3}>
                <Grid item xs={12} md={4} >
                        <Button color='azulm' variant="contained" fullWidth onClick={abrirModalCrear}  >Agregar Fase</Button>
                    </Grid>
                <Grid item xs={12} md={4} >
                        <Button color='verde' variant="contained"  fullWidth onClick={readData}  >leer datos</Button>
                    </Grid>
                    <Grid item xs={12} md={4} >
                        <Button color='oscuro' variant="contained" fullWidth  onClick={uploadData} >Cargar datos</Button>
                    </Grid>
                
                    <Grid item xs={12} md={12}>
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
                                        <TableCell key={1} align={'left'}>
                                            Acciones
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                    {columns.map((column, index) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        );

                                                    })}
                                                    <TableCell key={index} align={"left"}>
                                                        <Stack direction="row" spacing={1}>
                                                            <IconButton aria-label="delete" color="oscuro" onClick={()=>{abrirModalConfig(row)}} >
                                                                <SettingsIcon />
                                                            </IconButton>
                                                            <IconButton aria-label="delete" color="rojo" onClick={()=>{eliminarFase(row)}} >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Stack>
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
                            count={fases.length}
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
                          Editar Fase
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                 
                  
                        <Grid item xs={12} md={4} >
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.walk}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="walk"
                            label="walk"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                        <TextField
                            label="Ped Clear"
                            type="number"
                            id="outlined-controlled"
                            value={currentFase.pedestrianClear}
                            fullWidth={true}
                            name="pedestrianClear"
                            onChange={handleTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} >
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.minimumGreen}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="minimumGreen"
                            label="Minimo en Verde"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                        <TextField
                            label="Peatonal"
                            type="number"
                            id="outlined-controlled"
                            value={currentFase.passage}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="passage"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.maximun1}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="maximun1"
                            label="Maximo en verde1"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.maximun2}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="maximun2"
                            label="Maximo en verde 2"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.yellowchange}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="yellowchange"
                            label="vehicle yellow"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.redclear}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="redclear"
                            label="redclear"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.RedRevert}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="RedRevert"
                            label="Red Revert"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.vehicleclear}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="vehicleclear"
                            label="vehicleclear"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                       
                      
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" onClick={updateFase} color="rojo" sx={{ marginLeft: 1 }}>
                        GUARDAR
                    </Button>
                    <Button variant="contained" onClick={()=>{setModalConfig(false)}} color="oscuro" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>

            
            <Modal isOpen={modalCrear} >
                <ModalHeader>
                    <div>
                        <h1>
                          Crear Fase
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                    <Grid item xs={12} >
                    <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Fases Controlador</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentFase.number}
                                label="Fases Controlador"
                                name="number"
                                onChange={handleTextField}
                            >
                                <MenuItem value={1}>Fase 1</MenuItem>
                                <MenuItem value={2}>Fase 2</MenuItem>
                                <MenuItem value={3}>Fase 3</MenuItem>
                                <MenuItem value={4}>Fase 4</MenuItem>
                                <MenuItem value={5}>Fase 5</MenuItem>
                                <MenuItem value={6}>Fase 6</MenuItem>
                                <MenuItem value={7}>Fase 7</MenuItem>
                                <MenuItem value={8}>Fase 8</MenuItem>
                                <MenuItem value={9}>Fase 9</MenuItem>
                                <MenuItem value={10}>Fase 10</MenuItem>
                                <MenuItem value={11}>Fase 11</MenuItem>
                                <MenuItem value={12}>Fase 12</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4} >
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.walk}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="walk"
                            label="walk"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                        <TextField
                            label="Ped Clear"
                            type="number"
                            id="outlined-controlled"
                            value={currentFase.pedestrianClear}
                            fullWidth={true}
                            name="pedestrianClear"
                            onChange={handleTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} >
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.minimumGreen}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="minimumGreen"
                            label="Minimo en Verde"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                        <TextField
                            label="Peatonal"
                            type="number"
                            id="outlined-controlled"
                            value={currentFase.passage}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="passage"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.maximun1}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="maximun1"
                            label="Maximo en verde1"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.maximun2}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="maximun2"
                            label="Maximo en verde 2"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.yellowchange}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="yellowchange"
                            label="vehicle yellow"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.redclear}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="redclear"
                            label="redclear"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.RedRevert}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="RedRevert"
                            label="Red Revert"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField
                            id="outlined-controlled"
                            value={currentFase.vehicleclear}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="vehicleclear"
                            label="vehicleclear"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            />
                        </Grid>
                       
                      
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" onClick={crearFase} color="rojo" sx={{ marginLeft: 1 }}>
                        crear
                    </Button>
                    <Button variant="contained" onClick={()=>{setModalCrear(false)}} color="oscuro" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <CardControllerHT200 />
        </>
    )
}

const columns = [
    { id: 'number', label: 'fase Nro', minWidth: 40 },
    { id: 'walk', label: 'ped walk', minWidth: 100 },
    {
        id: 'pedestrianClear',
        label: 'ped clear',
        minWidth: 100,
        align: 'left',

    },
    {
        id: 'minimumGreen',
        label: 'Mini green',
        minWidth: 100,
        align: 'left',

    },
    // {
    //   id: 'passage',
    //   label: 'paeatones',
    //   minWidth: 100,
    //   align: 'left',

    // },
    // {
    //     id: 'max_green',
    //     label: 'maximo en verde',
    //     minWidth: 150,
    //     align: 'left',

    //   },

    //   {
    //     id: 'max_green2',
    //     label: 'maximo en verde 2',
    //     minWidth: 170,
    //     align: 'left',

    //   },
    //   {
    //     id: 'vehicle_yellow',
    //     label: 'amarilllo vehicular',
    //     minWidth: 150,
    //     align: 'left',

    //   },
    //   {
    //     id: 'red_clear',
    //     label: 'red clear',
    //     minWidth: 100,
    //     align: 'left',

    //   },
    //   {
    //     id: 'red_revert',
    //     label: 'red revert',
    //     minWidth: 150,
    //     align: 'left',

    //   },
    //   {
    //     id: 'vehicle_clear',
    //     label: 'Vehicle Clear',
    //     minWidth: 150,
    //     align: 'left',

    //   },
];
let currentFase_init = {
    AddedInitial: 0,
    MaximunInitial:0,
    RedRevert:0,
    TimeBeforeReduction:0,
    carsbeforereduction:0,
    concurrency:0,
    dynamicmaxstep:0,
    dynamimaxlist:0,
    maximun1:0,
    maximun2:0,
    minimumGreen:10,
    minimungap:0,
    number:5,
    options:0,
    passage:0,
    pedestrianClear:0,
    redclear:0,
    reduceby:0,
    releasephase:0,
    ring:0,
    startup:0,
    timetoreduce:0,
    vehicleclear:0,
    walk:0,
    yellowchange:0,
}
// let fases_initial = [
//     {
//         phase: 1,
//         ped_walk: 2,
//         ped_clear: 3,
//         mini_green: 4,
//         passage: 5,
//         max_green: 1,
//         max_green2: 1,
//         vehicle_yellow: 5,
//         red_clear: 9,
//         red_revert: 5,
//         vehicle_clear: 8
//     }
// ]