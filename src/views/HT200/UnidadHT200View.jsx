import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';
import { updateDoc, doc } from "firebase/firestore";
import { db } from '../../firebase/firebase-config';
import Button from '@mui/material/Button';
import { getUnitHT200,PostUnitHT200 } from '../../js/apiFunctionsHT200';
import { updateParamsHT200 } from '../../features/controlerht200/controlerHT200Slice';
import { useSelector,useDispatch } from 'react-redux';
import CardControllerHT200 from '../../components/CardControllerHT200';
export default function UnidadHT200View() {
    const controlerState = useSelector(state => state.controlerht200)
    const [state, setState] = useState({
        StartupFlash: "0",
        StartupAllRed: "0",
        AutomaticPedClear: false,
        RedRevert: "0",
        BackupTime: "0",
        BackupTime2:"0",
        FlowCycle: "0",
        FlashStatus: "0",
        Status: "0",
        GreenConflictDetectFlag: false,
        RedGreenConflictDetectFlag: false,
        RedFailedDetectFlag: false,
    });
    const dispatch = useDispatch();
   
    const uploadData = async() =>{
        let backup_time = state["BackupTime"] 
        let data1 = backup_time & 0xff;
        let data2 = backup_time >> 8;
  
        let trama = [
            parseInt(state.StartupFlash) ,
            parseInt(state.StartupAllRed),
            state.AutomaticPedClear? 2:0,
            parseInt(state.RedRevert),
            data1,
            data2,
            parseInt(state.FlowCycle),
            parseInt(state.FlashStatus),
            parseInt(state.Status),
            state.GreenConflictDetectFlag ? 1:0,
            state.RedGreenConflictDetectFlag ? 1:0,
            state.RedFailedDetectFlag ? 1:0
        ]
        
    
        await PostUnitHT200({trama:trama,ip:controlerState.ip})
        updateFirebase('unit',state)
        dispatch(updateParamsHT200({target:'unit',data:state}))
       
    }

    const readData=async()=>{
        let data = await getUnitHT200(controlerState.ip);
        data["GreenConflictDetectFlag"] =  data["GreenConflictDetectFlag"] === 1 ? true:false;
        data["RedGreenConflictDetectFlag"] =  data["RedGreenConflictDetectFlag"] === 1 ? true:false;
        data["RedFailedDetectFlag"] =  data["RedFailedDetectFlag"] === 1 ? true:false;
        data["AutomaticPedClear"] =  data["AutomaticPedClear"] === 2 ? true:false;
        setState(data);
        updateFirebase('unit',data)
        dispatch(updateParamsHT200({target:'unit',data:data}))
    }
    const handleSwitch = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };
    
    const updateFirebase = async (param, __data) => {
        const ref = doc(db, "controladores", `${controlerState.id}`);
        let aux_data = {}
        aux_data[`${param}`] = __data;
        await updateDoc(ref, aux_data);
    }
    const handleTextField = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };
    return (
        <>
            <Container maxWidth="md" style={{paddingTop:15}}>
                <Grid container spacing={3}>
                    <Grid item xs={6} md={4} >
                        <Button color='verde' variant="contained" fullWidth onClick={readData} >leer datos</Button>
                    </Grid>
                    <Grid item xs={6} md={4} >
                        <Button color='oscuro' variant="contained" fullWidth onClick={uploadData} >cargar datos</Button>
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <TextField
                            id="outlined-controlled"
                            label="Tiempo de Inicio de destello en Amarillo"
                            value={state.StartupFlash}
                            fullWidth={true}
                            onChange={handleTextField}
                            name="StartupFlash"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="outlined-controlled"
                            label="Tiempo de Inicio Todo en Rojo"
                            fullWidth={true}
                            type="number"
                            value={state.StartupAllRed}
                            onChange={handleTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            name='StartupAllRed'
                        />
                    </Grid>
                    <Grid item xs={12} md={4} >
                        <TextField
                            id="outlined-controlled"
                            label="Tiempo de degradacion"
                            fullWidth={true}
                            type="number"
                            onChange={handleTextField}
                            value={state.BackupTime}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            name='BackupTime'
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            id="outlined-controlled"
                            label="Tiempo de Todo en Rojo"
                            fullWidth={true}
                            type="number"
                            onChange={handleTextField}
                            value={state.RedRevert}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            name='RedRevert'
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            id="outlined-controlled"
                            label="Ciclo de recoleccion de Flujo"
                            fullWidth={true}
                            type="number"
                            onChange={handleTextField}
                            value={state.FlowCycle}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            name='FlowCycle'
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Label placement</FormLabel>
                            <FormGroup aria-label="position" column="true" >
                                <FormControlLabel
                                    value="top"
                                    control={<Switch checked={state.AutomaticPedClear} color="primary" onChange={handleSwitch} name="AutomaticPedClear" />}
                                    label="Eliminacion Automatica Peatonal: "
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    value="top"
                                    control={<Switch checked={state.GreenConflictDetectFlag} color="primary" onChange={handleSwitch} name='GreenConflictDetectFlag' />}
                                    label="Activacion Conflicto en verdes: "
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    value="top"
                                    control={<Switch checked={state.RedGreenConflictDetectFlag} color="primary" onChange={handleSwitch} name='RedGreenConflictDetectFlag' />}
                                    label="Activacion de Falla de Rojo y Verde de un grupo: "
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    value="top"
                                    control={<Switch checked={state.RedFailedDetectFlag} color="primary" onChange={handleSwitch} name='RedFailedDetectFlag' />}
                                    label="Activacion de falla de luz Roja: "
                                    labelPlacement="start"
                                />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </Container>
            <CardControllerHT200 />
        </>
    )


}