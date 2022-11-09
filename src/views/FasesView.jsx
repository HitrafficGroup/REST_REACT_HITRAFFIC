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
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { getFasesFromRestApi,postFasesFromRestApi } from '../js/apiFunctions'
import { useSelector, useDispatch } from 'react-redux';
import { addFases } from "../features/controlers/controlerSlice"
import '../css/FasesView.css';


export default function FasesView() {

    const [fases, setFases] = useState(fasesIniciales)
    const [modalFase, setModalFase] = useState(false)
    const dispatch = useDispatch();
    const [currentFase, setCurrentFase] = useState(faseInicial)
    const [faseg1, setFaseg1] = useState('rojo')
    const [faseg2, setFaseg2] = useState('rojo')
    const [faseg3, setFaseg3] = useState('rojo')
    const [faseg4, setFaseg4] = useState('rojo')
    const controlerState = useSelector(state => state.controlers)
    const abrirModalFase = (data) => {
        const fasesAnteriores = fases
        setFaseg1(data.grupos[0].colorDescripcion)
        setFaseg2(data.grupos[1].colorDescripcion)
        setFaseg3(data.grupos[2].colorDescripcion)
        setFaseg4(data.grupos[3].colorDescripcion)
        setCurrentFase(data);
        
        console.log(data);
        setModalFase(true);
    }
    const cargarDatosController = async() => {
     
        let lista_datos = []
        let datos_fases = {
            "ip": controlerState.ip
        }
        const temp =  fases
     
        var newFase = []
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
                //console.log(binary) //lista_colores.push(valor)
            }
            let bits_faltantes = 16 - fase.length
            for (let falta = 0; falta < bits_faltantes; falta++) {
                fase = "0" + fase
            }
            datos_fases["fase" + (index_f + 1).toString()] = parseInt(fase, 2).toString()
            //lista_datos.push(fase)
            lista_datos.push(parseInt(fase, 2))
        }
        console.log('datos cargados',datos_fases)
        try{
            await postFasesFromRestApi(datos_fases);
        }catch(e){
            console.log(e)
        }
        
    }

    const actualizarFase = () => {
        let data2 = currentFase
        data2.grupos[0]['colorDescripcion'] = faseg1
        data2.grupos[1]['colorDescripcion'] = faseg2
        data2.grupos[2]['colorDescripcion'] = faseg3
        data2.grupos[3]['colorDescripcion'] = faseg4
        setCurrentFase(data2)
        setModalFase(false);

    }
    const ModificarGrupos = (e) => {
        //var data = currentFase
        //  data.grupos.forEach(item=>{
        //     if(item.grupoNum.toString() === e.target.name){
        //         item['colorDescripcion'] = e.target.value
        //     }

        // })
        if (e.target.name == "1") {
            setFaseg1(e.target.value)
        } else if (e.target.name == "2") {
            setFaseg2(e.target.value)
        } else if (e.target.name == "3") {
            setFaseg3(e.target.value)
        } else {
            setFaseg4(e.target.value)
        }
        // setCurrentFase(data)
        // console.log(data)

    }
    const leerDatosFases = async () => {
        //dispatch(addFases(getFasesFromRestApi(currentControler.mac,currentControler.ip)));
        try {
            const result = await getFasesFromRestApi(controlerState.mac, controlerState.ip)
            console.log("resultado obtnido", result)
            var arregloFases = []
            for (let index_plan = 1; index_plan < 17; index_plan++) {
                var faseT = result["fase" + index_plan]
                arregloFases.push(faseT)

            }
            console.log(arregloFases)
            const ndatos = arregloFases
            setFases(ndatos);
            //dispatch(addFases(arregloFases));
        }
        catch (e) {
            console.log(e);
        }
    }
    return (
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
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" color='primary' onClick={leerDatosFases}>Leer Datos</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" color='primary' onClick={cargarDatosController}  >Cargar Datos</Button>
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
                                        value={faseg1}
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
                                        value={faseg2}
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
                                        value={faseg3}
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
                                        value={faseg4}
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
        </>
    );

}
var fasesIniciales = [
    {
        faseNum: 1,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },
    {
        faseNum: 2,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
        ]
    },

    {
        faseNum: 3,
        grupos: [
            { grupoNum: 1, id: 'g1_fase_1', faseNum: 1, color: 1, colorDescripcion: 'rojo' },
            { grupoNum: 2, id: 'g2_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 3, id: 'g3_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
            { grupoNum: 4, id: 'g4_fase_1', faseNum: 1, color: 0, colorDescripcion: 'rojo' },
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
    ip:"192.168.0.178",
    mac:"00:14:97:F2:D1:39"

}