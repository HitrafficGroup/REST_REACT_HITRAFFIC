import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { getHorarioHT200,PostHorariosHT200 } from "../../js/apiFunctionsHT200";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// tree view
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Swal from 'sweetalert2';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSelector, useDispatch } from 'react-redux';
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { updateParamsHT200 } from "../../features/controlerht200/controlerHT200Slice";
import CardControllerHT200 from "../../components/CardControllerHT200";
import { IpControllerCard } from '../../components/ip-controller-card';
import { CantonControllerCard } from '../../components/canton-controller-card';
import { NombreControllerCard } from '../../components/nombre-controller-card';
export default function HorariosHT200View(){

    const controlerState = useSelector(state => state.controlerht200);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [modalConfig,setModalConfig] = useState(false);
    const [data,setData] = useState(controlerState.horarios);
    const [currentHorario,setCurrentHorario] = useState({day_plan:""});
    const [flagCrear,setFlagCrear]=useState(false);
    const dispatch = useDispatch();
    const [dia,setDia] = useState({
        lunes:false,
        martes:false,
        miercoles:false,
        jueves:false,
        viernes:false,
        sabado:false,
        domingo:false,
    });
    const [mes,setMes] = useState({
        enero:false,
        febrero:false,
        marzo:false,
        abril:false,
        mayo:false,
        junio:false,
        julio:false,
        agosto:false,
        septiembre:false,
        octubre:false,
        noviembre:false,
        diciembre:false,
    });
    const [fecha,setFecha]= useState({
        dia1:false,
        dia2:false,
        dia3:false,
        dia4:false,
        dia5:false,
        dia6:false,
        dia7:false,
        dia8:false,
        dia9:false,
        dia10:false,
        dia11:false,
        dia12:false,
        dia13:false,
        dia14:false,
        dia15:false,
        dia16:false,
        dia17:false,
        dia18:false,
        dia19:false,
        dia20:false,
        dia21:false,
        dia22:false,
        dia23:false,
        dia24:false,
        dia25:false,
        dia26:false,
        dia27:false,
        dia28:false,
        dia29:false,
        dia30:false,
        dia31:false,
    });
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const readData = async()=>{
        let controller_data = await getHorarioHT200(controlerState.ip);
        controller_data.forEach(element => {
            element['mes_formated'] = formatMonth(element)
            element['fecha_formated'] = formatearDias(element)
            element['dia_formated'] = formatWeek(element)
        });
        controller_data = controller_data.filter(item=> item.number !== 0)
        updateFirebase('horarios',controller_data);
        dispatch(updateParamsHT200({target:'horarios',data:controller_data}));

        setData(controller_data)
        console.log(controller_data)

    }
    const updateFirebase = async (param, __data) => {
        const ref = doc(db, "controladores", `${controlerState.id}`);
        let aux_data = {}
        aux_data[`${param}`] = __data;
        await updateDoc(ref, aux_data);
    }
    const uploadData = async()=>{
        let aux_data = JSON.parse(JSON.stringify(data));
        let array_data = []
        for(let i = 0; i<40;i++){
            if( i<aux_data.length){

                let aux = aux_data[i]
                let aux_dia = {
                    lunes:'0',
                    martes:'0',
                    miercoles:'0',
                    jueves:'0',
                    viernes:'0',
                    sabado:'0',
                    domingo:'0',
                }
                let aux_fecha = {
                    dia1:'0',
                    dia2:'0',
                    dia3:'0',
                    dia4:'0',
                    dia5:'0',
                    dia6:'0',
                    dia7:'0',
                    dia8:'0',
                    dia9:'0',
                    dia10:'0',
                    dia11:'0',
                    dia12:'0',
                    dia13:'0',
                    dia14:'0',
                    dia15:'0',
                    dia16:'0',
                    dia17:'0',
                    dia18:'0',
                    dia19:'0',
                    dia20:'0',
                    dia21:'0',
                    dia22:'0',
                    dia23:'0',
                    dia24:'0',
                    dia25:'0',
                    dia26:'0',
                    dia27:'0',
                    dia28:'0',
                    dia29:'0',
                    dia30:'0',
                    dia31:'0',
                }
                let aux_meses = {
                    enero:'0',
                    febrero:'0',
                    marzo:'0',
                    abril:'0',
                    mayo:'0',
                    junio:'0',
                    julio:'0',
                    agosto:'0',
                    septiembre:'0',
                    octubre:'0',
                    noviembre:'0',
                    diciembre:'0',
                }
                aux.mes_formated.map(item => {
                    aux_meses[item] = '1';
                    return item;
                })
                aux.fecha_formated.map(item => {
                    aux_fecha[`dia${item}`] = '1';
                    return item;
                })
                aux.dia_formated.map(item => {
                    aux_dia[item] = '1'
                    return item;
                })
                let aux_m1 =  aux_meses.julio+aux_meses.junio+aux_meses.mayo+aux_meses.abril+aux_meses.marzo+aux_meses.febrero+aux_meses.enero+'0'
                let aux_m2 =  "000"+aux_meses.diciembre+aux_meses.noviembre+aux_meses.octubre+aux_meses.septiembre+aux_meses.agosto
                let aux_d1 = aux_fecha.dia7+aux_fecha.dia6+aux_fecha.dia5+aux_fecha.dia4+aux_fecha.dia3+aux_fecha.dia2+aux_fecha.dia1+'0'
                let aux_d2 = aux_fecha.dia15+aux_fecha.dia14+aux_fecha.dia13+aux_fecha.dia12+aux_fecha.dia11+aux_fecha.dia10+aux_fecha.dia9+aux_fecha.dia8
                let aux_d3 = aux_fecha.dia23+aux_fecha.dia22+aux_fecha.dia21+aux_fecha.dia20+aux_fecha.dia19+aux_fecha.dia18+aux_fecha.dia17+aux_fecha.dia16
                let aux_d4 = aux_fecha.dia31+aux_fecha.dia30+aux_fecha.dia29+aux_fecha.dia28+aux_fecha.dia27+aux_fecha.dia26+aux_fecha.dia25+aux_fecha.dia24
                let dia_byte = aux_dia.sabado+aux_dia.viernes+aux_dia.jueves+aux_dia.miercoles+aux_dia.martes+aux_dia.lunes+aux_dia.domingo+'0'
                var temp_m1 = parseInt(aux_m1, 2);
                var temp_m2 = parseInt(aux_m2, 2);
                var temp_d1 = parseInt(aux_d1, 2);
                var temp_d2 = parseInt(aux_d2, 2);
                var temp_d3 = parseInt(aux_d3, 2);
                var temp_d4 = parseInt(aux_d4, 2);
                var temp_dia = parseInt(dia_byte, 2);
                array_data.push(aux.number)
                array_data.push(temp_m1)
                array_data.push(temp_m2)
                array_data.push(temp_dia)
                array_data.push(temp_d1)
                array_data.push(temp_d2)
                array_data.push(temp_d3)
                array_data.push(temp_d4)
                array_data.push(aux.day_plan)
            }else{
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
            }
        }
        console.log(array_data)
        await PostHorariosHT200({trama:array_data,ip:controlerState.ip})
        updateFirebase('horarios',aux_data);
        dispatch(updateParamsHT200({target:'horarios',data:aux_data}));

    }
  
    const modificarHorario = (__data)=>{
        let aux = JSON.parse(JSON.stringify(__data))
        let aux_dia = {
            lunes:false,
            martes:false,
            miercoles:false,
            jueves:false,
            viernes:false,
            sabado:false,
            domingo:false,
        }
        let aux_fecha = {
            dia1:false,
            dia2:false,
            dia3:false,
            dia4:false,
            dia5:false,
            dia6:false,
            dia7:false,
            dia8:false,
            dia9:false,
            dia10:false,
            dia11:false,
            dia12:false,
            dia13:false,
            dia14:false,
            dia15:false,
            dia16:false,
            dia17:false,
            dia18:false,
            dia19:false,
            dia20:false,
            dia21:false,
            dia22:false,
            dia23:false,
            dia24:false,
            dia25:false,
            dia26:false,
            dia27:false,
            dia28:false,
            dia29:false,
            dia30:false,
            dia31:false,
        }
        let aux_meses = {
            enero:false,
            febrero:false,
            marzo:false,
            abril:false,
            mayo:false,
            junio:false,
            julio:false,
            agosto:false,
            septiembre:false,
            octubre:false,
            noviembre:false,
            diciembre:false,
        }
        aux.mes_formated.map(item => {
            aux_meses[item] = true;
            return item;
        })
        aux.fecha_formated.map(item => {
            aux_fecha[`dia${item}`] = true;
            return item;
        })
        aux.dia_formated.map(item => {
            aux_dia[item] = true;
            return item;

        })
        setFlagCrear(false)
        setModalConfig(true);
        setMes(aux_meses)
        setFecha(aux_fecha)
        setDia(aux_dia)
        console.log(__data);
        
        setCurrentHorario(__data)
    }

 
    const formatMonth =(__data)=>{
        let aux_complement = [0,0,0,0,0,0,0,0]
        let aux_complement2 = [0,0,0,0,0,0,0,0]
        let temp = __data.m1
        let temp2 = __data.m2
        let aux_byte1 = ("00000000"+temp.toString(2)).substr(-8)
        let aux_byte2 = ("00000000"+temp2.toString(2)).substr(-8)
        for(let i = 0; i<aux_byte1.length;i++){
            aux_complement[i] = parseInt(aux_byte1[i])
            aux_complement2[i] = parseInt(aux_byte2[i])
        }
        let meses1 = compararIndices(aux_complement,mes_byte1)
        let meses2 = compararIndices(aux_complement2,mes_byte2)
        let result = meses2.concat(meses1)
        if(result.length ===0){
            result = ['none']
        }
        return result;
    }
    const formatWeek = (__data)=>{
        let comp1 = [0,0,0,0,0,0,0,0]
        let aux_byte1 = ("00000000"+__data.day.toString(2)).substr(-8)
        for(let i = 0; i<aux_byte1.length;i++){
            comp1[i] = parseInt(aux_byte1[i])
        }
        let result = compararIndices(comp1,day_byte1)
        return result
    }
    const formatearDias =(__data)=> {
        let comp1   =  [0,0,0,0,0,0,0,0]
        let comp2   =  [0,0,0,0,0,0,0,0]
        let comp3   =  [0,0,0,0,0,0,0,0]
        let comp4   =  [0,0,0,0,0,0,0,0]
        let aux_byte1 = ("00000000"+__data.d1.toString(2)).substr(-8)
        let aux_byte2 = ("00000000"+__data.d2.toString(2)).substr(-8)
        let aux_byte3 = ("00000000"+__data.d3.toString(2)).substr(-8)
        let aux_byte4 = ("00000000"+__data.d4.toString(2)).substr(-8)
        for(let i = 0; i<aux_byte1.length;i++){
            comp1[i] = parseInt(aux_byte1[i])
            comp2[i] = parseInt(aux_byte2[i])
            comp3[i] = parseInt(aux_byte3[i])
            comp4[i] = parseInt(aux_byte4[i])
        }
        let list1 = compararIndices(comp1,date_byte1)
        let list2 = compararIndices(comp2,date_byte2)
        let list3 = compararIndices(comp3,date_byte3)
        let list4 = compararIndices(comp4,date_byte4)
        let result = list4.concat(list3.concat(list2.concat(list1)))
        return result

    }
    const handleChange = (event) => {
        setCurrentHorario({
            ...currentHorario,
            [event.target.name]: event.target.value,
        });

    };
    const handleMeses = (event)=>{
        setMes({
            ...mes,
            [event.target.name]: event.target.checked,
          });
    }

    const handleFecha =(event)=>{
        setFecha({
            ...fecha,
            [event.target.name]: event.target.checked,
          });
    }
    const handleDias =(event)=>{
        setDia({
            ...dia,
            [event.target.name]: event.target.checked,
          });
    }
    const compararIndices =(arr1, arr2)=> {
        var resultado = [];
      
        for (var i = 0; i < arr1.length; i++) {
          if (arr1[i]) {
            resultado.push(arr2[i]);
          }
        }
      
        return resultado;
      }
    const aplicarCambios =()=>{
        let data_modify = []
        let aux = JSON.parse(JSON.stringify(currentHorario))
        let aux_data = JSON.parse(JSON.stringify(data))
        let lista_mes = obtenerAtributosVerdaderos(mes)
        let lista_fecha = obtenerAtributosVerdaderos(fecha)
        let lista_dia = obtenerAtributosVerdaderos(dia)
        let lista_fecha_formated = lista_fecha.map((item=>{
            return item.slice(3,item.length)
        }))
        aux.dia_formated = lista_dia
        aux.fecha_formated = lista_fecha_formated
        aux.mes_formated = lista_mes
        if(!flagCrear){
           
             data_modify = aux_data.map(item =>{
                if(item.number === aux.number){
                    return aux;
                }else{
                    return item;
                }
            })
            setData(data_modify)
            setModalConfig(false)
        }else{
            console.log(aux_data)
            aux_data.push(aux)
            aux_data.map((item,index)=>(item.number = (index+1)))
            setData(aux_data)
            setModalConfig(false)
        }
       
    }

    const  obtenerAtributosVerdaderos =(obj)=> {
        let atributosVerdaderos = [];
        
        for (let atributo in obj) {
          if (obj[atributo] === true) {
            atributosVerdaderos.push(atributo);
          }
        }
        
        return atributosVerdaderos;
      }
    
    const abrirModalCrear =()=>{
        setModalConfig(true);
        setFlagCrear(true)
    }
    const eliminarHorario=(__data)=>{
      console.log(data)
        Swal.fire({
            title: 'Deseas Continuar ?',
            text: 'Se Eliminara Esta Configuracion',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Si, Eliminar!',
            showDenyButton: true,
            denyButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                let aux_data = JSON.parse(JSON.stringify(data))
             
                let data_modify  = aux_data.filter(item=> item.number !== __data.number)
                data_modify.map((item,index)=>(item.number = (index+1)))
                console.log(data_modify)
                setData(data_modify)

            }
        })
    }

    return(
        <>
              <Container maxWidth="lg" style={{paddingTop:15}}>
                <Grid container spacing={3}>
                <Grid item xs={12} md={4} >
                      <NombreControllerCard  
                      sx={{ height: '100%' }}
                        value={controlerState.nombre}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} >
                      <CantonControllerCard  
                      sx={{ height: '100%' }}
                        value={controlerState.canton}
                        />
                    </Grid>
                    <Grid item xs={12} md={4} >
                      <IpControllerCard  
                      sx={{ height: '100%' }}
                        value={controlerState.ip}
                        />
                    </Grid>
                <Grid item xs={12} md={4} >
                        <Button color='azulm' variant="contained" fullWidth onClick={abrirModalCrear}  >Agregar Fase</Button>
                    </Grid>
                <Grid item md={4} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} fullWidth onClick={readData}  >Leer Datos</Button>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Button variant="contained" color='oscuro' sx={{ height: '100%' }}  fullWidth onClick={uploadData}>Cargar Datos</Button>
                    </Grid>
                    <Grid item md={12} xs={12}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                              <TableCell
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Id
                                            </TableCell>
                                            <TableCell
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Plan
                                            </TableCell>
                                            <TableCell
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Mes
                                            </TableCell>
                                            <TableCell
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Fecha
                                            </TableCell>
                                            <TableCell
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Dia
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
                                    {data
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row,index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                     <TableCell align={"left"}>
                                                                {row.number}
                                                            </TableCell>
                                                            <TableCell align={"left"}>
                                                                {row.day_plan}
                                                            </TableCell>
                                                            <TableCell align={"left"}>
                                                                <ul>
                                                                {row.mes_formated.map((item)=>{
                                                                        return(
                                                                        <li >
                                                                            {item}
                                                                        </li>
                                                                            
                                                                        );
                                                                    })}
                                                                </ul>
                                                                   
                                                                   
                                                            </TableCell>
                                                            <TableCell align={"left"}>
                                                            {row.fecha_formated.map(item=>{
                                                                    return(<>
                                                                            {item}-
                                                                    </>);
                                                                })}
                                                            </TableCell>
                                                            <TableCell align={"left"}>
                                                            <ul>
                                                                {row.dia_formated.map((item,index)=>{
                                                                        return(
                                                                        <li key={index}>
                                                                            {item}
                                                                        </li>
                                                                            
                                                                        );
                                                                    })}
                                                                </ul>
                                                            </TableCell>
                                                    <TableCell  align={"center"}>
                                                         <IconButton color="oscuro" aria-label="add an alarm" onClick={()=>{modificarHorario(row)}} >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton color="rojo" aria-label="add an alarm" onClick={()=>{eliminarHorario(row)}}>
                                                            <DeleteIcon />
                                                        </IconButton>
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
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>
                </Grid>
            </Container>
            
            <Modal isOpen={modalConfig} >
                <ModalHeader>
                    <div>
                        <h1>
                            {flagCrear? "Crear Horario":"Editar Horario"}
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>

                        <Grid item xs={12} md={12}>
                            <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">day_plan</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={currentHorario.day_plan}
                                        label="day_plan"
                                        name="day_plan"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={1}>plan 1</MenuItem>
                                        <MenuItem value={2}>plan 2</MenuItem>
                                        <MenuItem value={3}>plan 3</MenuItem>
                                        <MenuItem value={4}>plan 4</MenuItem>
                                        <MenuItem value={5}>plan 5</MenuItem>
                                        <MenuItem value={6}>plan 6</MenuItem>
                                        <MenuItem value={7}>plan 7</MenuItem>
                                        <MenuItem value={8}>plan 8</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={12}>
                        <FormControl sx={{ m: 0 }} component="fieldset" variant="standard">
                            <FormLabel component="legend">Meses</FormLabel>
                            <FormGroup  aria-label="position" row>
                            <FormControlLabel
                                control={
                                <Checkbox checked={mes.enero} onChange={handleMeses} name="enero"  size="small" />
                                }
                                label="ene"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={mes.febrero} onChange={handleMeses} name="febrero"  size="small" />
                                }
                                label="feb"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={mes.marzo} onChange={handleMeses} name="marzo" size="small" />
                                }
                                label="mar"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={mes.abril} onChange={handleMeses} name="abril"  size="small"/>
                                }
                                label="abr"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={mes.mayo} onChange={handleMeses} name="mayo" size="small" />
                                }
                                label="may"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={mes.junio} onChange={handleMeses} name="junio" size="small" />
                                }
                                label="jun"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={mes.julio} onChange={handleMeses} name="julio"  size="small"/>
                                }
                                label="jul"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={mes.agosto} onChange={handleMeses} name="agosto" size="small" />
                                }
                                label="ago"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={mes.septiembre} onChange={handleMeses} name="septiembre" size="small" />
                                }
                                label="sep"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={mes.octubre} onChange={handleMeses} name="octubre" size="small" />
                                }
                                label="oct"
                            />
                              <FormControlLabel
                                control={
                                <Checkbox checked={mes.noviembre} onChange={handleMeses} name="noviembre"  size="small"/>
                                }
                                label="nov"
                            />
                              <FormControlLabel
                                control={
                                <Checkbox checked={mes.diciembre} onChange={handleMeses} name="diciembre" size="small" />
                                }
                                label="dic"
                            />
                            </FormGroup>
                        </FormControl>
                       
                        </Grid>
                        <Grid item xs={12} md={3}>
                        <FormControl sx={{ m: 0 }} component="fieldset" variant="standard">
                            <FormLabel component="legend">Dias</FormLabel>
                            <FormGroup  aria-label="position" row>
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia1} onChange={handleFecha} name="dia1"  size="small" />
                                }
                                label="1"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia2} onChange={handleFecha} name="dia2"  size="small" />
                                }
                                label="2"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia3} onChange={handleFecha} name="dia3" size="small" />
                                }
                                label="3"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia4} onChange={handleFecha} name="dia4"  size="small"/>
                                }
                                label="4"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia5} onChange={handleFecha} name="dia5" size="small" />
                                }
                                label="5"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia6} onChange={handleFecha} name="dia6" size="small" />
                                }
                                label="6"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia7} onChange={handleFecha} name="dia7"  size="small"/>
                                }
                                label="7"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia8} onChange={handleFecha} name="dia8" size="small" />
                                }
                                label="8"
                            />
                           
                            </FormGroup>
                        </FormControl>
                        
                        </Grid>
                        <Grid item xs={12} md={3}>
                        <FormControl sx={{ m: 0 }} component="fieldset" variant="standard">
                            <FormLabel component="legend">Dias</FormLabel>
                            <FormGroup  aria-label="position" row>
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia9} onChange={handleFecha} name="dia9"  size="small" />
                                }
                                label="9"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia10} onChange={handleFecha} name="dia10"  size="small" />
                                }
                                label="10"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia11} onChange={handleFecha} name="dia11" size="small" />
                                }
                                label="11"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia12} onChange={handleFecha} name="dia12"  size="small"/>
                                }
                                label="12"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia13} onChange={handleFecha} name="dia13" size="small" />
                                }
                                label="13"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia14} onChange={handleFecha} name="dia14" size="small" />
                                }
                                label="14"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia15} onChange={handleMeses} name="dia15"  size="small"/>
                                }
                                label="15"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia16} onChange={handleFecha} name="dia16" size="small" />
                                }
                                label="16"
                            />
                           
                            </FormGroup>
                        </FormControl>
                        
                        </Grid>
                        <Grid item xs={12} md={3}>
                        <FormControl sx={{ m: 0 }} component="fieldset" variant="standard">
                            <FormLabel component="legend">Dias</FormLabel>
                            <FormGroup  aria-label="position" row>
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia17} onChange={handleFecha} name="dia17"  size="small" />
                                }
                                label="17"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia18} onChange={handleFecha} name="dia18"  size="small" />
                                }
                                label="18"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia19} onChange={handleFecha} name="dia19"  size="small" />
                                }
                                label="19"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia20} onChange={handleFecha} name="dia20" size="small" />
                                }
                                label="20"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia21} onChange={handleFecha} name="dia21"  size="small"/>
                                }
                                label="21"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia22} onChange={handleFecha} name="dia22" size="small" />
                                }
                                label="22"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia23} onChange={handleFecha} name="dia23" size="small" />
                                }
                                label="23"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia24} onChange={handleFecha} name="dia24"  size="small"/>
                                }
                                label="24"
                            />
                          
                           
                            </FormGroup>
                        </FormControl>
                        
                        </Grid>
                        <Grid item xs={12} md={3}>
                        <FormControl sx={{ m: 0 }} component="fieldset" variant="standard">
                            <FormLabel component="legend">Dias</FormLabel>
                            <FormGroup  aria-label="position" row>
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia25} onChange={handleFecha} name="dia25"  size="small"/>
                                }
                                label="25"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia26} onChange={handleFecha} name="dia26"  size="small" />
                                }
                                label="26"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia27} onChange={handleFecha} name="dia27"  size="small" />
                                }
                                label="27"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia28} onChange={handleFecha} name="dia28" size="small" />
                                }
                                label="28"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia29} onChange={handleFecha} name="dia29"  size="small"/>
                                }
                                label="29"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia30} onChange={handleFecha} name="dia30" size="small" />
                                }
                                label="30"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={fecha.dia31} onChange={handleFecha} name="dia31" size="small" />
                                }
                                label="31"
                            />
                             
                           
                            </FormGroup>
                        </FormControl>
                        
                        </Grid>
                        <Grid item xs={12} md={12}>
                        <FormControl sx={{ m: 0 }} component="fieldset" variant="standard">
                            <FormLabel component="legend">Meses</FormLabel>
                            <FormGroup  aria-label="position" row>
                            <FormControlLabel
                                control={
                                <Checkbox checked={dia.lunes} onChange={handleDias} name="lunes"  size="small" />
                                }
                                label="lun"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={dia.martes} onChange={handleDias} name="martes"  size="small" />
                                }
                                label="mar"
                                labelPlacement="top"
                            />
                            <FormControlLabel
                                control={
                                <Checkbox checked={dia.miercoles} onChange={handleDias} name="miercoles" size="small" />
                                }
                                label="mie"
                                labelPlacement="top"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={dia.jueves} onChange={handleDias} name="jueves"  size="small"/>
                                }
                                label="jue"
                                labelPlacement="top"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={dia.viernes} onChange={handleDias} name="viernes" size="small" />
                                }
                                label="vie"
                                labelPlacement="top"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={dia.sabado} onChange={handleDias} name="sabado" size="small" />
                                }
                                label="sab"
                                labelPlacement="top"
                            />
                             <FormControlLabel
                                control={
                                <Checkbox checked={dia.domingo} onChange={handleDias} name="domingo"  size="small"/>
                                }
                                label="dom"
                                labelPlacement="top"
                            />
                            
                            </FormGroup>
                        </FormControl>
                       
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color="rojo" onClick={aplicarCambios} sx={{ marginLeft: 1 }}   >
                        aplicar
                    </Button>
                    <Button variant="contained" onClick={() => { setModalConfig(false) }} color="oscuro" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>

            
           
        </>
    )


}


let mes_byte1 = ['julio','junio','mayo','abril','marzo','febrero','enero','']
let mes_byte2 = ['','','','diciembre','noviembre','octubre','septiembre','agosto']
let date_byte1 = ["7","6","5","4","3","2","1","0"]
let date_byte2 = ["15","14","13","12","11","10","9","8"]
let date_byte3 = ["23","22","21","20","19","18","17","16"]
let date_byte4 = ["31","30","29","28","27","26","25","24"]
let day_byte1 = ["sabado","viernes","jueves","miercoles","martes","lunes","domingo",""]

