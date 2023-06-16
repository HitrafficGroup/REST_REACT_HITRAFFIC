import CardController from "../components/CardController";
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
// import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { getFasesSW12,postFasesSW12 } from '../js/apiFunctionsSW12';
import { useSelector, useDispatch } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import '../css/FasesView.css';
import { addFases } from "../features/controlers/controlerSlice";
//fases 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

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
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const dispatch = useDispatch();
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
    const handleChangePage = (event, newPage) => {
            setPage(newPage);
        };
    
    const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
        };
    
    const cargarDatosController = async () => {
      
            Swal.fire({
                title: 'Deseas Continuar ?',
                text: 'Estos Cambios se guardaran en el Controlador',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Si, actualizar!',
                showDenyButton: true,
                denyButtonText: 'Cancelar',
            }).then(async(result) => {
                if (result.isConfirmed) {
                    setDeshabilitar2(true);
            
                    try {
                        let lista_datos = []
                        let datos_fases = {
                            "ip": controlerState.ip,
                            "mac":controlerState.mac,
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
                            
                            datos_fases["fase" + (index_f + 1).toString()] = parseInt(fase, 2)
                            lista_datos.push(parseInt(fase, 2))
                        }
                        await postFasesSW12({trama:lista_datos,ip:controlerState.ip})
                        dispatch(addFases(fases));
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
        setDeshabilitar2(true)
    const ref = doc(db, "controladores", `${controlerState.id}`);
        await updateDoc(ref,{
            fases:data
        });

    }

    /*
    funcion para escribir en la api rest , envia un objeto con todos los parametros de cada fase
    editada , el parametro que recibe proviene de  la funcion CargarDatosController
    
    */


    const actualizarFase = () => {
        let data2 = JSON.parse(JSON.stringify(currentFase)) 
        let temp = JSON.parse(JSON.stringify(fases)) 
        data2.grupos[0]['colorDescripcion'] = faseg1.colorDescripcion
        data2.grupos[0]['color'] = faseg1.color
        data2.grupos[1]['colorDescripcion'] = faseg2.colorDescripcion
        data2.grupos[1]['color'] = faseg2.color
        data2.grupos[2]['colorDescripcion'] = faseg3.colorDescripcion
        data2.grupos[2]['color'] = faseg3.color
        data2.grupos[3]['colorDescripcion'] = faseg4.colorDescripcion
        data2.grupos[3]['color'] = faseg4.color
        let data_modify = temp.map((item)=>{
            if(item.faseNum === data2.faseNum){
                return data2;
            }else{
                return item;
            }
        })
        setFases(data_modify);
        setModalFase(false);

    }

    const ModificarGrupos = (e) => {

        let newDataFase = {
            color: 0,
            colorDescripcion: 'rojo'
        }
        let aux = definirAtributoColor(e.target.value)
        if (e.target.name === "1") {
            newDataFase['colorDescripcion'] = e.target.value
            newDataFase['color'] = aux
            setFaseg1(newDataFase)
        } else if (e.target.name === "2") {
            newDataFase['colorDescripcion'] = e.target.value
            newDataFase['color'] = aux
            setFaseg2(newDataFase)
        } else if (e.target.name === "3") {
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
    const readData = async () => {
        try{
            setDeshabilitar2(true);
            let result = await getFasesSW12(controlerState.ip);
            var arregloFases = []
                    for (let index_plan = 1; index_plan < 17; index_plan++) {
                        var faseT = result["fase" + index_plan]
                        arregloFases.push(faseT)
        
                    }
                    
                    enviarFasesFirebase(arregloFases);
                    dispatch(addFases(arregloFases));
                    setFases(arregloFases);
                    setDeshabilitar(false);
                    setDeshabilitar2(false);
        }    catch (e) {
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
                            <TableContainer sx={{ maxHeight: 430 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                                key={"num"}
                                                align={"left"}S
                                            >
                                                #
                                            </TableCell>
                                            <TableCell
                                                key={"grupo1"}
                                                align={"center"}
                                           
                                            >
                                                Grupo 1
                                            </TableCell>
                                            
                                            <TableCell
                                                key={"grupo2"}
                                                align={"center"}
                                              
                                            >
                                                Grupo 2
                                            </TableCell>
                                            <TableCell
                                                key={"grupo3"}
                                                align={"center"}
                                    
                                            >
                                                Grupo 3
                                            </TableCell>
                                            <TableCell
                                                key={"grupo4"}
                                                align={"center"}
                                            >
                                                Grupo 4
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
                                    {fases
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((dato,index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                     <TableCell  align={"left"}>
                                                        {index+1}
                                                     </TableCell>
                                                    <TableCell  align={"center"}>
                                                    <Chip label={dato.grupos[0].colorDescripcion} color={dato.grupos[0].colorDescripcion} icon={<LightModeIcon />} sx={{ width: '90%' }} />
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                    <Chip label={dato.grupos[1].colorDescripcion} color={dato.grupos[1].colorDescripcion} icon={<LightModeIcon />} sx={{ width: '90%' }} />
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                    <Chip label={dato.grupos[2].colorDescripcion} color={dato.grupos[2].colorDescripcion} icon={<LightModeIcon />} sx={{ width: '90%' }} />
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                    <Chip label={dato.grupos[3].colorDescripcion} color={dato.grupos[3].colorDescripcion} icon={<LightModeIcon />} sx={{ width: '90%' }} />
                                                    </TableCell>
                                                    <TableCell  align={"center"}>
                                                    <Button variant="contained" color='advertencia' onClick={() => { abrirModalFase(dato) }} >Modificar</Button>
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
                            count={fases.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button variant="contained" color='verde2'   sx={{height:40}} fullWidth onClick={readData}>Leer Datos</Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button variant="contained" sx={{height:40}} fullWidth onClick={cargarDatosController} disabled={deshabilitar} >Cargar Datos</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{height:8}}>

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
        <CardController/>
        {/* <CardInformation/> */}
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



/*codigo escrito  y testeado por David Diaz*/