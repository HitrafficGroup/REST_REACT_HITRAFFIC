import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { SideNavMap } from '../dashboardMap/side-nav-map';
import { TopNavMap } from '../dashboardMap/top-nav-map';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase-config';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
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
    const [controlers,setControlers] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const navigate = useNavigate();
    
    let area_1 = [-2.8769991199778535, -78.96591776340865]
    const fillBlueOptions = { color: 'red' }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const getControllersFirebase=async()=>{
        const q = query(collection(db, "historial_controladores"));
        let data_firebase = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          data_firebase.push(doc.data());
        });
        setControlers(data_firebase);
    }

    const abrirModalCrear =()=>{
        getControllersFirebase();
        setModalCrear(true);

    }
    

    return (
        <>
            <TopNavMap onNavOpen={() => setOpenNav(true)} />
            <SideNavMap open={openNav} onClose={() => setOpenNav(false)} onCreate={()=> abrirModalCrear()} onExit={()=>{navigate('/equipos')}}/>
            <div className={"leaflet-container-2"}>
                <MapContainer center={centerMap} zoom={zoomMap}  scrollWheelZoom={false} style={{ height: "90vh" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=b08eb869c89646fa8accf539b81e80de" />
                    <Circle center={area_1} pathOptions={fillBlueOptions} radius={6} />
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
                                                            
                                                        <Button variant="contained" color="azulm" sx={{ marginLeft: 1 }}>
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
                  
                    <Button variant="contained" onClick={() => { setModalCrear(false) }} color="azulm" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>
        </>
        
    )


}