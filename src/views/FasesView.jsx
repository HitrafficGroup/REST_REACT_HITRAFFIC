import React,{useState} from 'react';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import '../css/FasesView.css';
export default function FasesView(){
    const [fases,setFases] = useState([
    {name:'FASE1',g1:'rojo',g2:'verde',g3:'rojo',g4:'destello'},
    {name:'FASE2',g1:'rojo',g2:'verde',g3:'rojo',g4:'apagado'},
    {name:'FASE3',g1:'rojo',g2:'rojo',g3:'rojo',g4:'rojo'},
    {name:'FASE4',g1:'destello',g2:'rojo',g3:'verde',g4:'rojo'},
    {name:'FASE5',g1:'rojo',g2:'rojo',g3:'rojo',g4:'rojo'},
    {name:'FASE6',g1:'rojo',g2:'apagado',g3:'rojo',g4:'rojo'},
    {name:'FASE7',g1:'verde',g2:'rojo',g3:'verde',g4:'rojo'},
    {name:'FASE8',g1:'rojo',g2:'rojo',g3:'rojo',g4:'rojo'},
    {name:'FASE9',g1:'rojo',g2:'rojo',g3:'rojo',g4:'rojo'},
    {name:'FASE10',g1:'rojo',g2:'rojo',g3:'rojo',g4:'rojo'},
    {name:'FASE11',g1:'rojo',g2:'rojo',g3:'rojo',g4:'rojo'},
    {name:'FASE12',g1:'rojo',g2:'rojo',g3:'rojo',g4:'rojo'},
    {name:'FASE13',g1:'rojo',g2:'rojo',g3:'rojo',g4:'rojo'},
    {name:'FASE14',g1:'rojo',g2:'rojo',g3:'rojo',g4:'rojo'},
    {name:'FASE15',g1:'rojo',g2:'rojo',g3:'rojo',g4:'rojo'},
    {name:'FASE16',g1:'rojo',g2:'rojo',g3:'rojo',g4:'rojo'},
])
    const [modalFase,setModalFase] = useState(false)
    const [currentFase,setCurrentFase] = useState(false)
    const abrirModalFase = (data) => {
        setModalFase(true);
        setCurrentFase(data);
    }
    const actualizarFase = () =>{
        setModalFase(false);
    }
    return(
        <>
        <Container maxWidth="md">
           
            <h1>Fases View</h1>    
            <Grid container spacing={1}>
            <Grid item xs={12}>
                    <Table className='home-t'>
                        <Thead>
                            <Tr>

                                <Th className='home-t-th'>Fase</Th>
                                <Th className='home-t-th'>G1</Th>
                                <Th className='home-t-th'>G2</Th>
                                <Th className='home-t-th'>G3</Th>
                                <Th className='home-t-th'>G4</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {fases.map((dato, index) => (
                                <Tr key={index} >
                                    <Td>
                                        <b>{dato.name}</b>
                                    </Td>
                                    <Td >
                                    <Chip label={dato.g1} color={dato.g1} icon={<LightModeIcon/>} sx={{width:'90%'}}  />
                                    </Td>
                                    <Td >
                                    <Chip label={dato.g2} color={dato.g2} icon={<LightModeIcon/>} sx={{width:'90%'}} />
                                    </Td>
                                    <Td >
                                    <Chip label={dato.g3} color={dato.g3} icon={<LightModeIcon/>} sx={{width:'90%'}} />
                                    </Td>
                                    <Td >
                                    <Chip label={dato.g4} color={dato.g4} icon={<LightModeIcon/>} sx={{width:'90%'}} />
                                    </Td>
                                    <Td >
                                        <Button variant="contained" color='advertencia' onClick={()=>{abrirModalFase(dato)}} >Modificar</Button>
                                    </Td>

                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Grid>
                <Grid item xs={4}>
                <Button variant="contained" color='primary' >Leer Datos</Button>
                </Grid>
                <Grid item xs={4}>
                <Button variant="contained" color='primary'  >Cargar Datos</Button>
                </Grid>
                <Grid item xs={12}>
                            <div className='blank-box'>
                                
                            </div>
                        </Grid>
            </Grid>
            <Modal isOpen={modalFase} >
                <ModalHeader>
                    <div>
                        <h1>
                            Ajustes de la {currentFase.name}
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">G1</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="G1"
                                    value={currentFase.g1}
                                
                                >
                                    <MenuItem value={'rojo'}>Rojo</MenuItem>
                                    <MenuItem value={'verde'}>Verde</MenuItem>
                                    <MenuItem value={'destello'}>Destello</MenuItem>
                                    <MenuItem value={'apagado'}>Apagado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">G2</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="G2"
                                value={currentFase.g2}
                                
                                >
                                    <MenuItem value={'rojo'}>Rojo</MenuItem>
                                    <MenuItem value={'verde'}>Verde</MenuItem>
                                    <MenuItem value={'destello'}>Destello</MenuItem>
                                    <MenuItem value={'apagado'}>Apagado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">G3</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="G3"
                                    value={currentFase.g3}
                            
                                >
                                 <MenuItem value={'rojo'}>Rojo</MenuItem>
                                    <MenuItem value={'verde'}>Verde</MenuItem>
                                    <MenuItem value={'destello'}>Destello</MenuItem>
                                    <MenuItem value={'apagado'}>Apagado</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">G4</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="G4"
                                    value={currentFase.g4}
                                >
                                    <MenuItem value={'rojo'}>Rojo</MenuItem>
                                    <MenuItem value={'verde'}>Verde</MenuItem>
                                    <MenuItem value={'destello'}>Destello</MenuItem>
                                    <MenuItem value={'apagado'}>Apagado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color='crema'  onClick={actualizarFase}>
                        Aplicar
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
        </>
    );
    
    }