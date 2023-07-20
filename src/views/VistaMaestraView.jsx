import React, { useState } from "react";

import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';

import { collection, query, getDocs } from "firebase/firestore";
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
//
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PanToolIcon from '@mui/icons-material/PanTool';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { SideNavMaster } from "../dashboard-master/side-nav-master";
import { TopNavMaster } from "../dashboard-master/top-nav-master";
export default function VistaMaestraView() {
    const [tiempo, setTiempo] = useState(30)
    const [openNav, setOpenNav] = useState(false);
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);



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


    const readData = async () => {
        const q = query(collection(db, "controladores"));
        let data_firebase = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            data_firebase.push(doc.data())
        });
        let data_filter = data_firebase.filter(item => item.modelo === "HT-200")
        let modify_data = data_filter.map(item => {
            let temp = {
                nombre: item.nombre,
                ip: item.ip,
                id: item.id,
            }
            return temp;
        })
        console.log(modify_data)

        setLeft(modify_data)
        setRight([])


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
        right.forEach(async(item)=>{
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

    return (
        <>
                
            <TopNavMaster onNavOpen={() => setOpenNav(true)}/>
            <SideNavMaster open={openNav} onClose={() => setOpenNav(false)}/>
            <Container maxWidth="lg" sx={{ paddingTop: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>
                            Control Maestro
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button variant="contained" onClick={readData} fullWidth color='verde'>Leer Datos</Button>
                            </Grid>
                            <Grid item xs={12} >

                            <TextField
                                                    id="outlined-number"
                                                    label="Tiempo para finalizar modo Manual"
                                                    type="number"
                                                    onChange={(event)=>{setTiempo(event.target.value)}}
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
                    <Grid item xs={9}>
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


                                <Grid item xs={12} md={12}>
                                    <div style={{ height: 8 }}>
                                    </div>
                                </Grid>
                            </Grid>
                        </Container>
                    </Grid>
                </Grid>
            </Container>
        </>
    )

}
