
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from '@mui/material/Button';
import { getAccionHT200 ,PostActionHT200} from '../../js/apiFunctionsHT200';
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
import Swal from 'sweetalert2';
import Select from '@mui/material/Select';
import { generateActionFrame } from '../../js/generateFrameApiHT200';
import { useSelector, useDispatch } from 'react-redux';
import { updateDoc, doc } from "firebase/firestore";
import { db } from '../../firebase/firebase-config';
import { updateParamsHT200 } from '../../features/controlerht200/controlerHT200Slice';
import { IpControllerCard } from '../../components/ip-controller-card';
import { CantonControllerCard } from '../../components/canton-controller-card';
import { NombreControllerCard } from '../../components/nombre-controller-card';
export default function AccionesHT200View(){
    const controlerState = useSelector(state => state.controlerht200)
    const [page, setPage] = useState(0);
    const [modalConfig,setModalConfig] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentAction,setCurrentAction] = useState({});
    const [data,setData]=useState(controlerState.acciones);
    const [modalCrear,setModalCrear] = useState(false)
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

    const readData = async () => {
        let controller_data = await getAccionHT200(controlerState.ip);
        controller_data = controller_data.filter(item=> item.number !== 0)
        console.log(controller_data)
        setData(controller_data)
        updateFirebase('acciones',controller_data)
        dispatch(updateParamsHT200({target:'acciones',data:controller_data}));
    }

    const modificarAccion = (__data) =>{
        setModalConfig(true);
        setCurrentAction(__data)
        console.log(__data)
    }
    const handleChange = (event) => {
        setCurrentAction({
            ...currentAction,
            [event.target.name]: event.target.value,
        });

    };

    const convertFuncion = (__data) =>{
            if(__data === 1){
                return "Funcion Aux 1" ;
            }else if(__data === 2){
                return  "Funcion Aux 2" 
            }else if(__data === 4){
                return "Funcion Aux 3" 
            }else if(__data === 8){
                return  "Dim" 
            }else{
                return "No Configurado" 
            }
    }
    const convertEspecial = (__data)=>{
      
          
            if(__data === 1){
                return "Especial 1" 
            }else if(__data === 2){
                return"Especial 2" 
            }else if(__data === 4){
                return "Especial 3" 
            }else if(__data === 8){
                return "Especial 4" 
            }else if(__data === 16){
                return "Especial 5" 
            }else if(__data === 32){
                return"Especial 6" 
            }else if(__data === 64){
                return"Especial 7" 
            }else if(__data === 128){
                return "Especial 8" 
            }else{
                return "No Configurado" 
            }
            
       
    }
    const aplicarCambios =()=>{
        let aux_action = JSON.parse(JSON.stringify(currentAction))
        let aux_data =  JSON.parse(JSON.stringify(data))

        let data_modify = aux_data.map(item =>{
            if(aux_action.number === item.number){
                return aux_action;
            }else{
                return item;
            }
        })
        setData(data_modify)
        setModalConfig(false)
    }
    const uploadData = async() =>{
        let array_data = []
        let aux_data =  JSON.parse(JSON.stringify(data))
        array_data = generateActionFrame(aux_data)
        await PostActionHT200({trama:array_data,ip:controlerState.ip})
        updateFirebase('acciones',aux_data)
        dispatch(updateParamsHT200({target:'acciones',data:aux_data}));
    }
    const abrirModalCrear=()=>{
        setModalCrear(true)
        
        setCurrentAction({
            "number": 1,
            "patron": 1,
            "auxiliary": 0,
            "special": 0
        })
    }
    const crearAccion=()=>{
        let aux_acciones = JSON.parse(JSON.stringify(data))
        let aux_current  = JSON.parse(JSON.stringify(currentAction))
        let flag = aux_acciones.includes(aux_acciones.find(el=>el.number===aux_current.number));
        if(!flag){
            aux_acciones.push(aux_current)
            aux_acciones.sort(function(a, b) {
                return a.number - b.number;
              });
        setData(aux_acciones)
        setModalCrear(false)
        
        }else{
            console.log("ya existe esa fase");
        }
        console.log("hola")
    }

    const eliminarAccion=(__data)=>{
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
                let aux_accion = JSON.parse(JSON.stringify(data))
                aux_accion = aux_accion.filter(item=> item.number !== __data.number)
                setData(aux_accion)

            }
        })

    }
    return(
        <>
            <Container maxWidth="lg">
               
                <Grid container spacing={2} style={{paddingTop:15}}>
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
                <Grid item xs={12} md={4} >
                        <Button color='azulm' variant="contained"  fullWidth onClick={abrirModalCrear}  >crear Accion</Button>
                    </Grid>
                <Grid item md={4} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} onClick={readData} fullWidth >Leer Datos</Button>
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
                                                Accion
                                            </TableCell>
                                            <TableCell
                                                key={"patron"}
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Patron
                                            </TableCell>
                                           <TableCell
                                                key={"auxliary"}
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Funciones Auxiliares
                                            </TableCell>
                                            <TableCell
                                                key={"special"}
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Funciones Especiales
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
                                                            {row.patron}
                                                        </TableCell>
                                                     <TableCell  align={"center"}>
                                                            {row.number}
                                                        </TableCell>
                                                       <TableCell key={index} align={"center"}>
                                                            {convertFuncion(row.auxiliary)}
                                                            </TableCell>
                                                       <TableCell key={index+17} align={"center"}>
                                                            {convertEspecial(row.special)}
                                                            </TableCell>
                                                            <TableCell key={index+33} align={"center"}>
                                                         <IconButton color="oscuro" aria-label="add an alarm"onClick={()=>{modificarAccion(row)}} >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton color="rojo" aria-label="add an alarm" onClick={()=>{eliminarAccion(row)}} >
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
                            Editar Accion
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                      
                        <Grid item xs={12} md={12}>
                        <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Pattern</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentAction.patron}
                                    label="Pattern"
                                    name="patron"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>patron 1</MenuItem>
                                    <MenuItem value={2}>patron 2</MenuItem>
                                    <MenuItem value={3}>patron 3</MenuItem>
                                    <MenuItem value={4}>patron 4</MenuItem>
                                    <MenuItem value={5}>patron 5</MenuItem>
                                    <MenuItem value={6}>patron 6</MenuItem>
                                    <MenuItem value={7}>patron 7</MenuItem>
                                    <MenuItem value={8}>patron 8</MenuItem>
                                    <MenuItem value={9}>patron 9</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12}>
                        <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Funcion Auxiliar</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentAction.auxiliary}
                                    label="Funcion Auxiliar"
                                    name="auxiliary"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={0}>Sin Auxiliar</MenuItem>
                                    <MenuItem value={1}>Funcion Aux 1</MenuItem>
                                    <MenuItem value={2}>Funcion Aux 2</MenuItem>
                                    <MenuItem value={4}>Funcion Aux 3</MenuItem>
                                    <MenuItem value={8}>Dim</MenuItem>
                
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12}>
                        <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Funcion Especial</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentAction.special}
                                    label="Funcion Especial"
                                    name="special"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={0}>Sin Especial</MenuItem>
                                    <MenuItem value={1}>Especial 1</MenuItem>
                                    <MenuItem value={2}>Especial 2</MenuItem>
                                    <MenuItem value={4}>Especial 3</MenuItem>
                                    <MenuItem value={8}>Especial 4</MenuItem>
                                    <MenuItem value={16}>Especial 5</MenuItem>
                                    <MenuItem value={32}>Especial 6</MenuItem>
                                    <MenuItem value={64}>Especial 7</MenuItem>
                                    <MenuItem value={128}>Especial 8</MenuItem>
                        
                                </Select>
                            </FormControl>
                        </Grid>
                      
                        
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color="rojo" sx={{ marginLeft: 1 }}   onClick={aplicarCambios} >
                        aplicar
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
                            Crear Accion
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                    <Grid item xs={12} md={12}>
                        <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Accion</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentAction.number}
                                    label="Accion"
                                    name="number"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>accion 1</MenuItem>
                                    <MenuItem value={2}>accion 2</MenuItem>
                                    <MenuItem value={3}>accion 3</MenuItem>
                                    <MenuItem value={4}>accion 4</MenuItem>
                                    <MenuItem value={5}>accion 5</MenuItem>
                                    <MenuItem value={6}>accion 6</MenuItem>
                                    <MenuItem value={7}>accion 7</MenuItem>
                                    <MenuItem value={8}>accion 8</MenuItem>
                                    <MenuItem value={9}>accion 9</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12}>
                        <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Pattern</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentAction.patron}
                                    label="Pattern"
                                    name="patron"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>patron 1</MenuItem>
                                    <MenuItem value={2}>patron 2</MenuItem>
                                    <MenuItem value={3}>patron 3</MenuItem>
                                    <MenuItem value={4}>patron 4</MenuItem>
                                    <MenuItem value={5}>patron 5</MenuItem>
                                    <MenuItem value={6}>patron 6</MenuItem>
                                    <MenuItem value={7}>patron 7</MenuItem>
                                    <MenuItem value={8}>patron 8</MenuItem>
                                    <MenuItem value={9}>patron 9</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12}>
                        <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Funcion Auxiliar</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentAction.auxiliary}
                                    label="Funcion Auxiliar"
                                    name="auxiliary"
                                    onChange={handleChange}
                                >  
                                    <MenuItem value={0}>Sin Auxiliar</MenuItem>
                                    <MenuItem value={1}>Funcion Aux 1</MenuItem>
                                    <MenuItem value={2}>Funcion Aux 2</MenuItem>
                                    <MenuItem value={4}>Funcion Aux 3</MenuItem>
                                    <MenuItem value={8}>Dim</MenuItem>
                
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12}>
                        <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Funcion Especial</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentAction.special}
                                    label="Funcion Especial"
                                    name="special"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={0}>Sin Especial</MenuItem>
                                    <MenuItem value={1}>Especial 1</MenuItem>
                                    <MenuItem value={2}>Especial 2</MenuItem>
                                    <MenuItem value={4}>Especial 3</MenuItem>
                                    <MenuItem value={8}>Especial 4</MenuItem>
                                    <MenuItem value={16}>Especial 5</MenuItem>
                                    <MenuItem value={32}>Especial 6</MenuItem>
                                    <MenuItem value={64}>Especial 7</MenuItem>
                                    <MenuItem value={128}>Especial 8</MenuItem>
                        
                                </Select>
                            </FormControl>
                        </Grid>
                      
                        
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color="rojo" sx={{ marginLeft: 1 }}   onClick={crearAccion} >
                        aplicar
                    </Button>
                    <Button variant="contained" onClick={()=>{setModalCrear(false)}} color="oscuro" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>
         
        </>
    )
}

