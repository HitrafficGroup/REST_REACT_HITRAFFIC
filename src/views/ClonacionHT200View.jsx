import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import { collection, query, getDocs,updateDoc,doc } from "firebase/firestore";
import { db } from '../firebase/firebase-config';
import "../css/clonacionHT200.scss";
import {setClonacion } from "../js/apiFunctionsHT200";
import Swal from 'sweetalert2';
import { generatePhaseFrame,generateSeqFrame,generateSplitFrame,generatePatternFrame,generateActionFrame,generatePlanFrame, generateChannelFrame } from "../js/generateFrameApiHT200";
import frameJson from "../js/ht200Frame.json";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CardControllerHT200 from '../components/CardControllerHT200';
export default function ClonacionHT200View() {
    const [checked, setChecked] = React.useState([]);
    const controlerState = useSelector(state => state.controlerht200);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [flagLoad, setFlagLoad] = useState(false);


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

    function union(a, b) {
        return [...a, ...not(b, a)];
    }

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
    const numberOfChecked = (items) => intersection(checked, items).length;

    const readData=async()=>{
        const q = query(collection(db, "controladores"));
        let data_firebase = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            data_firebase.push(doc.data())
        });
        let data_filter = data_firebase.filter(item=> item.modelo === "HT-200").filter(item=> item.ip !== controlerState.ip)
        let modify_data = data_filter.map(item=>{
            let temp = {
                nombre:item.nombre,
                ip:item.ip,
                id:item.id,
            }
            return temp;
        })
        console.log(modify_data)

        setLeft(modify_data)
        setRight([])


    }

    const updateFirebase = async ( ip) => {
        const ref = doc(db, "controladores",ip);
        let aux_data = {}
        aux_data['planificacion'] = controlerState.planificacion;
        await updateDoc(ref, aux_data);
    }
    const cargarDatos = async() => {
        // valores por defecto
        let data_aux = JSON.parse(JSON.stringify(controlerState.planificacion))
        let size = data_aux.length
        if(data_aux.length>0){
            setFlagLoad(true)
            let fases_aux = JSON.parse(JSON.stringify(frameJson.fases))
            let seq_aux = JSON.parse(JSON.stringify(frameJson.seq))
            let split_aux = JSON.parse(JSON.stringify(frameJson.split))
            let pattern_aux = JSON.parse(JSON.stringify(frameJson.pattern))
            let accion_aux = JSON.parse(JSON.stringify(frameJson.acciones))
            let plan_aux = JSON.parse(JSON.stringify(frameJson.plan))
            let channel_aux = JSON.parse(JSON.stringify(frameJson.channel))
            let canales_duracion_aux = {
                g1:0,
                g2:0,
                g3:0,
                g4:0,
                g15:0,
            }
            let tiempos_aux = []
           
    
                for (let j = 0; j < data_aux.length; j++) {
                    //modificamos las secuencias
                    let new_seq = seq_aux[j]
                    for (let i = 0; i < data_aux[j].data.length; i++) {
                        let temp_data = data_aux[j].data[i]
                       
                        if(temp_data.g1 === false && temp_data.g2 === false && temp_data.g3 === false && temp_data.g4 === false ){
                            new_seq.ring1[i].value = 15
                            new_seq.ring2[i].value = 15
                            new_seq.ring3[i].value = 15
                            new_seq.ring4[i].value = 15
                            canales_duracion_aux.g15 = temp_data.duracion
                        }else{
                            let aux_ring = 1
                            for(let x=0;x<4;x++){
                                if(temp_data[`g${x+1}`]=== true){
                                    new_seq['ring'+aux_ring][i].value = x + 1
                                    canales_duracion_aux['g'+(x+1)] =  temp_data.duracion
                                    aux_ring +=1
                                }
                            }
                        }
                       
                        
                    }
                    tiempos_aux.push(canales_duracion_aux)
                    //modificamos el split
                    let new_split = split_aux[j]
        
                    for (let i = 0; i < 4; i++) {
                        new_split.data[i].fase = i + 1
                        new_split.data[i].tiempo = tiempos_aux[j]['g'+(i+1)]
                        new_split.data[i].coord = 4
                    }
                    new_split.data[4].fase = 15
                    new_split.data[4].tiempo = tiempos_aux[j].g15
                    new_split.data[4].coord = 4
                }
                // modificamos pattern
                for (let i = 0; i < size; i++) {
                    pattern_aux[i].cycletime = 0;
                    pattern_aux[i].number = i + 1;
                    pattern_aux[i].offsettime = 0;
                    pattern_aux[i].sequencenumber = i + 1;
                    pattern_aux[i].splitnumber = i + 1;
                    pattern_aux[i].workmode = 1;
                }
                // modificamos accion
                for (let i = 0; i < size; i++) {
                    accion_aux[i].number = i + 1;
                    accion_aux[i].patron = i + 1;
                    accion_aux[i].auxiliary = 0;
                    accion_aux[i].special = 0;
                }
                //modificamos plan
                let new_plan = plan_aux[0]
                for (let i = 0; i < size; i++) {
                    new_plan.data[i].action = i + 1;
                    new_plan.data[i].hour = data_aux[i].hora;
                    new_plan.data[i].minute = data_aux[i].minuto;
                }
         
            // generamos las tramas

            let fases_frame = generatePhaseFrame(fases_aux);
            let seq_frame = generateSeqFrame(seq_aux);
            let split_frame = generateSplitFrame(split_aux);
            let pattern_frame = generatePatternFrame(pattern_aux);
            let action_frame = generateActionFrame(accion_aux);
            let plan_frame =  generatePlanFrame(plan_aux)
            let channel_frame = generateChannelFrame(channel_aux)
            // cargar Datos
                for(let i = 0 ;i<right.length;i++)
                {
                    await setClonacion({
                        fases:fases_frame,
                        secuencias:seq_frame,
                        split:split_frame,
                        pattern:pattern_frame,
                        accion:action_frame,
                        plan:plan_frame,
                        channel:channel_frame,
                        ip:right[i].ip
                    })
                    await updateFirebase(right[i].id)
                }
  
            setFlagLoad(false)
            Swal.fire({
				title: "Completado!",
				text: "Cambios Cargados Con Éxito",
				icon: "success",
			});
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'No data',
                text: "no hay planes para cargar",
    
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
                {items.map((value,index) => {
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
            <Container maxWidth="md" >

                <div className='titulos-clonacion'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6" gutterBottom>
                                <strong>Controlador de referencia: </strong> {controlerState.nombre}
                            </Typography>

                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" gutterBottom>
                                <strong>ip: </strong> {controlerState.ip}
                            </Typography>

                        </Grid>
                    </Grid>
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
                        <Button variant="contained" onClick={readData} fullWidth color='verde'>Leer Datos</Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button variant="contained" onClick={cargarDatos} fullWidth >Clonar Equipos</Button>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <div style={{ height: 8 }}>

                        </div>
                    </Grid>
                </Grid>
                <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={flagLoad}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
            </Container>
            <CardControllerHT200 />
        </>
    )


}