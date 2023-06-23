
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from '@mui/material/Button';
import { getAccionHT200 ,PostActionHT200} from '../js/apiFunctionsHT200';
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
import { generateActionFrame } from '../js/generateFrameApiHT200';
import { useSelector, useDispatch } from 'react-redux';
import { updateDoc, doc } from "firebase/firestore";
import { db } from '../firebase/firebase-config';
import { updateParamsHT200 } from '../features/controlerht200/controlerHT200Slice';
export default function AccionesHT200View(){
    const [data,setData]=useState([{}]);
    const [page, setPage] = useState(0);
    const [modalConfig,setModalConfig] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentAction,setCurrentAction] = useState({});
    const controlerState = useSelector(state => state.controlerht200)
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

    return(
        <>
            <Container maxWidth="md">
                <h1>Acciones View</h1>
                <Grid container spacing={2}>
                    
                <Grid item md={3} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} onClick={readData} fullWidth >Leer Datos</Button>
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
                                                            {convertFuncion(row.auxiliary)}
                                                            </TableCell>
                                                       <TableCell key={index+17} align={"center"}>
                                                            {convertEspecial(row.special)}
                                                            </TableCell>
                                                            <TableCell key={index+33} align={"center"}>
                                                         <IconButton color="oscuro" aria-label="add an alarm"onClick={()=>{modificarAccion(row)}} >
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
        </>
    )
}

const columns = [
    { id: 'number', label: 'Number', minWidth: 100 },
    //{ id: 'cycletime', label: 'Cycletime', minWidth: 100 },
    { id: 'patron', label: 'Pattern', minWidth: 100 },
    // { id: 'special', label: 'Especial', minWidth: 100 },
    // { id: 'auxiliary', label: 'Auxiliar', minWidth: 100 },
];
