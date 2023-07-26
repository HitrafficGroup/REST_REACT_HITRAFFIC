import React, { useState, useEffect } from "react";

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { getPatternHT200, PostPatternHT200 } from "../js/apiFunctionsHT200";
import { collection, query, getDocs, onSnapshot, updateDoc, doc,getDoc } from "firebase/firestore";
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { setModoManual } from '../js/apiFunctionsHT200';
import { db } from "../firebase/firebase-config";
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import { generatePatternFrame } from "../js/generateFrameApiHT200";
//
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PanToolIcon from '@mui/icons-material/PanTool';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { SideNavMaster } from "../dashboard-master/side-nav-master";
import { TopNavMaster } from "../dashboard-master/top-nav-master";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function VistaMaestraView() {
    const [tiempo, setTiempo] = useState(30)
    const [openNav, setOpenNav] = useState(false);
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [controladores, setControladores] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [desfase, setDesfase] = useState(0);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function not(a, b) {
        return a.filter((value) => b.indexOf(value) === -1);
    }
    function intersection(a, b) {
        return a.filter((value) => b.indexOf(value) !== -1);
    }

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    function union(a, b) {
        return [...a, ...not(b, a)];
    }


    const readData = () => {

        const q = query(collection(db, "historial_controladores"));

        onSnapshot(q, (querySnapshot) => {
            let data_firebase = []
            querySnapshot.forEach((doc) => {

                data_firebase.push(doc.data());
            });
            let data_filter = data_firebase.filter(item => item.modelo === "HT-200" && item.online === true)
            let modify_data = data_filter.map(item => {
                let temp = {
                    nombre: item.nombre,
                    ip: item.ip,
                    id: item.id,
                    online: item.online,
                    selected: false,
                }
                return temp;
            })
            console.log(modify_data);
            setControladores(modify_data);
            setLeft(modify_data);
            setRight([])
        });
    }

    const updateFirebase = async (ip) => {
        const ref = doc(db, "controladores", ip);
        let aux_data = {}
        aux_data['planificacion'] = {}
        await updateDoc(ref, aux_data);
    }
    const seleccionarControlador = (__data) => {
        let aux_controllers = JSON.parse(JSON.stringify(controladores))
        let modify_controllers = aux_controllers.map((item) => {
            if (item.id === __data.id) {
                item.selected = !item.selected
            }
            return item
        })
        setControladores(modify_controllers);
    }

    const cargarOlaVerde = async () => {
        let offset = parseInt(desfase)
        let init_offset = 0
        right.forEach(async(item)=>{
            const ref = doc(db, "controladores", item.id);
            const docSnap = await getDoc(ref);
            if (docSnap.exists()) {
                // Convert to City object
                const controller = docSnap.data();
                let patron = controller.pattern
                
                patron.forEach(item=>{
                    item.offsettime = init_offset
                })
                let array_data = generatePatternFrame(patron)
                await PostPatternHT200({trama:array_data,ip:item.ip})
                init_offset = init_offset + offset
                
                // Use a City instance method
              } else {
                console.log("No such document!");
              }
              
         
        })
        // let array_data = []

        // array_data = generatePatternFrame(__data.trama)
        // 
        // //updateFirebase('pattern',data)

    }

    const traerDatosFirebase = async () => {
        let data_firebase = []
        
    }

    const modoManual = async (__param) => {
        let aux_p = 49
        if (__param === 0) {
            aux_p = 48
        }
        let tiempo_modo = parseInt(tiempo)
        let aux_1 = tiempo_modo & 0xff
        let aux_2 = (tiempo_modo >> 8) & 0xff
        let array_data = [15, 1, aux_p, __param, 0, 0, aux_1, aux_2]
        let datos = JSON.parse(JSON.stringify(controladores))
        let filter_data = datos.filter(item => item.selected === true);
        filter_data.forEach(async (item) => {
            console.log(item.ip)
            await setModoManual({ trama: array_data, ip: item.ip });
        })


    }


    const customList = (title, items) => (
        <Card>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{
                    width: 350,
                    height: 350,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value, index) => {
                    const labelId = `transfer-list-all-item-${value.index}-label`;

                    return (
                        <ListItem
                            key={index}
                            role="listitem"
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <div className='label-clonacion'>
                                <ListItemText id={labelId} primary={value.nombre} />
                                <Typography variant="caption" display="block" gutterBottom>
                                    {value.ip}
                                </Typography>
                            </div>

                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );


    useEffect(() => {
        readData();
        //eslint-disable-next-line
    }, []);
    return (
        <>

            <TopNavMaster onNavOpen={() => setOpenNav(true)} />
            <SideNavMaster open={openNav} onClose={() => setOpenNav(false)} />
            <Container maxWidth="lg" sx={{ paddingTop: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                            Control Manual de multiples controladores
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <TextField
                                    id="outlined-number"
                                    label="Tiempo para finalizar modo Manual"
                                    type="number"
                                    onChange={(event) => { setTiempo(event.target.value) }}
                                    value={tiempo}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" onClick={() => { modoManual(48) }} fullWidth color='amarillo' startIcon={<OnlinePredictionIcon />}>
                                    Destello
                                </Button>
                            </Grid>
                            <Grid item xs={12} >
                                <Button variant="contained" onClick={() => { modoManual(49) }} fullWidth color='rojo' startIcon={<ReportGmailerrorredIcon />}>
                                    Todo en Rojo
                                </Button>
                            </Grid>
                            <Grid item xs={12} >
                                <Button variant="contained" onClick={() => { modoManual(50) }} fullWidth color="oscuro" startIcon={<PowerOffIcon />}>
                                    Apagado
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" onClick={() => { modoManual(51) }} color="oscuro" fullWidth startIcon={<SkipNextIcon />}>
                                    Siguiente Paso
                                </Button>
                            </Grid>
                            <Grid item xs={12} >
                                <Button variant="contained" onClick={() => { modoManual(52) }} color="oscuro" fullWidth startIcon={<PanToolIcon />}>
                                    Mantenerse el Paso
                                </Button>
                            </Grid>
                            <Grid item xs={12} >
                                <Button variant="contained" onClick={() => { modoManual(0) }} color="oscuro" fullWidth startIcon={<SmartToyIcon />}>
                                    Pasar a  automatico
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Container maxWidth="md" >
                            <Paper sx={{ width: '100%', mb: 2 }}>

                                <TableContainer sx={{ maxHeight: 440 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    key={"id"}
                                                    align={"center"}
                                                >
                                                    Nombre
                                                </TableCell>
                                                <TableCell
                                                    key={"hora"}
                                                    align={"center"}
                                                >
                                                    IP
                                                </TableCell>
                                                <TableCell
                                                    key={"acciones"}
                                                    align={"center"}
                                                >
                                                    Seleccionar
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {controladores
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {
                                                    return (
                                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                            <TableCell align={"center"}>
                                                                {row.nombre}
                                                            </TableCell>
                                                            <TableCell align={"center"}>
                                                                {row.ip}
                                                            </TableCell>
                                                            <TableCell align={"center"}>
                                                                <Checkbox
                                                                    onClick={() => { seleccionarControlador(row) }}
                                                                    checked={row.selected}
                                                                    tabIndex={-1}
                                                                    disableRipple
                                                                    inputProps={{
                                                                        'aria-labelledby': 1,
                                                                    }}
                                                                />
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
                                    count={controladores.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>

                        </Container>

                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Typography variant="h5" gutterBottom>
                            Configuracion de ola verde manual
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Grid container spacing={2}>

                            <Grid item xs={12} >
                                <TextField
                                    id="outlined-number"
                                    label="Desfase de Ola Verde"
                                    type="number"
                                    size="small"
                                    value={desfase}
                                    onChange={(event) => { setDesfase(event.target.value) }}
                                    fullWidth
                                    sx={{ marginRight: 2 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button fullWidth variant="outlined" sx={{ height: '100%' }} onClick={cargarOlaVerde} >CREAR OLA VERDE</Button>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Container maxWidth="md" >
                            <Grid container spacing={2} justifyContent="center" alignItems="center">

                                <Grid item xs={12} md={5}>{customList('Dispositivos Disponibles', left)}</Grid>
                                <Grid item xs={12} md={2}>
                                    <Grid container direction="column" alignItems="center">
                                        <Button
                                            sx={{ my: 0.5 }}
                                            variant="outlined"
                                            size="small"
                                            onClick={handleCheckedRight}
                                            disabled={leftChecked.length === 0}
                                            aria-label="move selected right"
                                        >
                                            &gt;
                                        </Button>
                                        <Button
                                            sx={{ my: 0.5 }}
                                            variant="outlined"
                                            size="small"
                                            onClick={handleCheckedLeft}
                                            disabled={rightChecked.length === 0}
                                            aria-label="move selected left"
                                        >
                                            &lt;
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={5}>{customList('Dispositivos Seleccionados', right)}</Grid>
                            </Grid>
                        </Container>

                    </Grid>

                </Grid>
            </Container>
        </>
    )

}
