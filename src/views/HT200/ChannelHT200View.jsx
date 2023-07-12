import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { getChannelHT200,PostChannelHT200 } from '../../js/apiFunctionsHT200';
// tabla
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
//
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
//iconos
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { useSelector,useDispatch } from 'react-redux';
import { updateDoc, doc } from "firebase/firestore";
import { db } from '../../firebase/firebase-config';
import { updateParamsHT200 } from '../../features/controlerht200/controlerHT200Slice';
import { generateChannelFrame } from '../../js/generateFrameApiHT200';
import { IpControllerCard } from '../../components/ip-controller-card';
import { CantonControllerCard } from '../../components/canton-controller-card';
import { NombreControllerCard } from '../../components/nombre-controller-card';
export default function ChannelHT200View(){
    const controlerState = useSelector(state => state.controlerht200);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [modalConfig,setModalConfig] = useState(false);
    const [data,setData] = useState(controlerState.channel);
    const [currentChannel ,setCurrentChannel] = useState({});
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

    const formatControlType =(__data)=>{
        if(__data ===1){
            return "Other"
        }else if(__data === 2){
            return "Vehiculo"
        }else if(__data === 3){
            return "Pedestrian"
        }else{
            return "Overlap"
        }
    }

    const formatFlash =(__data)=>{
        if(__data ===4){
            return "Red"
        }else if(__data === 2){
            return "Yellow"
        }else if(__data === 1){
            return "Other"
        }else{
            return "Alternate"
        }
    }

    const formatOrientation =(__data)=>{
        if(__data ===1){
            return "East"
        }else if(__data === 2){
            return "South"
        }else if(__data === 3){
            return "West"
        }else if(__data === 4){
            return "North"
        }else if(__data === 5){
            return "North East"
        }else if(__data === 6){
            return "South East"
        }else if(__data === 7){
            return "South West"
        }else if(__data === 8){
            return "North West"
        }else{
            return "Other"
        }
    }


    const DimParameter =(__data)=>{
        if(__data ===1){
            return " Dim Verde"
        }else if(__data === 2){
            return "Dim Yellow"
        }else if(__data === 8){
            return "Dim Alternate"
        }else{
            return "Dim Red"
        }
    }

    const formatDirection =(__data)=>{
        if(__data ===1){
            return "Left"
        }else if(__data === 2){
            return "Straight"
        }else if(__data === 3){
            return "Right"
        }else if(__data === 4){
            return "Pedestrian"
        }else if(__data === 5){
            return "Turn"
        }else if(__data === 6){
            return "No Vehicle"
        }else{
            return "Other"
        }
    }
    
    const modificarChannel =(__data)=>{
        console.log(__data)
        setModalConfig(true)
        setCurrentChannel(__data)
    }

    const readData= async()=>{
        let controller_data= await getChannelHT200(controlerState.ip);
        updateFirebase('channel',data);
        dispatch(updateParamsHT200({target:'channel',data:controller_data}));
        console.log(controller_data)
        setData(controller_data)
    }
    const uploadData = async()=>{
        console.log(data)
        let data_array = generateChannelFrame(data)
        await PostChannelHT200({trama:data_array,ip:controlerState.ip})
        updateFirebase('channel',data);
        dispatch(updateParamsHT200({target:'channel',data:data}));
    }

    const AplicarCambios =()=>{
        let aux_data = JSON.parse(JSON.stringify(data))
        let data_modify = aux_data.map(item =>{
            if(item.number === currentChannel.number){
                return currentChannel;
            }
            else{
                return item;
            }
        })
        console.log(currentChannel)
        setData(data_modify)
        setModalConfig(false)
    }
    const handleChange = (event) => {
        setCurrentChannel({
            ...currentChannel,
            [event.target.name]: parseInt(event.target.value),
        });

    };
    return(
    <>
      <Container maxWidth="lg" style={{paddingTop:15}}> 
                <Grid container spacing={2}>
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
                <Grid item md={3} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} fullWidth onClick={readData}  >Leer Datos</Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" color='oscuro' sx={{ height: '100%' }}  fullWidth onClick={uploadData}>Cargar Datos</Button>
                    </Grid>
                    <Grid item xs={12} md={12}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        
                                            <TableCell
                                                key={"channel"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Grupo
                                            </TableCell>
                                            
                                            <TableCell
                                                key={"source"}
                                                align={"left"}
                                              
                                            >
                                                control source
                                            </TableCell>
                                            <TableCell
                                                key={"type"}
                                                align={"left"}
                                    
                                            >
                                                control type
                                            </TableCell>
                                            <TableCell
                                                key={"flash"}
                                                align={"left"}
                                             
                                            >
                                                Flash Parameter
                                            </TableCell>
                                            <TableCell
                                                key={"dim"}
                                                align={"left"}
                                            
                                            
                                            >
                                                Dim Parameter
                                            </TableCell>
                                            <TableCell
                                                key={"orientation"}
                                                align={"left"}
                                          
                                            >
                                                Orientation
                                            </TableCell>
                                            <TableCell
                                                key={"direction"}
                                                align={"left"}
                                      
                                            >
                                                Direction
                                            </TableCell>
                                            <TableCell
                                                key={"countdown"}
                                                align={"left"}
                                          
                                            >
                                                Countdown timmer ID
                                            </TableCell>
                                            <TableCell
                                                key={"acciones"}
                                                align={"center"}
                                        
                                            >
                                                Acciones
                                            </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.filter(item=> item.number <5).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row,index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                    <TableCell  align={"center"}>
                                                        {"grupo-"+row.number}
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                        {row.source}
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                        {formatControlType(row.type)}
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                        {formatFlash(row.flash)}
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                        {DimParameter(row.dim)}
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                        {formatOrientation(row.position)}
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                        {formatDirection(row.direction)}
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                        {row.countdown}
                                                    </TableCell>
                                                 <TableCell  align={"center"}>
                                                         <IconButton color="oscuro" aria-label="add an alarm" onClick={()=>{modificarChannel(row)}}  >
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
                            Editar Channel - {currentChannel.numbe}
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                    <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Fase</InputLabel>
                                <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={currentChannel.source}
                                            label="Fase"
                                            name="source"
                                            onChange={handleChange}
                                        >
                                        <MenuItem value={1}>fase 1</MenuItem>
                                        <MenuItem value={2}>fase 2</MenuItem>
                                        <MenuItem value={3}>fase 3</MenuItem>
                                        <MenuItem value={4}>fase 4</MenuItem>
                                        <MenuItem value={5}>fase 5</MenuItem>
                                        <MenuItem value={6}>fase 6</MenuItem>
                                        <MenuItem value={7}>fase 7</MenuItem>
                                        <MenuItem value={8}>fase 8</MenuItem>
                                </Select>
                        </FormControl>
                    </Grid>
                        <Grid item xs={12} md={12}>
                        <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">Control Type</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={currentChannel.type}
                                onChange={handleChange}
                                row
                            >
                                <FormControlLabel value={2} control={<Radio />} name='type' label="Vehiculo" />
                                <FormControlLabel value={3} control={<Radio />} name='type' label="Peatonal" />
                                <FormControlLabel value={4} control={<Radio />} name='type' label="Overlap" />
                                <FormControlLabel value={1} control={<Radio />} name='type' label="Other" />
                            </RadioGroup>
                        </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12}>
                        <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">Flash Parameter</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={currentChannel.flash}
                                onChange={handleChange}
                                row
                            >
                                <FormControlLabel value={8} control={<Radio />} name='flash' label="Alternate" />
                                <FormControlLabel value={4} control={<Radio />} name='flash' label="Red" />
                                <FormControlLabel value={2} control={<Radio />} name='flash' label="Yellow" />
                                <FormControlLabel value={1} control={<Radio />} name='flash' label="Other" />
                            </RadioGroup>
                        </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12}>
                        <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">Dim Parameter</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={currentChannel.dim}
                                onChange={handleChange}
                                row
                            >
                                <FormControlLabel value={8} control={<Radio />} name='dim' label="Dim Alternate" />
                                <FormControlLabel value={4} control={<Radio />} name='dim' label="Dim Red" />
                                <FormControlLabel value={2} control={<Radio />} name='dim' label="Dim Yellow" />
                                <FormControlLabel value={1} control={<Radio />} name='dim' label="Dim Green" />
                            </RadioGroup>
                        </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Orientation</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={currentChannel.position}
                                        label="Orientation"
                                        name="splitnumber"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={1}>East</MenuItem>
                                        <MenuItem value={2}>South</MenuItem>
                                        <MenuItem value={3}>West</MenuItem>
                                        <MenuItem value={4}>North</MenuItem>
                                        <MenuItem value={5}>North East</MenuItem>
                                        <MenuItem value={6}>South East</MenuItem>
                                        <MenuItem value={7}>South West</MenuItem>
                                        <MenuItem value={8}>North West</MenuItem>
                                        <MenuItem value={0}>Other</MenuItem>
                                        
                                    </Select>
                                </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Direction</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={currentChannel.direction}
                                        label="Direction"
                                        name="splitnumber"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={1}>Left</MenuItem>
                                        <MenuItem value={2}>Straight</MenuItem>
                                        <MenuItem value={3}>Right</MenuItem>
                                        <MenuItem value={4}>Pedestrian</MenuItem>
                                        <MenuItem value={5}>Turn</MenuItem>
                                        <MenuItem value={6}>No Vehicle</MenuItem>
                                        <MenuItem value={0}>Other</MenuItem>
                                    </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color="rojo" sx={{ marginLeft: 1 }} onClick={AplicarCambios}  >
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


