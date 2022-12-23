import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import LightModeIcon from '@mui/icons-material/LightMode';
import { updateDoc,doc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { getFasesFromRestApi, postFasesFromRestApi } from '../js/apiFunctions'
import { useSelector } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import '../css/FasesView.css';

import CardController from '../components/CardController';

export default function FasesView() {

    const [fases, setFases] = useState(fasesIniciales)
    const [modalFase, setModalFase] = useState(false)
    const [currentFase, setCurrentFase] = useState(faseInicial)
    const [faseg1, setFaseg1] = useState({ color: 0, colorDescripcion: 'rojo' })
    const [faseg2, setFaseg2] = useState({ color: 0, colorDescripcion: 'rojo' })
    const [faseg3, setFaseg3] = useState({ color: 0, colorDescripcion: 'rojo' })
    const [faseg4, setFaseg4] = useState({ color: 0, colorDescripcion: 'rojo' })
    const [deshabilitar,setDeshabilitar] = useState(true);
    const [deshabilitar2,setDeshabilitar2] = useState(false);
    
    const controlerState = useSelector(state => state.controlers)
    const abrirModalFase = (data) => {

        setFaseg1(data.grupos[0])
        setFaseg2(data.grupos[1])
        setFaseg3(data.grupos[2])
        setFaseg4(data.grupos[3])
        setCurrentFase(data);
        setModalFase(true);
    }
    /*
        abrirModalFase() es una funcion para abrir una ventana emergente de la fase a editar una vez que se
        preciona el boton 'editar' toma el valor de esa fase a partir del metodo map
        que nos devuelve la informacion del objeto seleccionado

        parametros que recibe ... ejemplo : object {
            {
            faseNum: 16,
            grupos: [
                { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
                { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
                { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
                { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            ]
        }

        }
    
    */
    const cargarDatosController = async () => {
      
            Swal.fire({
                title: 'Deseas Continuar ?',
                text: 'Estos Cambios se guardaran en el Controlador',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Si, actualizar!',
                showDenyButton: true,
                denyButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    try {
                        setDeshabilitar2(true);
                        let lista_datos = []
                        let datos_fases = {
                            "ip": controlerState.ip
                        }
                        const temp = fases
                        for (let index_f = 0; index_f < 16; index_f++) {
                            let fase = ''
                            for (let index_g = 0; index_g < 4; index_g++) {
                                let valor = temp[index_f].grupos[index_g].color
                                let binary = parseInt(valor).toString(2)
                                let bits_faltantes = 2 - binary.length
                                for (let i = 0; i < bits_faltantes; i++) {
                                    binary = "0" + binary
                                }
                                fase = binary + fase
                            }
                            let bits_faltantes = 16 - fase.length
                            for (let falta = 0; falta < bits_faltantes; falta++) {
                                fase = "0" + fase
                            }
                            datos_fases["fase" + (index_f + 1).toString()] = parseInt(fase, 2).toString()
                            lista_datos.push(parseInt(fase, 2))
                        }
                        
                        enviarFasesRestApi(datos_fases)
                        enviarFasesFirebase(fases);
                        setDeshabilitar2(false);
    
                    } catch (e) {
                        console.log(e);
    
                    }
    
                }
            })
           
           
    
       
        
        //dispatch(addFases(temp));
    }
    const enviarFasesFirebase = async(data) =>{

    const ref = doc(db, "controladores", `${controlerState.mac}`);
        await updateDoc(ref,{
            fases:data
        });

    }
    const enviarFasesRestApi = async (data) => {
        try {
            await postFasesFromRestApi(data);
        } catch (e) {
            console.log(e)
        }
    }
    /*
    funcion para escribir en la api rest , envia un objeto con todos los parametros de cada fase
    editada , el parametro que recibe proviene de  la funcion CargarDatosController
    
    */


    const actualizarFase = () => {
        let data2 = currentFase
        let temp = fases
        data2.grupos[0]['colorDescripcion'] = faseg1.colorDescripcion
        data2.grupos[0]['color'] = faseg1.color
        data2.grupos[1]['colorDescripcion'] = faseg2.colorDescripcion
        data2.grupos[1]['color'] = faseg2.color
        data2.grupos[2]['colorDescripcion'] = faseg3.colorDescripcion
        data2.grupos[2]['color'] = faseg3.color
        data2.grupos[3]['colorDescripcion'] = faseg4.colorDescripcion
        data2.grupos[3]['color'] = faseg4.color
        setCurrentFase(data2)
        let fasesUpdated = temp.filter(filterbyIdfaseNum)
        setFases(fasesUpdated)
        setModalFase(false);

    }
    const filterbyIdfaseNum = (_fase) => {
        if (_fase.faseNum === currentFase.faseNum) {
            return currentFase
        } else {
            return _fase
        }
    }
    const ModificarGrupos = (e) => {

        let newDataFase = {
            color: 0,
            colorDescripcion: 'rojo'
        }
        let aux = definirAtributoColor(e.target.value)
        if (e.target.name == "1") {
            newDataFase['colorDescripcion'] = e.target.value
            newDataFase['color'] = aux
            setFaseg1(newDataFase)
        } else if (e.target.name == "2") {
            newDataFase['colorDescripcion'] = e.target.value
            newDataFase['color'] = aux
            setFaseg2(newDataFase)
        } else if (e.target.name == "3") {
            newDataFase['colorDescripcion'] = e.target.value
            newDataFase['color'] = aux
            setFaseg3(newDataFase)
        } else {
            newDataFase['colorDescripcion'] = e.target.value
            newDataFase['color'] = aux
            setFaseg4(newDataFase)
        }


    }
    /* la funcion modificar grupos nos permite editar cada uno de los grupos de la
        fase para actualizar el valor de esa fase en la api , los atributos que modifica
        son el color y colorDescripcion
    */
    const definirAtributoColor = (_data) => {
        if (_data === 'verde') {
            return 1
        } else if (_data === 'destello') {
            return 2
        } else if (_data === 'apagado') {
            return 3
        } else {
            return 0
        }
    }
    /*  
    la funcion definirAtributoColor evaluara el valor seleccionado por el select para establecer 
    el atributo color que tiene el objeto de la fase
    */
    const leerDatosFases = async () => {
        try {
            setDeshabilitar2(true);
            const result = await getFasesFromRestApi(controlerState.mac, controlerState.ip)
            var arregloFases = []
            for (let index_plan = 1; index_plan < 17; index_plan++) {
                var faseT = result["fase" + index_plan]
                arregloFases.push(faseT)

            }
            const ndatos = arregloFases
            
            setFases(ndatos);
            setDeshabilitar(false);
            setDeshabilitar2(false);
            //dispatch(addFases(ndatos));
        }
        catch (e) {
            console.log(e);
            setDeshabilitar2(false);
        }
    }
    /*
        la funcion leer datos fases nos trae la informacion de la api para posteriormente
        tratar la informacion y formatearla adecuadamente con la finalidad de poder mapear
        en la tabla.
    */
    return (
        <>
            <Container maxWidth="md">
                <div className='titulo-fases'>
                    <h4>Configuración de las Fases del Controlador</h4>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <div className={deshabilitar ? 'disabled-fases' : 'habilited-fases'}>
                        <div className='f-scroller'>
                            <Table className='home-t'>
                                <Thead>
                                    <Tr>

                                        <Th className='home-t-th'>Fases</Th>
                                        <Th className='home-t-th'>Grupo 1</Th>
                                        <Th className='home-t-th'>Grupo 2</Th>
                                        <Th className='home-t-th'>Grupo 3</Th>
                                        <Th className='home-t-th'>Grupo 4</Th>
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {fases.map((dato, index) => (
                                        <Tr key={index} >
                                            <Td>
                                                <b>{`Fase-${index + 1}`}</b>
                                            </Td>
                                            <Td >
                                                <Chip label={dato.grupos[0].colorDescripcion} color={dato.grupos[0].colorDescripcion} icon={<LightModeIcon />} sx={{ width: '90%' }} />
                                            </Td>
                                            <Td >
                                                <Chip label={dato.grupos[1].colorDescripcion} color={dato.grupos[1].colorDescripcion} icon={<LightModeIcon />} sx={{ width: '90%' }} />
                                            </Td>
                                            <Td >
                                                <Chip label={dato.grupos[2].colorDescripcion} color={dato.grupos[2].colorDescripcion} icon={<LightModeIcon />} sx={{ width: '90%' }} />
                                            </Td>
                                            <Td >
                                                <Chip label={dato.grupos[3].colorDescripcion} color={dato.grupos[3].colorDescripcion} icon={<LightModeIcon />} sx={{ width: '90%' }} />
                                            </Td>
                                            <Td >
                                                <Button variant="contained" color='advertencia' onClick={() => { abrirModalFase(dato) }} >Modificar</Button>
                                            </Td>

                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </div>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" color='verde2'   sx={{height:40}} fullWidth onClick={leerDatosFases}>Leer Datos</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" sx={{height:40}} fullWidth onClick={cargarDatosController} disabled={deshabilitar} >Cargar Datos</Button>
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
                                Ajustes de la Fase-{currentFase.faseNum}
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
                                        name='1'
                                        onChange={ModificarGrupos}
                                        value={faseg1.colorDescripcion}
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
                                        name="2"
                                        onChange={ModificarGrupos}
                                        value={faseg2.colorDescripcion}
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
                                        name='3'
                                        onChange={ModificarGrupos}
                                        value={faseg3.colorDescripcion}
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
                                        name='4'
                                        onChange={ModificarGrupos}
                                        value={faseg4.colorDescripcion}
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
                        <div className='botones-modal-f'>
                            <Button variant="contained" color='verde' sx={{ marginRight: 5 }} onClick={actualizarFase}>
                                Aplicar
                            </Button>
                            <Button variant="contained" color='rojo' onClick={() => { setModalFase(false) }}>
                                Cancelar
                            </Button>
                        </div>
                    </ModalFooter>
                </Modal>
            </Container>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar2}>
            <CircularProgress color="inherit" />
        </Backdrop>
        </>
    );

}

/* 
    variables iniciales y de prueba al momento de cargar la vista o verificar la funcionalidad de 
    alguna funcion.
*/
var fasesIniciales = [
    {
        faseNum: 1,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 2,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 2, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 2, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 2, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 2, color: 0, colorDescripcion: 'rojo' },
        ]
    },

    {
        faseNum: 3,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 3, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 3, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 3, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 3, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 4,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 5,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 6,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 7,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 8,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 9,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 10,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 11,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 12,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 13,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 14,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 15,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 16,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
]
var faseInicial = {
    faseNum: 16,
    grupos: [
        { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
        { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
    ]
}

const ejemploFase = {
    fase1: "1",
    fase2: "4",
    fase3: "16",
    fase4: "64",
    fase5: "17",
    fase6: "68",
    fase7: "17",
    fase8: "0",
    fase9: "0",
    fase10: "0",
    fase11: "0",
    fase12: "0",
    fase13: "0",
    fase14: "0",
    fase15: "0",
    fase16: "0",
    ip: "192.168.0.178",
    mac: "00:14:97:F2:D1:39"

}


/*codigo escrito  y testeado por David Diaz*/