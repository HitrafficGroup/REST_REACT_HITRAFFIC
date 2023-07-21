import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { SideNavMap } from '../dashboard-monitoreo/side-nav-monitoreo';
import { TopNavMap } from '../dashboard-monitoreo/top-nav-monitoreo';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Marker } from "react-leaflet";
import L from 'leaflet';
import c1 from "../assets/c1.png"
import c2 from "../assets/c2.png"
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, getDoc, doc } from "firebase/firestore";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { db } from '../firebase/firebase-config';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import SemaforoCircle from '../components/SemaforoCircle';
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
export default function MonitoreoView() {


    const [zoomMap, setZoomMap] = useState(14)
    const [centerMap, setCenterMap] = useState([-2.9002025261800206, -78.99967753716173])
    const [openNav, setOpenNav] = useState(false);
    const [modalCrear, setModalCrear] = useState(false);
    const [controlers, setControlers] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [semaforos, setSemaforos] = useState([])
    const navigate = useNavigate();

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const getControllersFirebase = async () => {
        const q = query(collection(db, "historial_controladores"));
        let data_firebase = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            data_firebase.push(doc.data());
        });
        setControlers(data_firebase);
        console.log(data_firebase)
    }

    const abrirModalCrear = () => {
        getControllersFirebase();
        setModalCrear(true);

    }
    const addSemaforoMapa = async (__data) => {
        let semaforos_data = []
        const docRef = doc(db, "controladores", __data.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            semaforos_data = docSnap.data().semaforos;
            const db2 = getDatabase();
            let formated_data = {
                g1: semaforos_data.find(element => element.grupo === 'g1'),
                g2: semaforos_data.find(element => element.grupo === 'g2'),
                g3: semaforos_data.find(element => element.grupo === 'g3'),
                g4: semaforos_data.find(element => element.grupo === 'g4'),
            }

            set(ref(db2, '/' + __data.id), formated_data);




        } else {
            console.log("No such document!");
        }
    }

    // useEffect(() => {

    //     getControllersFirebase();
    //     // eslint-disable-next-line
    // }, []);


    return (
        <>
            <TopNavMap onNavOpen={() => setOpenNav(true)} />
            <SideNavMap open={openNav} onClose={() => setOpenNav(false)} onCreate={() => abrirModalCrear()} onExit={() => { navigate('/equipos') }} />
            <div className={"leaflet-container-2"}>
                <MapContainer center={centerMap} zoom={zoomMap} scrollWheelZoom={false} style={{ height: "90vh" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=b08eb869c89646fa8accf539b81e80de" />
                    <SemaforoCircle position={[[-2.8752091719856305,-78.96644325835979],[-2.8750594929680537,-78.96613787779256],[-2.8750594929680537,-78.96627724754657],[-2.874379004517163,-78.96627187923539]]} id={"93feed83-16be-4619-8e20-e80104452f87"} />
                    <SemaforoCircle position={[[-2.8770259433047123,-78.9658532677584],[-2.877401073548548,-78.96544571992743],[-2.8777062913483626,-78.96505965896708],[-2.878054549543885,-78.96453399661098]]} id={"5415737e-0d6c-4d67-8fd4-0082b0829fff"} />
                    <SemaforoCircle position={[[-2.880572853316584,-78.96682965218348],[-2.8808405047965837,-78.96613801794554],[-2.881097668723833, -78.9654460080197],[-2.8813441173205687,-78.96476472303678]]} id={"efed3017-bdeb-4b13-99d8-cf965f11df16"} />
                    <SemaforoCircle position={[[-2.8751236897888544, -78.96880390267657],[-2.875498726301884, -78.96840157135983],[-2.8758630473679134, -78.96781684984617],[-2.8762005800164077, -78.96734478110119]]} id={"8f68ef2c-972a-4aba-9373-ac3f3b480575"} />
                    <Marker position={[-2.8809893651691305, -78.96616792935285]}  icon={controller}/>
                    <Marker position={[-2.8775989285295482, -78.96553428994021]}  icon={controller}/>
                    <Marker position={[-2.8755523029291123, -78.96642478334662]}  icon={controller}/>
                    <Marker position={[-2.8757076751628134, -78.96773101916527]}  icon={controller}/>
                </MapContainer>
            </div>
            <Modal isOpen={modalCrear} size='lg'>
                <ModalHeader>
                    <div>
                        <h5>
                            Declare el semaforo
                        </h5>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
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
                                                    key={"acciones"}
                                                    align={"center"}
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
                                                                {row.nombre}
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                <Android12Switch color="verde2" checked={row.online} />
                                                            </TableCell>
                                                            <TableCell align="left">
                                                                {row.ip}
                                                            </TableCell>
                                                            <TableCell align="center">

                                                                <Button variant="contained" color="azulm" sx={{ marginLeft: 1 }} onClick={() => { addSemaforoMapa(row) }}>
                                                                    seleccionar
                                                                </Button>
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
                </ModalBody>
                <ModalFooter >

                    <Button variant="contained" onClick={() => { setModalCrear(false) }} color="error" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>
        </>

    )


}
const controller = new L.Icon({
    iconUrl: c1,
    iconRetinaUrl:c1,
    iconSize: [30, 30], // size of the icon
    shadowSize: [30, 30], // size of the shadow
    iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76]

});
