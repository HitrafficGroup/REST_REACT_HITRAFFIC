import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { getChannelHT200 } from '../js/apiFunctionsHT200';
// tabla
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
//iconos
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
export default function ChannelView(){
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [modalConfig,setModalConfig] = useState(false);
    const [data,setData] = useState([{}]);
    const [currentChannel ,setCurrentChannel] = useState({});
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

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
            return "Vehicle"
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
        }else{
            return "North"
        }
    }


    const DimParameter =(__data)=>{
        if(__data ===1){
            return "Verde"
        }else if(__data === 2){
            return "Yellow"
        }else if(__data === 8){
            return "Alternate"
        }else{
            return "Red"
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
        }else{
            return "Other"
        }
    }
    
    const modificarChannel =(__data)=>{
        setModalConfig(true)
        setCurrentChannel(__data)
    }

    const readData= async()=>{
        let data= await getChannelHT200()
        console.log(data)
        setData(data)
    }
    const uploadData =()=>{
        //
    }

    const AplicarCambios =()=>{
        console.log(currentChannel)
    }
    const handleChange = (event) => {
        setCurrentChannel({
            ...currentChannel,
            [event.target.name]: parseInt(event.target.value),
        });

    };
    return(
    <>
      <Container maxWidth="md">
                <h1>Channel View</h1>
                <Grid container spacing={2}>
                <Grid item md={3} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} fullWidth onClick={readData}  >Leer Datos</Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" color='oscuro' sx={{ height: '100%' }}  fullWidth onClick={uploadData}>Cargar Datos</Button>
                    </Grid>
                    <Grid item md={12}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        
                                            <TableCell
                                                key={"channel"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Canal
                                            </TableCell>
                                            
                                            <TableCell
                                                key={"source"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                control source
                                            </TableCell>
                                            <TableCell
                                                key={"type"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                control type
                                            </TableCell>
                                            <TableCell
                                                key={"flash"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Flash Parameter
                                            </TableCell>
                                            <TableCell
                                                key={"dim"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Dim Parameter
                                            </TableCell>
                                            <TableCell
                                                key={"orientation"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Orientation
                                            </TableCell>
                                            <TableCell
                                                key={"direction"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Direction
                                            </TableCell>
                                            <TableCell
                                                key={"countdown"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Countdown timmer ID
                                            </TableCell>
                                            <TableCell
                                                key={"acciones"}
                                                align={"center"}
                                                style={{ minWidth: 150 }}
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
                                                    <TableCell  align={"center"}>
                                                        {row.number}
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
                            Editar Planes
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>

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
                                <FormControlLabel value={1} control={<Radio />} name='type' label="Vehiculo" />
                                <FormControlLabel value={2} control={<Radio />} name='type' label="Peatonal" />
                                <FormControlLabel value={3} control={<Radio />} name='type' label="Overlap" />
                                <FormControlLabel value={4} control={<Radio />} name='type' label="Other" />
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
                                <FormControlLabel value={1} control={<Radio />} name='flash' label="Alternate" />
                                <FormControlLabel value={2} control={<Radio />} name='flash' label="Red" />
                                <FormControlLabel value={3} control={<Radio />} name='flash' label="Yellow" />
                                <FormControlLabel value={4} control={<Radio />} name='flash' label="Other" />
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
                                <FormControlLabel value={1} control={<Radio />} name='dim' label="Alternate" />
                                <FormControlLabel value={2} control={<Radio />} name='dim' label="Red" />
                                <FormControlLabel value={3} control={<Radio />} name='dim' label="Yellow" />
                                <FormControlLabel value={4} control={<Radio />} name='dim' label="Green" />
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
                                        label="Split"
                                        name="splitnumber"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={1}>Other</MenuItem>
                                        <MenuItem value={2}>East</MenuItem>
                                        <MenuItem value={3}>South</MenuItem>
                                        <MenuItem value={4}>West</MenuItem>
                                        <MenuItem value={5}>North</MenuItem>
                                        <MenuItem value={6}>North East</MenuItem>
                                        <MenuItem value={7}>South East</MenuItem>
                                        <MenuItem value={8}>North East</MenuItem>
                                        <MenuItem value={7}>South west</MenuItem>
                                        
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
                                        label="Split"
                                        name="splitnumber"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={1}>Other</MenuItem>
                                        <MenuItem value={2}>Left</MenuItem>
                                        <MenuItem value={3}>Straight</MenuItem>
                                        <MenuItem value={4}>Right</MenuItem>
                                        <MenuItem value={5}>Pedestrian</MenuItem>
                                        <MenuItem value={6}>Turn</MenuItem>
                                        <MenuItem value={7}>Non Vehicle</MenuItem>
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


const columns = [
    { id: 'id', label: 'id', minWidth: 100 },
    { id: 'hour', label: 'Hour', minWidth: 100 },
    { id: 'minute', label: 'Minute', minWidth: 100 },
    { id: 'action', label: 'action', minWidth: 100 },
    // { id: 'special', label: 'Especial', minWidth: 100 },
    // { id: 'auxiliary', label: 'Auxiliar', minWidth: 100 },
];
