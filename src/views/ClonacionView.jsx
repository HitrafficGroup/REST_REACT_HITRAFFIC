import CardInformation from '../components/CardInformation';
import CardController from "../components/CardController";
import Container from '@mui/material/Container';
import "../css/ClonacionView.css";
import { getIpsFromRestApi, setClonarControlador } from '../js/apiFunctions';
import { useSelector } from 'react-redux';
import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { db } from "../firebase/firebase-config";
import { getDoc, doc } from "firebase/firestore";
import Swal from 'sweetalert2';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}


export default function ClonacionView() {
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState(datosIniciales1);
    const [right, setRight] = React.useState(datosIniciales2);
    const controlerState = useSelector(state => state.controlers);
    const [deshabilitar, setDeshabilitar] = React.useState(true);
    const [deshabilitar2, setDeshabilitar2] = React.useState(false);
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
    const obtenerIps = async () => {
        try {
            setDeshabilitar2(true);
            setRight([])
            let ips = await getIpsFromRestApi();
            console.log(ips)
            let ips_online = ips['Ips_disponibles']
            let ips_disponibles = ips_online.filter(item => item.mac !== controlerState.mac)
            let ips_formateadas = ips_disponibles.map((item, index) => {
                item["index"] = index
                return item
            })
            console.log(ips_formateadas)
            setLeft(ips_formateadas)
            setDeshabilitar(false)
            setDeshabilitar2(false);
        } catch (error) {
            setDeshabilitar2(false)
        }
    }
    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

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

    const convertirPlanes = (_planes)=>{
        let planes_converted = []
        for (let k =0; k<_planes.length;k++){
            let _paso = _planes[k].pasos
            var newData = {}
            var j = 0
            newData['num_plan'] = returnNumPlan(_planes[k].numPlan)
            newData['clonable'] = false
            for(let i = 0 ;i<12;i++){
                newData['data'+j] = _paso[i].fase.toString()
                newData['data'+(1+j)] = _paso[i].duracion.toString()
                if(_paso[i].duracion.toString()!== "0"){
                    newData['clonable'] = true
                }

                j += 2;
            }
            planes_converted.push(newData)
        }
        return planes_converted
    }
    const returnNumPlan = (data) =>{
        for(let i = 1 ; i<=16;i++){
            var condition = 'plan'+i
            if(data === condition){
                return i
            }
        }
       }
    const convertirHorarios = (_data) =>{
        let newObject = {}
        for (let num = 0; num < 16; num++) {
            let mod = _data[num].mod
            let plan = _data[num].plan
            mod = parseInt(mod).toString(2)
            plan = parseInt(plan).toString(2)
            let bits_faltantes_mod = 3 - mod.length
            let bits_faltantes_plan = 5 - plan.length
            for (let bit = 0; bit < bits_faltantes_mod; bit++) {
                mod = "0" + mod
            }
            for (let bit = 0; bit < bits_faltantes_plan; bit++) {
                plan = "0" + plan
            }
            let mod_plan = mod + plan
            mod_plan = parseInt(mod_plan, 2)
            let horas = _data[num].horas
            let minutos = _data[num].minutos
            newObject['hora' + (num + 1)] = parseInt(horas, 16).toString()
            newObject['minuto' + (num + 1)] = parseInt(minutos, 16).toString()
            newObject['desfase' + (num + 1)] = _data[num].desfase
            newObject['mod_plan' + (num + 1)] = mod_plan.toString()
        }
        return newObject
    }
    const convertirFases = (fases) =>{
        let lista_datos = []
        let datos_fases = {}
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
        return datos_fases
    }
    const clonarEquipos = async () => {
        if (right.length > 0) {
            try {
                setDeshabilitar2(true);
                let jasonData = {
                    ip: controlerState.ip,
                    lista_controladores: [],
                    mac: controlerState.mac
                }
                let destino = right
                let destino_format = destino.map(item => (
                    {
                        ip: item.ip,
                        mac: item.mac
                    }
                ))
                jasonData["lista_controladores"] = destino_format;
                let docRef = doc(db, "controladores", `${controlerState.mac}`);
                let document = await getDoc(docRef);
                let planes = document.data().planes
                let horarios = document.data().horarios
                let fases = document.data().fases
                let aux_ordinario =  convertirHorarios(horarios['dia_ordinario'])
                let aux_festivo = convertirHorarios(horarios['dia_festivo'])
                let aux_fin_semana = convertirHorarios(horarios['fin_semana'])  
                let planes_formated = convertirPlanes(planes)
                let fases_formated = convertirFases(fases)
                let horarios_format = {
                    dia_ordinario:aux_ordinario,
                    dia_festivo:aux_festivo,
                    fin_semana:aux_fin_semana
                }
                jasonData["horarios"] = horarios_format;
                jasonData["planes"] = planes_formated;
                jasonData["fases"] = fases_formated;
                console.log(jasonData)
                await setClonarControlador(jasonData)
                setDeshabilitar2(false);
            } catch (error) {
                setDeshabilitar2(false)
            }
           
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'No hay dispositivo Destino',
                text: 'Selecciona un dispositivo de destino',
            })
        }
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
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value.index}-label`;

                    return (
                        <ListItem
                            key={value.index}
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
                            <ListItemText id={labelId} primary={`mac:${value.mac}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <>
            <Container maxWidth="md" >
                <div className='titulos-clonacion'>
                    <h5>Equipo de referencia: </h5> <p className='parrafos-clonacion'>{controlerState.mac}</p>
                </div>
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
                    <Grid item xs={12} md={6}>
                        <Button variant="contained" fullWidth color='verde' disabled={deshabilitar2} onClick={obtenerIps}>Leer Datos</Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button variant="contained" fullWidth disabled={deshabilitar} onClick={clonarEquipos}>Clonar Equipos</Button>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <div style={{ height: 8 }}>

                        </div>
                    </Grid>
                </Grid>
            </Container>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar2}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <CardController />
            <CardInformation />
        </>
    );
}

const datosIniciales1 = [

]
const datosIniciales2 = [

]
