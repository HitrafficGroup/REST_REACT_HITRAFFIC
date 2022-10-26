import { React, useEffect, useState } from "react"
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { collection, query, onSnapshot,updateDoc,doc } from "firebase/firestore";
import Grid from '@mui/material/Grid';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import TextField from '@mui/material/TextField';
import { db } from "../firebase/firebase-config";
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import UpdateIcon from '@mui/icons-material/Update';
import CustomMap from "../components/CustomMap";
import "../css/HomeView.css"
import CustomProgress from "../components/CustomProgress";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
const semaforos = [
    {
        nombre: "semaforo de las americas",
        lat: "-23.12312",
        lng: "-34.2321421",
        rojo: 15,
        amarillo:2,
        verde:50,
        fase: 1,
    },
    {
        nombre: "semaforo de las shiris",
        lat: "-23.12312",
        lng: "-8.2321421",
        rojo: 15,
        amarillo:2,
        verde:10,
        fase: 1,
    },
    {
        nombre: "semaforo de pumapugo",
        lat: "-23.12312",
        lng: "-21.2321421",
        rojo: 40,
        amarillo:2,
        verde:30,
        fase: 5,
    },
    {
        nombre: "semaforo mariscal lamar",
        lat: "-2.12312",
        lng: "-1.2321421",
        rojo: 10,
        amarillo:2,
        verde:30,
        fase: 3,
    }
]

export default function HomeView() {
    const [controladres, setControladores] = useState([]);
    const [modalSemaforo,setModalSemaforo] = useState(false);
    const [currentSemaforo,setCurrentSemaforo] = useState({});
    const [modal, setModal] = useState(false);
    const [accionesUi,setAccionesUi] = useState({});

    const toggle = () => setModal(!modal);
    const getData = () => {
        const reference = query(collection(db, "controladores"));
        onSnapshot(reference, (querySnapshot) => {
            var devices = [];
            querySnapshot.forEach((doc) => {
                devices.push(doc.data());
            });
            setControladores(
                devices
            );

        });
        const unsub = onSnapshot(doc(db, "actions", "qaBT2QgWep5LFroiBXcW"), (doc) => {
            console.log("Current data: ", doc.data());
            setAccionesUi( doc.data())
        });

    }
    const abrirSemaforoModal = (data) => {
        console.log(data);
        setCurrentSemaforo(data);
        setModalSemaforo(true);

    }
    const cerrarSemaforoModal = (data) => {
       
        setModalSemaforo(false);
    }
    const leerApiPython = async()=>{
        const washingtonRef = doc(db, "actions", "qaBT2QgWep5LFroiBXcW");
        // Set the "capital" field of the city 'DC'
        await updateDoc(washingtonRef, {
        lectura: true
        });
    }
    useEffect(() => {
        getData();
    }, [])
    return (
        <div>
            <Container maxWidth="md">
                <h2>Lista De Controladores</h2>
                <Button variant="contained" disabled={accionesUi.lectura} endIcon={<CloudDownloadIcon />}  onClick={leerApiPython}  sx={{ marginBottom: 2 }}>
                    Listar Controladores
                </Button>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Table className='home-t'>
                            <Thead>
                                <Tr>
                                    <Th className='home-t-th'>#</Th>
                                    <Th className='home-t-th'>Acciones</Th>
                                    <Th className='home-t-th'>Ip</Th>
                                    <Th className='home-t-th'>Mac</Th>
                                    <Th className='home-t-th'>Nombre</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {controladres.filter(item=> item.status === true).map((dato, index) => (
                                    <Tr key={index} >
                                        <Td>
                                            {index + 1}
                                        </Td>
                                        <Td >
                                            <Button variant="contained" onClick={toggle} >SELECCIONAR</Button>
                                        </Td>
                                        <Td >
                                            {dato.ip}
                                        </Td>
                                        <Td >
                                            {dato.mac}
                                        </Td>
                                        <Td >
                                            {dato.nombre}
                                        </Td>

                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Grid>
                <Grid item md={12}>
                    <div className="h-controler-select">
                    <h5>Controlador Seleccionado: </h5>
                    </div>
                </Grid>
                <Grid item xs={12} md={8}>
                <TextField id="outlined-basic" label="Tiempo Umbral de Cache" variant="outlined" fullWidth/>
                </Grid>
                <Grid item xs={12}  md={4}  >
                <Button variant="contained" startIcon={<UpdateIcon />}  fullWidth sx={{height: "100%",backgroundColor:"#52BE80"}}>ACTUALIZAR</Button>
                </Grid>
                <Grid item xs={12} md={12}>
                    <div className="map">
                        <CustomMap/>
                    </div>
                </Grid>
                    <Grid item xs={12}>
                        <Table className='home-t'>
                            <Thead>
                                <Tr>
                                    <Th className='home-t-th'>#</Th>
                                    <Th className='home-t-th'>Semaforo</Th>
                                    <Th className='home-t-th'>Indicador en Segundos</Th>
                                    <Th className='home-t-th'>Editar</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {semaforos.map((dato, index) => (
                                    <Tr key={index} >
                                        <Td>
                                            {index + 1}
                                        </Td>
                                        <Td >
                                        {dato.nombre}
                                        </Td>
                                        <Td >
                                        <CustomProgress   red={dato.rojo} yellow={dato.amarillo} green={dato.verde} />
                                        </Td>
                                       
                                        <Td >
                                        <Button variant="contained" sx={{backgroundColor:"#F0B27A",marginLeft:2}}  onClick={()=>{abrirSemaforoModal(dato)}} >EDITAR</Button>
                                        </Td>
                                
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Grid>
                    <Grid item xs={12}>
                    <div className="home-view-footer">
                            
                    </div>
                    </Grid>
                </Grid>
                <Modal isOpen={modalSemaforo} >
                    <ModalHeader>
                        <div>
                            <h1>
                                Ajustes del Semaforo
                            </h1>
                        </div>
                    </ModalHeader>
                            <ModalBody>
                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                    <TextField id="outlined-basic" value={currentSemaforo.rojo} label="Tiempo en Rojo" variant="outlined" fullWidth/>
                                    </Grid>
                                    <Grid item xs={12}>
                                    <TextField id="outlined-basic"  value={currentSemaforo.amarillo} label="Tiempo en Amarillo" variant="outlined" fullWidth/>
                                    </Grid>
                                    <Grid item xs={12}>
                                    <TextField id="outlined-basic"  value={currentSemaforo.verde}  label="Tiempo en Verde" variant="outlined" fullWidth/>
                                    </Grid>
                                </Grid>
                            </ModalBody>
                    <ModalFooter >
                        <Button variant="contained" onClick={cerrarSemaforoModal} sx={{backgroundColor:"#F0B27A",marginLeft:1}}>
                            Aplicar
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
            <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Do Something
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

        </div>
    );

}