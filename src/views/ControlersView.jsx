import React, { useEffect, useRef, useState } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import '../css/ControlersView.css';

//
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';


//

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setInitialStateController, setControllerData } from "../features/controlers/controlerSlice";
import { setInitialStateControllerHT200,setControllerDataHT200 } from "../features/controlerht200/controlerHT200Slice";
import Swal from 'sweetalert2';
import { collection, updateDoc, doc, onSnapshot, query, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
//iconos
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Autocomplete from '@mui/material/Autocomplete';
import SettingsIcon from '@mui/icons-material/Settings';
import Backdrop from '@mui/material/Backdrop';
import LogoutIcon from '@mui/icons-material/Logout';
import CircularProgress from '@mui/material/CircularProgress';



const dataTest = [
    { nombre: 'nombre 1', ip: '192.168.1.2', mac: 'h3:ft:a2:l2', canton: 'cuenca', estado: true },
    { nombre: 'nombre 2', ip: '192.168.1.3', mac: 'f3:f1:a2:t2', canton: 'loja', estado: false },
    { nombre: 'nombre 3', ip: '192.168.1.4', mac: 'gf3:12:fw:36', canton: 'quito', estado: false },
    { nombre: 'nombre 4', ip: '192.168.1.5', mac: 'f3:f1:a2:32', canton: 'guayaquil', estado: false },
    { nombre: 'nombre 5', ip: '192.168.1.6', mac: 'l3:fa1:a2:37', canton: 'cotopaxi', estado: true },
    { nombre: 'nombre 6', ip: '192.168.1.7', mac: 'f3:m1:a2:367', canton: 'pasaje', estado: true },
    { nombre: 'nombre 7', ip: '192.168.1.8', mac: '13:f1:a2:39', canton: 'zamora chinchipe', estado: true },
    { nombre: 'nombre 8', ip: '192.168.1.9', mac: 'f3:f1:a2:32', canton: 'azuay', estado: true },
    { nombre: 'nombre 9', ip: '192.168.1.10', mac: 'm3:f1:a2:88', canton: 'cañar', estado: false },
    { nombre: 'nombre 10', ip: '192.168.1.11', mac: 'n3:f1:s2:32', canton: 'loja', estado: false },
    { nombre: 'nombre 11', ip: '192.168.1.12', mac: 'f3:f1:a2:22', canton: 'azuay', estado: true }
]
// CUANDO EL CLIENTE SE CONECTE MEDIANTE LA APP  Y PIDA LAS IPS DELOS CONTROLADORES EN RED
// AL TRATARSE DE UNA VPN CADA IP DE LA VPN ESTARA ASOCIADA A UNA SUBRED DE CONTROLADORES , ESO
// SIGNIFICA QUE CUANDO SE QUIERAN OBTENER TODOS LOS CONTROLADORES EN RED VAMOS A OBTENER TALVEZ SOLO 
// LOS CONTROLADORES DE LA PRIMERA SUBRED QUE SE DETECTE , ME BASO EN EL HECHO DE QUE PROBANDO EL PROGRAMA DE QT
// CUANDO TENGO DOS INTERFACES DE RED CONECTADAS A DIFERENTES CONTROLADORES , SIMPLEMENTE ME VA A TRAER EL PRIMER
//CONTROLADOR QUE DETECTE.


export default function ControlersView() {

    const [editarModal, setEditarModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [controlers, setControlers] = useState(dataTest);
    const [currentController, setCurrentController] = useState({});
    const [reload,setReload] = useState(true);
    const [model,setModel] = useState('');
    const [canton,setCanton] = useState('');
    const userState = useSelector(state => state.auth);
    const [deshabilitar, setDeshabilitar] = useState(false);
    const respaldoData = useRef([])
    const ipControlador = useRef('')
    const navigate = useNavigate(); // hook para navegar entre urls o vistas
    const dispatch = useDispatch();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const Changeview = (referencia) => {
        navigate(referencia);
    }

    const filtrarLosDatos = () => {

        let aux_data = JSON.parse(JSON.stringify(respaldoData.current))
        let filterData = aux_data.filter(filterByCanton).filter(filterByModel)
        setControlers(filterData)
        setReload(!reload)
        setCanton("")
        setModel("")
    }

    const filterByCanton =(item)=>{
        if(canton !== ""){
            if(item.canton === canton){
                return item;
            }else{
                return null;
            }
        }else{
            return item;
        }
        
    }
    const filterByModel =(item)=>{
        if(model !== ""){
            if(item.modelo === model){
                return item;
            }else{
                return null;
            }
        }else{
            return item;
        }
        
    }
    const abrirModalinformacion = (_data) => {
        let aux_data = JSON.parse(JSON.stringify(_data))
        setCurrentController(aux_data)
        setInfoModal(true)
    }
    const abrirModalEditar = (_data) => {
        let aux_data = JSON.parse(JSON.stringify(_data))
        ipControlador.current = _data.ip
        setCurrentController(aux_data);
        setEditarModal(true);
    }
    const guardarAjustes = async () => {
        console.log(currentController)
        const ref = doc(db, "historial_controladores", currentController.id);
        await updateDoc(ref, currentController);
        setEditarModal(false)

    }
    //mostrar la interfaz de acuerdo al controlador
    const programarControlador = async (_equipo) => {
        setDeshabilitar(true)
        const docRef = doc(db, "controladores", _equipo.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            let aux_equipo = JSON.parse(JSON.stringify(_equipo))
            let equipo_info = docSnap.data()
            let conexiones = aux_equipo.historial_conexiones;
            let fecha = new Date().toLocaleString('es-CO', { dateStyle: 'full', timeStyle: 'medium' })
            conexiones.push({
                id: userState.id,
                name: userState.name,
                email: userState.email,
                lastname: userState.lastname,
                fecha: fecha
            })
            aux_equipo['historial_conexiones'] = conexiones
  
            if (_equipo.modelo === "HT-200") {
                dispatch(setInitialStateControllerHT200(aux_equipo));
                dispatch(setControllerDataHT200(equipo_info));
                const ref = doc(db, "historial_controladores", _equipo.id);
                await updateDoc(ref, {
                    ultima_conexion: fecha,
                    historial_conexiones: conexiones,
                });
                navigate('/controlador_HT200/home')
                setDeshabilitar(false)
            } else if (_equipo.modelo === "SW-12") {
                dispatch(setInitialStateController(aux_equipo));
                dispatch(setControllerData(equipo_info));
                const ref = doc(db, "historial_controladores", _equipo.id);
                await updateDoc(ref, {
                    ultima_conexion: fecha,
                    historial_conexiones: conexiones,
                });
                navigate('/controlador_SW12/home')
                setDeshabilitar(false)
            }
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            setDeshabilitar(false)
        }

    }
    //Funciones de los botones
    const cerrarSesion = () => {
        navigate('/');
    }
    //funciones de la tabla

    const dataFromFirebase = async () => {
        const reference = query(collection(db, "historial_controladores"));
        onSnapshot(reference, (querySnapshot) => {
            var datos = [];
            querySnapshot.forEach((doc) => {
                datos.push(doc.data());
            });
            setControlers(
                datos
            );
            respaldoData.current = datos
        });

    }
    const eliminarController = (_data) => {

        Swal.fire({
            title: 'Estas Seguro de Eliminar el Controlador ?',
            text: 'EL controlador se eliminara de la base de datos',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, Eliminar!',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log(_data)
                console.log('se elimino');
                await deleteDoc(doc(db, "historial_controladores", _data.id));
                await deleteDoc(doc(db, "controladores", _data.id));
            }
        })
    }
    // CON RESPECTO A LA DISTANCIA DEL SERVIDOR Y LA INFORMACION TRANSMITIDA HACIA EL DISPOSITIVO DE BORDE DEL CONTROLADOR
    // LA INFORMACION PODRIA LLEGAR MAL DEBIDO AL GRAN TRAYECTO QUE DEBE REALIZAR PARA LLEGAR AL CONTROLADOR.
    // SEGUNDO SI SE QUISIERA IMPLEMENTAR EL SISTEMA DE CAMARAS VA SER MAS COMPLEJO IMPLEMENTARLO EN UN ROUTER MIKROTIK
    useEffect(() => {
        dataFromFirebase();
    }, []);
    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: "#34495E" }}>

                <Toolbar>
                    <Typography sx={{ display: { md: 'flex' }, flexGrow: 1 }} variant="h6" component="div">
                        Listado de Dispositivos
                    </Typography>
                    <Typography sx={{ display: { xs: 'none', md: 'flex' } }} variant="h6" component="div">
                        Bienvenido {userState.name} {userState.lastname} !
                    </Typography>
                    <Button sx={{ marginLeft: 2 }} variant="contained" color='error' onClick={cerrarSesion} endIcon={<LogoutIcon />} >SALIR</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ paddingTop: 3 }}>
                <Grid container spacing={2}>
                    <Grid md={4} xs={12}>
                        <div className="card-admin">
                            <div className="header">
                                <p className="nombre-card">Acciones</p>
                            </div>
                            <div className="card-body-controler">
                                <Grid container >
                                    <Grid item xs={12} md={12}>
                                        <Button variant="contained" size="medium" onClick={() => { Changeview('/crear_equipo') }}  >+ CONTROLADOR</Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </Grid>
                    {/* <Grid md={2.5} xs={6}>
                        <div className="card-admin">
                            <div className="header">
                                <p className="nombre-card">Activos</p>
                            </div>
                            <div className="card-body-indicador">
                                <h5 className="number-indicador">10</h5> <PowerIcon fontSize="large" sx={{ color: "#A3E4D7" }} />
                            </div>
                        </div>
                    </Grid>
                    <Grid md={2.5} xs={6}>
                        <div className="card-admin">
                            <div className="header">
                                <p className="nombre-card">Inactivos</p>
                            </div>
                            <div className="card-body-indicador">
                                <h5 className="number-indicador">2</h5> <PowerOffIcon fontSize="large" sx={{ color: "#F5B7B1" }} />
                            </div>
                        </div>
                    </Grid> */}
                    <Grid md={8} xs={12}>
                        <div className="card-controller-filter">
                            <div className="header-controller-filter">
                                <p className="nombre-card">Filtros</p>
                            </div>
                            <div className="card-body-controler">

                                <Grid container >
                                    <Grid item xs={12} md={5}>
                                        <Autocomplete
                                            id="size-small-outlined"
                                            size="small"
                                            options={cantones}
                                            key={reload}
                                            onChange={(event, newValue) => {
                                                setCanton(newValue)
                                            }}

                                            renderInput={(params) => (
                                                <TextField {...params} label="Canton" placeholder="canton" />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Autocomplete
                                            id="size-small-outlined"
                                            size="small"
                                            options={controladores}
                                            key={reload}
                                            onChange={(event, newValue) => {
                                                setModel(newValue)
                                            }}

                                            renderInput={(params) => (
                                                <TextField {...params} label="Modelo" placeholder="modelo" />
                                            )}
                                        />
                                    </Grid>
                                    {/* <Grid item xs={12} md={3.5}>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                        >
                                            <FormControlLabel value="female" control={<Radio />} label="activo" />
                                            <FormControlLabel value="male" control={<Radio />} label="Inactivo" />


                                        </RadioGroup>
                                    </Grid> */}
                                    <Grid item xs={12} md={2}>
                                        <Button variant="contained" size="medium" onClick={filtrarLosDatos}  >FILTRAR</Button>
                                    </Grid>

                                </Grid>

                            </div>
                        </div>
                    </Grid>



                    <Grid md={12}>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                key={"Name"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                                >
                                                Name
                                            </TableCell>
                                            <TableCell
                                                key={"ip"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                                >
                                                Ip
                                            </TableCell>
                                            <TableCell
                                                key={"modelo"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                                >
                                                Modelo
                                            </TableCell>
                                            <TableCell
                                                key={"canton"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                                >
                                                Canton
                                            </TableCell>
                                            <TableCell
                                                key={"acciones"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                                >
                                                Acciones
                                            </TableCell>
                                      
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {controlers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row,index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell align="left">
                                                    {row.nombre}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {row.ip}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {row.modelo}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {row.canton}
                                                </TableCell>
                                                {/* <TableCell align="center">
                                                    <Chip color={row.estado ? 'verde' : 'anaranjado1'} size="small" label={row.estado ? 'conectado' : 'desconectado'} icon={<CableIcon />} />
                                                </TableCell> */}
                                                <TableCell align="center">
                                                    <Stack direction="row" spacing={1}>
                                                        <IconButton color="rojo" aria-label="eliminar" onClick={() => { eliminarController(row) }} >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                        <IconButton color="gris" aria-label="editar" onClick={() => { abrirModalEditar(row) }} >
                                                            <SettingsIcon />
                                                        </IconButton>
                                                        <IconButton color="azulm" aria-label="info" onClick={() => { abrirModalinformacion(row) }}>
                                                            <InfoIcon />
                                                        </IconButton>
                                                        <Button variant="contained" color="oscuro" onClick={() => { programarControlador(row) }} >Programar</Button>
                                                    </Stack>
                                                </TableCell>

                                            </TableRow>);
                                        })}
                                    </TableBody>
                                 
                                </Table>
                            </TableContainer>
                            <TablePagination
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component="div"
                                        count={controlers.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                        </Paper>
                    </Grid>
                </Grid>
                {/*          A partir de esta linea son solo modals            */}
                <Modal isOpen={editarModal} >
                    <ModalHeader>
                        <div>
                            <h1>
                                Ajustes Basicos
                            </h1>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic" label="Nombre:" value={currentController.nombre} onChange={(e) => setCurrentController({ ...currentController, nombre: e.target.value })} fullWidth helperText="Nombre" variant="outlined" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic" label="Ip:" value={currentController.ip} onChange={(e) => setCurrentController({ ...currentController, ip: e.target.value })} fullWidth helperText="Ip" variant="outlined" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic" label="Canton:" value={currentController.canton} onChange={(e) => setCurrentController({ ...currentController, canton: e.target.value })} fullWidth helperText="Canton o Ciudad" variant="outlined" />
                            </Grid>
                        </Grid>
                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" color='primary' onClick={guardarAjustes} sx={{ marginLeft: 1 }}>
                            Guardar
                        </Button>
                        <Button variant="contained" color='rojo' onClick={() => { setEditarModal(false) }} sx={{ marginLeft: 1 }}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={infoModal} >
                    <ModalHeader>
                        <div>
                            <h1>
                                Informacion
                            </h1>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <div>
                                    <strong><h5>Nombre</h5></strong>
                                    <p>{currentController.nombre}</p>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div>
                                    <strong><h5>Canton</h5></strong>
                                    <p>{currentController.canton}</p>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div>
                                    <strong><h5>Latitud</h5></strong>
                                    <p>{currentController.latitud}</p>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div>
                                    <strong><h5>longitud</h5></strong>
                                    <p>{currentController.longitud}</p>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div>
                                    <strong><h5>Ip</h5></strong>
                                    <p>{currentController.ip}</p>
                                </div>
                            </Grid>
                            <Grid item xs={6}>

                                <div>
                                    <strong><h5>Mac</h5></strong>
                                    <p>{currentController.mac}</p>
                                </div>
                            </Grid>
                        </Grid>


                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" color='anaranjado1' onClick={() => { setInfoModal(false) }} sx={{ marginLeft: 1 }}>
                            Aplicar
                        </Button>
                        <Button variant="contained" color='rojo' onClick={() => { setInfoModal(false) }} sx={{ marginLeft: 1 }}>
                            cancelar
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}
let cantones = [
    "CUENCA","GIRON","GUALACEO","NABON","PAUTE","PUCARA","SAN FERNANDO","SANTA ISABEL","SIGSIG","OÑA","CHORDELEG",
    "CHILLANES","GUARANDA","CHIMBO","SAN MIGUEL","AZOGUES","BIBLIÁN","CAÑAR","LA TRONCAL","EL TAMBO","TULCAN","BOLIVAR",
    "ESPEJO","LATACUNGA","PUJILI","SALCEDO","RIOBAMBA","ALAUSI","MACHALA","ARENILLAS","ATAHUALPA","BALSAS","EL GUABO","HUAQUILLAS",
    "PASAJE","PIÑAS","PORTOVELO","SANTA ROSA","ZARUMA","ESMERALDAS","ATACAMES","GUAYAQUIL","QUITO","LOJA","CALVAS","CATAMAYO"
]

let controladores = [
    "HT-200","SW-12"
]