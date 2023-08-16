import React, { useEffect, useRef, useState } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { v4 as uuidv4 } from 'uuid';
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
import { setInitialStateControllerHT200, setControllerDataHT200 } from "../features/controlerht200/controlerHT200Slice";
import { getBasicInfoHT200, getDeviceInfoHT200 } from "../js/apiFunctionsHT200";
import Swal from 'sweetalert2';
import { collection, updateDoc, doc, onSnapshot, query, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
//
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Autocomplete from '@mui/material/Autocomplete';
import SettingsIcon from '@mui/icons-material/Settings';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
//

import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { TopNavEquipos } from "../dashboard-equipos/top-nav-equipos";
import { SideNavEquipos } from "../dashboard-equipos/side-nav-equipos";
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
    const [openNav, setOpenNav] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [controlers, setControlers] = useState(dataTest);
    const [currentController, setCurrentController] = useState({});
    const [reload, setReload] = useState(true);
    const [model, setModel] = useState('');
    const [canton, setCanton] = useState('');
    const userState = useSelector(state => state.auth);
    const [deshabilitar, setDeshabilitar] = useState(false);
    const [modalCrear, setModalCrear] = useState(false);
    const respaldoData = useRef([])
    const ipControlador = useRef('')
    const navigate = useNavigate(); // hook para navegar entre urls o vistas
    const dispatch = useDispatch();
    const [nombreControlador, setNombreControlador] = useState("");
    const [ip, setIp] = useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);


    function validateIp(ip) {
        var patronIp = new RegExp("^([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})$");
        var valores;

        // early return si la ip no tiene el formato correcto.
        if (ip.search(patronIp) !== 0) {
            return false
        }

        valores = ip.split(".");

        return valores[0] <= 255 && valores[1] <= 255 && valores[2] <= 255 && valores[3] <= 255
    }
    const Android12Switch = styled(Switch)(({ theme }) => ({
        padding: 8,
        '& .MuiSwitch-track': {
            backgroundColor: theme.palette.rojo.main,
            borderRadius: 22 / 2,
            '&:before, &:after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,

            },
            '&:before': {
                left: 12,

            },
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
            '&:after': {

                right: 12,

            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: 'none',
            width: 16,
            height: 16,
            margin: 2,

        },
    }));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };



    const filtrarLosDatos = () => {

        let aux_data = JSON.parse(JSON.stringify(respaldoData.current))
        let filterData = aux_data.filter(filterByCanton).filter(filterByModel)
        setControlers(filterData)
        setReload(!reload)
        setCanton("")
        setModel("")
    }

    const filterByCanton = (item) => {
        if (canton !== "") {
            if (item.canton === canton) {
                return item;
            } else {
                return null;
            }
        } else {
            return item;
        }

    }
    const filterByModel = (item) => {
        if (model !== "") {
            if (item.modelo === model) {
                return item;
            } else {
                return null;
            }
        } else {
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

        const ref = doc(db, "historial_controladores", currentController.id);
        await updateDoc(ref, currentController);
        const ref2 = doc(db, "controladores", currentController.id);
        await updateDoc(ref2, currentController);
        setEditarModal(false)

    }
    //mostrar la interfaz de acuerdo al controlador
    const programarControlador = async (_equipo) => {
        setDeshabilitar(true)
        const docRef = doc(db, "controladores", _equipo.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {

            let aux_equipo = JSON.parse(JSON.stringify(_equipo))
            let equipo_info = docSnap.data()
            let conexiones = equipo_info.historial_conexiones;
            let fecha = new Date().toLocaleString('es-CO', { dateStyle: 'full', timeStyle: 'medium' })
            conexiones.push({
                id: userState.id,
                name: userState.name,
                email: userState.email,
                lastname: userState.lastname,
                fecha: fecha
            })
            equipo_info['historial_conexiones'] = conexiones

            if (_equipo.modelo === "HT-200") {
                dispatch(setInitialStateControllerHT200(aux_equipo));
                if (equipo_info.fases.length > 0 && equipo_info.secuencias.length > 0 && equipo_info.split.length > 0 && equipo_info.pattern.length > 0 && equipo_info.acciones.length > 0 && equipo_info.plan.length > 0 && equipo_info.horarios.length > 0) {
                    dispatch(setControllerDataHT200(equipo_info));
                }

                const ref = doc(db, "historial_controladores", _equipo.id);
                await updateDoc(ref, {
                    ultima_conexion: fecha,
                });
                const ref2 = doc(db, "controladores", _equipo.id);
                await updateDoc(ref2, {
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
                });
                const ref2 = doc(db, "controladores", _equipo.id);
                await updateDoc(ref2, {
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



    
    //logica de declaracion del controlador
    const declararControlador = async () => {
        Swal.fire({
            title: 'Creacion de controlador',
            text: "Se va a crear el siguiente controlador",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let ip_target = validateIp(ip);
                let existe_controlador = controlers.find(item => item.ip === ip)
               
                if (ip_target === false || existe_controlador !== undefined) {
                    Swal.fire(
                        'Ip Error',
                        'Ip ya Declarada o digite corectamente la Ip!',
                        'error'
                    )
                } else {
                    if (nombreControlador !== "" && model === "SW-12") {
                        let id_controller = uuidv4()
                        let parametrosIniciales = {
                            // parametros inicializados por defecto
                            id: id_controller,
                            t_fases: 1667372400000,
                            t_horarios: 1667372400000,
                            t_peticion: 1667372400000,
                            t_planes: 1667372400000,
                            // parametros que se iran llenando conforme actualice el controlador
                            conflictos_verdes: {},
                            dias_especiales: {},
                            fases: {},
                            grupos: {},
                            horario_ordinario: [],
                            horario_finsemana: [],
                            horario_festivo: [],
                            semaforos: [],
                            otros_parametros: {},
                            plan_1: [],
                            plan_2: [],
                            plan_3: [],
                            plan_4: [],
                            plan_5: [],
                            plan_6: [],
                            plan_7: [],
                            plan_8: [],
                            latitud: parseFloat(-2.876428),
                            longitud: parseFloat(-78.965342),
                            //nuevos parametros agregados
                            nombre: nombreControlador,
                            ip: ip,
                            historial_conexiones: [],
                            modelo: model,
                            planificacion: [],
                        }
                        let historialControladorData = {
                            id: id_controller,
                            nombre: nombreControlador,
                            ultima_conexion: '',
                            latitud: parseFloat(-2.876428),
                            longitud: parseFloat(-78.965342),
                            ip: ip,
                            mac: "",
                            canton: canton,
                            online: true,
                            modelo: model,

                        }


                        try {
                      
                      
                            await setDoc(doc(db, "controladores", id_controller), parametrosIniciales);
                            await setDoc(doc(db, "historial_controladores", id_controller), historialControladorData);
                            Swal.fire(
                                'Exito',
                                'Controlador Declarado! ',
                                'success'
                            )
                      
                        } catch (error) {
                            Swal.fire(
                                'Error',
                                `Error: ${error}`,
                                'error'
                            )
                       
                        }
                    }
                    else if (nombreControlador !== "" && model === "HT-200") {
                        try {
                            setDeshabilitar(true)
                            let params_iniciales = await getBasicInfoHT200(ip);
                            let pos_inicial = await getDeviceInfoHT200(ip);
                            console.log(pos_inicial)
                            let id_controller = uuidv4()
                            let parametrosIniciales = {
                                // parametros inicializados por defecto
                                latitud: parseFloat(pos_inicial.latitud),
                                longitud: parseFloat(pos_inicial.longitud),
                                id: id_controller,
                                semaforos: [],
                                // parametros que se iran llenando conforme actualice el controlador
                                fases: [],
                                secuencias: [],
                                split: [],
                                pattern: [],
                                acciones: [],
                                plan: [],
                                horarios: [],
                                channel: [],
                                //nuevos parametros
                                ip: ip,
                                historial_conexiones: [],
                                modelo: model,
                                planificacion: [],
                                nombre: nombreControlador,

                            }
                            let historialControladorData = {
                                id: id_controller,
                                nombre: nombreControlador,
                                ultima_conexion: 'Dispositivo creado recientemente',
                                latitud: parseFloat(pos_inicial.latitud),
                                longitud: parseFloat(pos_inicial.longitud),
                                ip: ip,
                                mac: params_iniciales.mac_target,
                                canton: canton,
                                online: false,
                                modelo: model,
                            }
                           
                            try {
                                console.log(historialControladorData)
                            
                                await setDoc(doc(db, "controladores", id_controller,), parametrosIniciales);
                                await setDoc(doc(db, "historial_controladores", id_controller,), historialControladorData);
                                setDeshabilitar(false);
                                setModalCrear(false);
                                Swal.fire(
                                    'Exito',
                                    'Controlador Declarado! ',
                                    'success'
                                )
                                

                            } catch (error) {
                                setDeshabilitar(false)
                                Swal.fire(
                                    'Error',
                                    `Error: No se puede conectar con la base de datos`,
                                    'error'
                                )
                                
                            }
                        } catch (error) {
                            setDeshabilitar(false)
                            Swal.fire(
                                'Error',
                                `Controlador sin respuesta de conexión`,
                                'error'
                            )
                        }





                    }
                    else {
                        Swal.fire(
                            'Faltan campos',
                            'Llene todos los campos del controlador ! ',
                            'warning'
                        )
                    }
                }
            }
        })
    }

    useEffect(() => {
        dataFromFirebase();
    }, []);
    return (
        <>
           <TopNavEquipos onNavOpen={() => setOpenNav(true)}/>
           <SideNavEquipos open={openNav} onClose={() => setOpenNav(false)}/>
            <Container maxWidth="xl" sx={{ paddingTop: 3 }}>
                <Grid container spacing={2}>
                    <Grid xs={12} md={8}>
                        <div className="card-controller-filter">
                            <div className="header-controller-filter">
                                <p className="nombre-card">Lista de Controladores Registrados</p>
                            </div>
                            <div className="card-body-controler">
                                <Grid container >
                                    <Grid item xs={6} md={2}>
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
                                    <Grid item xs={6} md={2}>
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
                                    <Grid item xs={12} md={4}>
                                        <Button variant="contained" size="medium" fullWidth onClick={filtrarLosDatos}  >FILTRAR</Button>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Button variant="contained" size="medium" fullWidth onClick={() => { setModalCrear(true) }}  >CREAR CONTROLADOR</Button>
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
                                                key={"last"}
                                                align={"left"}
                                                style={{ minWidth: 200 }}
                                            >
                                                Último acceso al dispositivo
                                            </TableCell>
                                            <TableCell
                                                key={"Name"}
                                                align={"left"}
                                                style={{ minWidth: 200 }}
                                            >
                                                Nombre
                                            </TableCell>
                                            <TableCell
                                                key={"online"}
                                                align={"left"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Online
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
                                                CANTÓN
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
                                            .map((row, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell align="left">
                                                            {row.ultima_conexion}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {row.nombre}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Android12Switch color="verde2" checked={row.online} />
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

                                                        <TableCell align="center">
                                                            <Stack direction="row" spacing={1}>
                                                                <IconButton  color="rojo" aria-label="eliminar" onClick={() => { eliminarController(row) }} >
                                                                    <DeleteIcon />
                                                                
                                                                </IconButton>
                                                                <IconButton aria-label="editar" onClick={() => { abrirModalEditar(row) }} >
                                                                    <SettingsIcon />
                                                                </IconButton>
                                                                <IconButton color="anaranjado1" aria-label="info" onClick={() => { abrirModalinformacion(row) }}>
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

                        <Button variant="contained" color="rojo" onClick={() => { setInfoModal(false) }} sx={{ marginLeft: 1 }}>
                            salir
                        </Button>
                    </ModalFooter>
                </Modal>

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
                                <TextField id="outlined-basic" label="Nombre:" value={currentController.nombre} onChange={(e) => setCurrentController({ ...currentController, nombre: e.target.value })} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic" label="Ip:" value={currentController.ip} onChange={(e) => setCurrentController({ ...currentController, ip: e.target.value })} fullWidth  />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField id="outlined-basic" label="Canton:" value={currentController.canton} onChange={(e) => setCurrentController({ ...currentController, canton: e.target.value })} fullWidth />
                            </Grid>
                        </Grid>
                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" color='primary' onClick={guardarAjustes} sx={{ marginLeft: 1 }}>
                            Guardar
                        </Button>
                        <Button variant="contained" color="rojo" onClick={() => { setEditarModal(false) }} sx={{ marginLeft: 1 }}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalCrear} >
                    <ModalHeader>
                        <div>
                            <h5>
                                Formulario de declaración de controladores
                            </h5>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Ip" name="ip" required onChange={(e) => { setIp(e.target.value) }} value={ip} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth label="Nombre del Controlador" name="nombre" required onChange={(e) => { setNombreControlador(e.target.value) }} value={nombreControlador} />
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    id="size-small-outlined"
                                    size="medium"
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
                            <Grid item xs={6}>
                                <Autocomplete
                                    id="size-small-outlined"
                                    size="medium"
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

                        </Grid>
                    </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" color="primary" onClick={() => { declararControlador() }} sx={{ marginLeft: 1 }}>
                            crear
                        </Button>
                        <Button variant="contained" color="error" onClick={() => { setModalCrear(false) }} sx={{ marginLeft: 1 }}>
                            salir
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 10 }} open={deshabilitar}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}
let cantones = [
    "CUENCA", "GIRON", "GUALACEO", "NABON", "PAUTE", "PUCARA", "SAN FERNANDO", "SANTA ISABEL", "SIGSIG", "OÑA", "CHORDELEG",
    "CHILLANES", "GUARANDA", "CHIMBO", "SAN MIGUEL", "AZOGUES", "BIBLIÁN", "CAÑAR", "LA TRONCAL", "EL TAMBO", "TULCAN", "BOLIVAR",
    "ESPEJO", "LATACUNGA", "PUJILI", "SALCEDO", "RIOBAMBA", "ALAUSI", "MACHALA", "ARENILLAS", "ATAHUALPA", "BALSAS", "EL GUABO", "HUAQUILLAS",
    "PASAJE", "PIÑAS", "PORTOVELO", "SANTA ROSA", "ZARUMA", "ESMERALDAS", "ATACAMES", "GUAYAQUIL", "QUITO", "LOJA", "CALVAS", "CATAMAYO"
]

let controladores = [
    "HT-200"
]
// de momento solo se crearan controladores HT200 hasta terminar de configurar la vista HT200