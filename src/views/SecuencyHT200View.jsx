import React, { useState } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { getSecuencyHT200, PostSecuenciasHT200 } from "../js/apiFunctionsHT200";
import { generateSeqFrame } from "../js/generateFrameApiHT200";
import Button from '@mui/material/Button';
import "../css/SecuencyHT200View.scss";
import IconButton from '@mui/material/IconButton';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
//iconos
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useSelector, useDispatch } from 'react-redux';
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { updateParamsHT200 } from "../features/controlerht200/controlerHT200Slice";
//tablas
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
//
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import EditIcon from '@mui/icons-material/Edit';
// card controller
import CardControllerHT200 from "../components/CardControllerHT200";
export default function SecuencyHT200View() {  
    const controlerState = useSelector(state => state.controlerht200)
    const [secuencias, setSecuencias] = useState(controlerState.secuencias);
    const [modalConfig, setModalConfig] = useState(false)
    const [value, setValue] = useState('');
    const [currentSeq, setCurrentSeq] = useState([{}]);
    const [ring,setRing] = useState('ring1');
    const [seqTab, setSeqTab] = useState(0);
    const [seqTarget, setSeqTarget] = useState(controlerState.secuencias[0]);
    const dispatch = useDispatch();
    const readData = async () => {
        let data = await getSecuencyHT200(controlerState.ip);
        let data_formated = []
        data.forEach(element => {
            let aux_data = element.data
            let dictionario = {
                id: element.id,
                ring1: aux_data[0],
                ring2: aux_data[1],
                ring3: aux_data[2],
                ring4: aux_data[3]
            }
            data_formated.push(dictionario)
        });
        setSeqTarget(data_formated[0])
        updateFirebase('secuencias', data_formated)
        dispatch(updateParamsHT200({ target: 'secuencias', data: data_formated }));
        setSecuencias(data_formated)
    }

    const configurarSecuencia = (__data,ring_target) => {
        setRing(ring_target)
        let seq_formated = __data.filter(item => item.value !== 0)
        setCurrentSeq(seq_formated)
        setModalConfig(true)
    }
    const updateFirebase = async (param, __data) => {
        const ref = doc(db, "controladores", `${controlerState.id}`);
        let aux_data = {}
        aux_data[`${param}`] = __data;
        await updateDoc(ref, aux_data);
    }

    const agregarFasesSeq = () => {
        let aux_seq = JSON.parse(JSON.stringify(currentSeq))
        let newSeq = {
            id: 'paso-' + (currentSeq.length + 1),
            value: parseInt(value)
        }

        aux_seq.push(newSeq)
        setCurrentSeq(aux_seq)

    }

    const guardarFase = () => {
        let aux_total = JSON.parse(JSON.stringify(secuencias))
        let aux_seq = JSON.parse(JSON.stringify(seqTarget))
        let formated_seq = JSON.parse(JSON.stringify(currentSeq))
        for (let i = 0; i <= 16; i++) {
            if (formated_seq.length < i) {
                let custom_data = {
                    id: 'paso-' + i,
                    value: 0
                }
                formated_seq.push(custom_data)
            }
        }

        aux_seq[ring] = formated_seq
        setSeqTarget(aux_seq)
        let modify_seq = aux_total.map(item=> {
            if(item.id === aux_seq.id){
                return aux_seq
            }else{
                return item
            }
        })
        setSecuencias(modify_seq)
        setModalConfig(false)
    }
    const eliminarFase = (__data) => {

        let aux_seq = JSON.parse(JSON.stringify(currentSeq))
        let data_filter = aux_seq.filter(item => item.id !== __data.id)
        if (data_filter.length > 0) {
            data_filter.map((item, index) => {
                item.id = 'paso-' + (index + 1)
                return item
            })
        }

        setCurrentSeq(data_filter)

    }

    const uploadData = async () => {
      
        let aux_secuencias = JSON.parse(JSON.stringify(secuencias))
        let data_formated = generateSeqFrame(aux_secuencias)
        await PostSecuenciasHT200({ trama: data_formated, ip: controlerState.ip })
        updateFirebase('secuencias', aux_secuencias)
        dispatch(updateParamsHT200({ target: 'secuencias', data: aux_secuencias }));

    }
    const handleTab = (event) => {
        setSeqTab(event.target.value);
        setSeqTarget(secuencias[event.target.value]);
    };
    return (

        <>
            <Container maxWidth="md" style={{paddingTop:15}}>
                <Grid container spacing={2}>
               
                    <Grid item xs={12} md={3} >
                        <Button color='verde' variant="contained"  fullWidth onClick={readData}  >leer datos</Button>
                    </Grid>
                    <Grid item xs={12} md={3} >
                        <Button color='oscuro' variant="contained"  fullWidth onClick={uploadData} >Cargar datos</Button>
                    </Grid>
                    <Grid item xs={12} md={3} >
                    </Grid>
                    <Grid item xs={12} md={3} >
                        <FormControl fullWidth >
                            <InputLabel id="demo-simple-select-label">Secuencia</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={seqTab}
                                onChange={handleTab}
                                size="small"
                                label="Secuencia"
                            >
                                <MenuItem value={0}>Secuencia 1</MenuItem>
                                <MenuItem value={1}>Secuencia 2</MenuItem>
                                <MenuItem value={2}>Secuencia 3</MenuItem>
                                <MenuItem value={3}>Secuencia 4</MenuItem>
                                <MenuItem value={4}>Secuencia 5</MenuItem>
                                <MenuItem value={5}>Secuencia 6</MenuItem>
                                <MenuItem value={6}>Secuencia 7</MenuItem>
                                <MenuItem value={7}>Secuencia 8</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={12}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell key={"ring"} align={'center'} style={{ minWidth: 40 }}>
                                            Ring
                                        </TableCell>
                                        <TableCell key={"secuencia"} align={'left'} style={{ minWidth: 120 }}>
                                        Secuencia de Fases
                                        </TableCell>
                                        <TableCell key={"acciones"} align={'left'} style={{ minWidth: 40 }}>
                                            Acciones
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow hover role="checkbox" tabIndex={-1} key={'ring1'} >
                                        <TableCell align={"center"}>1</TableCell>
                                        <TableCell align={"left"}>
                                            <Stack direction="row" spacing={2}>
                                                {seqTarget.ring1.filter(item => item.value !== 0).map(item => (
                                                    <div className="seq-item">
                                                        {item.value}
                                                    </div>
                                                ))}

                                            </Stack>
                                        </TableCell>
                                        <TableCell align={"left"}>
                                            <IconButton color="amarillo" aria-label="add to shopping cart" onClick={()=>{configurarSecuencia(seqTarget.ring1,'ring1')}} >
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow hover role="checkbox" tabIndex={-1} key={'ring2'} >
                                        <TableCell align={"center"}>2</TableCell>
                                        <TableCell align={"left"}>
                                            <Stack direction="row" spacing={2}>
                                                {seqTarget.ring2.filter(item => item.value !== 0).map(item => (
                                                    <div className="seq-item">
                                                        {item.value}
                                                    </div>
                                                ))}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align={"left"}>
                                            <IconButton color="amarillo" aria-label="add to shopping cart" onClick={()=>{configurarSecuencia(seqTarget.ring2,'ring2')}}>
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow hover role="checkbox" tabIndex={-1} key={'ring3'} >
                                        <TableCell align={"center"}>3</TableCell>
                                        <TableCell align={"left"}>
                                            <Stack direction="row" spacing={2}>
                                                {seqTarget.ring3.filter(item => item.value !== 0).map(item => (
                                                    <div className="seq-item">
                                                        {item.value}
                                                    </div>
                                                ))}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align={"left"}>
                                            <IconButton color="amarillo" aria-label="add to shopping cart" onClick={()=>{configurarSecuencia(seqTarget.ring3,'ring3')}}>
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow hover role="checkbox" tabIndex={-1} key={'ring4'} >

                                        <TableCell align={"center"}>4</TableCell>
                                        <TableCell align={"left"}>
                                            <Stack direction="row" spacing={2}>
                                                {seqTarget.ring4.filter(item => item.value !== 0).map(item => (
                                                    <div className="seq-item">
                                                        {item.value}
                                                    </div>
                                                ))}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align={"left"}>
                                            <IconButton color="amarillo" aria-label="add to shopping cart" onClick={()=>{configurarSecuencia(seqTarget.ring4,'ring4')}} >
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={8}>

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

                        <Grid item xs={12} md={8}>
                            <Autocomplete
                                disableClearable

                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}

                                fullWidth
                                id="controllable-states-demo"
                                options={options}

                                renderInput={(params) => <TextField {...params} label="Seleccionar Fase" />}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button variant="contained" fullWidth color="primary" onClick={() => { agregarFasesSeq() }} sx={{ height: "100%" }} >
                                agregar
                            </Button>
                        </Grid>

                        <Grid item xs={12} md={12}>

                            <ul className="list-container-seq">
                                {currentSeq.map((item, index) => {
                                    return (
                                        <li key={index} className="list-items-seq">
                                            <div className="fase-container">
                                                <p style={{ margin: 0 }}>fase - {item.value}</p>
                                                <IconButton aria-label="delete" color="oscuro" onClick={() => { eliminarFase(item) }}  >
                                                    <CloseSharpIcon />
                                                </IconButton>
                                            </div>

                                        </li>
                                    );
                                })}

                            </ul>

                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color="rojo" sx={{ marginLeft: 1 }} onClick={guardarFase}>
                        GUARDAR CAMBIOS
                    </Button>
                    <Button variant="contained" onClick={() => { setModalConfig(false) }} color="oscuro" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <CardControllerHT200 />
        </>

    );


}



const options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];