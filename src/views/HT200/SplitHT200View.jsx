import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { generateSplitFrame } from "../../js/generateFrameApiHT200";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from '@mui/material/Button';
import { getSplitHT200,PostSplitHT200} from "../../js/apiFunctionsHT200";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Swal from 'sweetalert2';
import IconButton from '@mui/material/IconButton';
//iconos
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector,useDispatch } from 'react-redux';
import { updateParamsHT200 } from "../../features/controlerht200/controlerHT200Slice";
//
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { IpControllerCard } from '../../components/ip-controller-card';
import { CantonControllerCard } from '../../components/canton-controller-card';
import { NombreControllerCard } from '../../components/nombre-controller-card';

export default function SplitHT200View() {
    const controlerState = useSelector(state => state.controlerht200)
    const [splitTab, setSplitTab] = useState("split-1");
    const [splits, setSplits] = useState(controlerState.split);
    const [currentTab, setCurrentTab] = useState(controlerState.split[0].data);
    const [modalConfig, setModalConfig] = useState(false);
    const [modalCrear,setModalCrear] = useState(false);
    const [currentSplit, setCurrentSplit] = useState({ tiempo: 0 });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const dispatch = useDispatch();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    const updateFirebase = async (param, __data) => {
        const ref = doc(db, "controladores", `${controlerState.id}`);
        let aux_data = {};
        aux_data[`${param}`] = __data;
        await updateDoc(ref, aux_data);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const readData = async () => {
        let controller_data = await getSplitHT200(controlerState.ip);

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 16; j++) {

                let target = controller_data[i].data[j].mode
                if (target === 1) {
                    controller_data[i].data[j].mode = "Otro"
                } else if (target === 2) {
                    controller_data[i].data[j].mode = "Ninguno"
                } else if (target === 3) {
                    controller_data[i].data[j].mode = "Minimun Vehicle Recall"
                } else if (target === 4) {
                    controller_data[i].data[j].mode = "Maximun Vehicle Recall"
                } else if (target === 5) {
                    controller_data[i].data[j].mode = "Pedestrian Recall"
                } else if (target === 6) {
                    controller_data[i].data[j].mode = "Maximun vehicle Pedestrian Recall"
                }  else if (target === 7) {
                    controller_data[i].data[j].mode = "Phase Omitted"
                }else {
                    controller_data[i].data[j].mode = "Ninguno"
                }

            }
        }

        let modify_data = controller_data.map(item =>{
            item.data = item.data.filter(item => item.fase !== 0)
            return item
        })
        console.log(modify_data)
        updateFirebase('split',modify_data)
        dispatch(updateParamsHT200({target:'split',data:modify_data}));
        setSplits(modify_data)
        setCurrentTab(modify_data[0].data)
        setSplitTab("split-1");

    }

    const handleSplit = (event) => {
        setSplitTab(event.target.value);

        let split_actual = splits.filter((item) => item.id === event.target.value)
        setCurrentTab(split_actual[0].data);
    };



    const handleChange = (event) => {
        setCurrentSplit({
            ...currentSplit,
            [event.target.name]: event.target.value,
        });

    };

    const modficarSplit = (__data) => {
        setModalConfig(true)
        setCurrentSplit(__data)


    }
    const aplicarCambios = () => {
        let aux_data = JSON.parse(JSON.stringify(currentSplit))
        let aux_split = JSON.parse(JSON.stringify(currentTab))
        aux_data.coord = parseInt(aux_data.coord)
        aux_data.tiempo = parseInt(aux_data.tiempo)
        let flag = true
        let split_edited = []
        if(aux_data.fase === 0){
            for(let i = 0;i<16;i++){
                if( aux_split[i].fase === 0){
                    if(flag){
                        aux_data.fase = i+1
                        split_edited.push(aux_data)
                        flag = false
                    }else{
                        split_edited.push(aux_split[i])
                    }
                }else{
                    split_edited.push(aux_split[i])
                }
            }

        }else{
            split_edited = aux_split.map((item) => {

                if (aux_data.fase === item.fase) {
                    return aux_data
                } else {
                    return item
                }
            })
        }
      
        setCurrentTab(split_edited)
        setModalConfig(false)
    }

    const uploadData = async() =>{
      
        let aux_splits = JSON.parse(JSON.stringify(splits))
       
        let data = aux_splits.map((item) => {
            if(item.id === splitTab){
                return {data:  JSON.parse(JSON.stringify(currentTab)),id:splitTab}
            }else{
                return item;
            }
        })

       
        let array_data = generateSplitFrame(data)
        await PostSplitHT200({trama:array_data,ip:controlerState.ip})
        updateFirebase('split',aux_splits)
        dispatch(updateParamsHT200({target:'split',data:aux_splits}));
    }
    const abrirModalCrear =()=>{
        setCurrentSplit({fase:1,tiempo:10,mode:"Ninguno",coord:4})
        setModalCrear(true)
    }
    const crearSplit =()=>{
        let aux_splits = JSON.parse(JSON.stringify(splits))
        let aux_currentab = JSON.parse(JSON.stringify(currentTab))
        let flag = aux_currentab.includes(aux_currentab.find(el=>el.fase===currentSplit.fase));
        if(!flag){
            aux_currentab.push(currentSplit)
            aux_currentab.sort(function(a, b) {
                return a.fase - b.fase;
              });
        let modify_splits = aux_splits.map(item=>{
            if(item.id ===splitTab){
                item.data = aux_currentab
            }
            return item;
        })
        setCurrentTab(aux_currentab)
        setSplits(modify_splits)
        setModalCrear(false)
        }else{
            console.log("ya existe esa fase")
        }
      
    }
    const eliminarSplit = (__data) =>{
      
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
                let aux_splits = JSON.parse(JSON.stringify(splits))
                let aux_currentab = JSON.parse(JSON.stringify(currentTab))
                aux_currentab = aux_currentab.filter(item=> item.fase !== __data.fase)
                let modify_splits = aux_splits.map(item=>{
                    if(item.id ===splitTab){
                        item.data = aux_currentab
                    }
                    return item;
                })
                setCurrentTab(aux_currentab)
                setSplits(modify_splits)
            }
        })
       

    }

    return (
        <>
            <Container maxWidth="lg" style={{paddingTop:15}}>
        
                <Grid container spacing={2} >
                <Grid item xs={12} md={4} >
                      <NombreControllerCard  
                      sx={{ height: '100%' }}
                        value={controlerState.nombre}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} >
                      <CantonControllerCard  
                      sx={{ height: '100%' }}
                        value={controlerState.canton}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} >
                      <IpControllerCard  
                      sx={{ height: '100%' }}
                        value={controlerState.ip}
                        />
                    </Grid>
                <Grid item  xs={12}>
                </Grid>
                    <Grid item md={3} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Split Tab</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={splitTab}
                                label="split tab"
                                onChange={handleSplit}
                            >
                                <MenuItem value={"split-1"}>ciclo 1</MenuItem>
                                <MenuItem value={"split-2"}>ciclo 2</MenuItem>
                                <MenuItem value={"split-3"}>ciclo 3</MenuItem>
                                <MenuItem value={"split-4"}>ciclo 4</MenuItem>
                                <MenuItem value={"split-5"}>ciclo 5</MenuItem>
                                <MenuItem value={"split-6"}>ciclo 6</MenuItem>
                                <MenuItem value={"split-7"}>ciclo 7</MenuItem>
                                <MenuItem value={"split-8"}>ciclo 8</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={3} >
                        <Button  variant="contained" color='azulm' sx={{ height: '100%' }} fullWidth onClick={abrirModalCrear}  >AGREGAR SPLIT</Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} fullWidth onClick={readData}  >Leer Datos</Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" sx={{ height: '100%' }} color='oscuro' fullWidth onClick={uploadData}>Cargar Datos</Button>
                    </Grid>
                  
                    <Grid item md={12} xs={12}>
                    <TableContainer sx={{ maxHeight: 430 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                                key={"num"}
                                                align={"left"}
                                            >
                                            Fase
                                            </TableCell>
                                            <TableCell
                                                key={"grupo1"}
                                                align={"center"}
                                           
                                            >
                                            Tiempo
                                            </TableCell>
                                            
                                            <TableCell
                                                key={"grupo2"}
                                                align={"center"}
                                              
                                            >
                                            Mode
                                            </TableCell>
                                            <TableCell
                                                key={"grupo3"}
                                                align={"center"}
                                    
                                            >
                                            Fase Coordinada
                                            </TableCell>
                                            <TableCell
                                                key={"grupo4"}
                                                align={"center"}
                                            >
                                            Fase Clave
                                            </TableCell>
                                            <TableCell
                                                key={"fase"}
                                                align={"center"}
                                            >
                                            Fase Fija
                                            </TableCell>
                                            <TableCell
                                                key={"Acciones"}
                                                align={"center"}
                                            >
                                            Acciones
                                            </TableCell>
                                           
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentTab
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((dato,index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                     <TableCell  align={"left"}>
                                                        {dato.fase}
                                                     </TableCell>
                                                    <TableCell  align={"center"}>
                                                        {dato.tiempo}
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                        {dato.mode}
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                        {dato.coord === 1 ? <DoneIcon color="verde2" /> : <ClearIcon color="gris" />}
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                        {dato.coord === 2 ? <DoneIcon color="verde2" /> : <ClearIcon color="gris" />}
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                        {dato.coord === 4 ? <DoneIcon color="verde2" /> : <ClearIcon color="gris" />}
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                        <IconButton color="gris" aria-label="add an alarm" onClick={() => { modficarSplit(dato) }} >
                                                            <SettingsIcon />
                                                        </IconButton>
                                                        <IconButton color="rojo" aria-label="add an alarm" onClick={() => { eliminarSplit(dato) }}>
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
                            count={currentTab.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />

                    </Grid>
                    <Grid item md={12} xs={12}>
                        <div style={{height:80}}>

                        </div>
                    </Grid>

                </Grid>
            </Container>
            <Modal isOpen={modalConfig} >
                <ModalHeader>
                    <div>
                        <h5>
                            Configurar modo operativo de la fase {currentSplit.fase}
                        </h5>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>

                        <Grid item xs={12} md={6}>
                            <TextField id="outlined-basic" label="Duración de la Fase (segundos)"  name="tiempo" onChange={handleChange} value={currentSplit.tiempo} type="number" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="demo-simple-select-label">Modo de Funcionamiento</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentSplit.mode}
                                    label="split tab"
                                    name="mode"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"Otro"}>Otro</MenuItem>
                                    <MenuItem value={"Ninguno"}>Ninguno</MenuItem>
                                    <MenuItem value={"Minimun Vehicle Recall"}>Minimun Vehicle Recall</MenuItem>
                                    <MenuItem value={"Maximun Vehicle Recall"}>Maximun Vehicle Recall</MenuItem>
                                    <MenuItem value={"Pedestrian Recall"}>Pedestrian Recall</MenuItem>
                                    <MenuItem value={"Maximun vehicle Pedestrian Recall"}>Maximun vehicle Pedestrian Recall</MenuItem>
                                    <MenuItem value={"Phase Omitted"}>Phase Omitted</MenuItem>
                                    <MenuItem value={"No declarado"}>sin seleccionar</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <FormControl variant="standard" fullWidth>
                                <FormLabel id="demo-controlled-radio-buttons-group">Tipo de Fase</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="coord"
                                    value={currentSplit.coord}
                                    onChange={handleChange}
                                    row
                                >
                                    <FormControlLabel value={1} control={<Radio />} label="Fase Coord" />
                                    <FormControlLabel value={2} control={<Radio />} label="Fase Clave" />
                                    <FormControlLabel value={4} control={<Radio />} label="Fase Fija" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color="rojo" sx={{ marginLeft: 1 }} onClick={aplicarCambios} >
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
                        <h5>
                            Crear Modo de Operacion de Fase
                        </h5>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel id="demo-simple-select-label">Fase</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentSplit.fase}
                                label="Fase"
                                name="fase"
                                onChange={handleChange}
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
                        <Grid item xs={12} md={6}>
                            <TextField  
                            id="outlined-controlled"
                            label="Duración de la Fase (segundos)" 
                            fullWidth
                            name="tiempo"
                            onChange={handleChange} 
                            value={currentSplit.tiempo} 
                            type="number"
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                             />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="standard">
                            <InputLabel id="demo-customized-select-label">Modo de Funcionamiento</InputLabel>
                                    <Select
                                    labelId="demo-customized-select-label"
                                    id="demo-customized-select"
                                    value={currentSplit.mode}
                                    label="Modo"
                                    name="mode"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"Otro"}>Otro</MenuItem>
                                    <MenuItem value={"Ninguno"}>Ninguno</MenuItem>
                                    <MenuItem value={"Minimun Vehicle Recall"}>Minimun Vehicle Recall</MenuItem>
                                    <MenuItem value={"Maximun Vehicle Recall"}>Maximun Vehicle Recall</MenuItem>
                                    <MenuItem value={"Pedestrian Recall"}>Pedestrian Recall</MenuItem>
                                    <MenuItem value={"Maximun vehicle Pedestrian Recall"}>Maximun vehicle Pedestrian Recall</MenuItem>
                                    <MenuItem value={"Phase Omitted"}>Phase Omitted</MenuItem>
                                    <MenuItem value={"No declarado"}>sin seleccionar</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <FormControl>
                                <FormLabel id="demo-controlled-radio-buttons-group">Tipo de Fase</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="coord"
                                    value={currentSplit.coord}
                                    onChange={handleChange}
                                    row
                                >
                                    <FormControlLabel value={1} control={<Radio />} label="Fase Coordinada" />
                                    <FormControlLabel value={2} control={<Radio />} label="Fase Clave" />
                                    <FormControlLabel value={4} control={<Radio />} label="Fase Fija" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color="rojo" sx={{ marginLeft: 1 }} onClick={crearSplit} >
                        aplicar
                    </Button>
                    <Button variant="contained" onClick={() => { setModalCrear(false) }} color="oscuro" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>
       
        </>
    );
}