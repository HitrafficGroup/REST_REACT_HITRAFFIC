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
import { getIpsFromRestApi,getFasesFromRestApi,getPlanesFromRestApi } from '../js/apiFunctions'
import { useSelector,useDispatch } from 'react-redux';
import {addFases,addPlanes,setInitialStateController} from "../features/controlers/controlerSlice"
import '../css/FasesView.css';


export default function FasesView(){

const [fases,setFases] = useState(fasesIniciales)
    const [modalFase,setModalFase] = useState(false)
    const dispatch = useDispatch();
    const [currentFase,setCurrentFase] = useState(false)
    const controlerState = useSelector(state => state.controlers)
    const abrirModalFase = (data) => {
        setModalFase(true);
        setCurrentFase(data);
    }
    const actualizarFase = () =>{
        setModalFase(false);
    }
    const leerDatosFases = async() =>{
             //dispatch(addFases(getFasesFromRestApi(currentControler.mac,currentControler.ip)));
             try{
                const result = await getFasesFromRestApi(controlerState.mac,controlerState.ip)
                var arregloFases = []
                for (let index_plan = 1; index_plan < 17; index_plan++) {
                        var faseT = result["fase"+index_plan]
                        arregloFases.push(faseT)
                   
                }
                console.log(arregloFases[0].grupos[0].colorDescripcion)
                setFases(arregloFases);
                dispatch(addFases(arregloFases));
            }
                catch(e){
                    console.log(e);
                }
    }
    return(
        <>
        <Container maxWidth="md">
           
            <h1>Fases View</h1>    
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <div className='f-scroller'>
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
                                        <b>fase</b>
                                    </Td>
                                    <Td >
                                    <Chip label={dato.grupos[0].colorDescripcion} color={dato.grupos[0].colorDescripcion} icon={<LightModeIcon/>} sx={{width:'90%'}}  />
                                    </Td>
                                    <Td >
                                    <Chip label={dato.grupos[1].colorDescripcion} color={dato.grupos[1].colorDescripcion} icon={<LightModeIcon/>} sx={{width:'90%'}} />
                                    </Td>
                                    <Td >
                                    <Chip label={dato.grupos[2].colorDescripcion} color={dato.grupos[2].colorDescripcion} icon={<LightModeIcon/>} sx={{width:'90%'}} />
                                    </Td>
                                    <Td >
                                    <Chip label={dato.grupos[3].colorDescripcion} color={dato.grupos[3].colorDescripcion} icon={<LightModeIcon/>} sx={{width:'90%'}} />
                                    </Td>
                                    <Td >
                                        <Button variant="contained" color='advertencia' onClick={()=>{abrirModalFase(dato)}} >Modificar</Button>
                                    </Td>

                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </div>
                </Grid>
                <Grid item xs={4}>
                <Button variant="contained" color='primary' onClick={leerDatosFases}>Leer Datos</Button>
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
    const fasesIniciales = [
        {
            faseNum:1,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:2,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:1,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:3,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:4,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:5,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:6,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:7,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:8,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:9,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:10,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:11,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:12,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:13,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:14,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:15,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
        {
            faseNum:16,
            grupos:[
                {grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo'},             
                {grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
                {grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo'},
            ]
        },
    ]