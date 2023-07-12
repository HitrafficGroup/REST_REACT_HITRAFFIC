import React,{useState} from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getPlanHT200,PostPlanHT200 } from '../../js/apiFunctionsHT200';
import Button from '@mui/material/Button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { generatePlanFrame } from '../../js/generateFrameApiHT200';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
//
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useSelector,useDispatch } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { updateParamsHT200 } from "../../features/controlerht200/controlerHT200Slice";
import { IpControllerCard } from '../../components/ip-controller-card';
import { CantonControllerCard } from '../../components/canton-controller-card';
import { NombreControllerCard } from '../../components/nombre-controller-card';
export default function PlanHT200View(){
    const controlerState = useSelector(state => state.controlerht200);
    const [planTab,setPlanTab] = useState("plan-1");
    const [currentTab, setCurrentTab] = useState(controlerState.plan[0].data);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [data,setData] = useState(controlerState.plan);
    const [modalConfig,setModalConfig] = useState(false);
    const [modalCrear,setModalCrear] = useState(false);
    const [currentPlan,setCurrentPlan] = useState({});
    const dispatch = useDispatch();
    const handlePlan = (event)=>{
        setPlanTab(event.target.value);
        let plan_actual = data.filter((item) => item.id === event.target.value)
        setCurrentTab(plan_actual[0].data);
  
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const readData = async()=>{
        let data_controller = await getPlanHT200(controlerState.ip);
        let modify_data = data_controller.map(item =>{
            item.data = item.data.filter(item => item.action !== 0)
            return item
        })
        console.log(modify_data)
        setCurrentTab(modify_data[0].data)
        setData(modify_data);
        updateFirebase('plan',modify_data);
        dispatch(updateParamsHT200({target:'plan',data:modify_data}));

    }
    const updateFirebase = async (param, __data) => {
        const ref = doc(db, "controladores", `${controlerState.id}`);
        let aux_data = {}
        aux_data[`${param}`] = __data;
        await updateDoc(ref, aux_data);
    }

    const modificarPlan =(__data)=>{
        setModalConfig(true)
        setCurrentPlan(__data)
    }

    const uploadData = async() =>{
        let array_data = []
        array_data = generatePlanFrame(data)
        await PostPlanHT200({trama:array_data,ip:controlerState.ip})
        updateFirebase('plan',data);
        dispatch(updateParamsHT200({target:'plan',data:data}));
    }
    const aplicarCambios=()=>{
        let aux_plan = JSON.parse(JSON.stringify(currentPlan))
        aux_plan.minute = parseInt(aux_plan.minute)
        aux_plan.hour = parseInt(aux_plan.hour)
        let aux_data = JSON.parse(JSON.stringify(currentTab))
        let  modify_data =   aux_data.map((item)=>{
            if(aux_plan.id === item.id){
                return aux_plan;
            }else{
                return item
            }
        })
        //luego modificamos la tabla con todos los datos
        let alldata_modify = data.map((item)=>{
            if(planTab === item.id){
                return {data:modify_data,id:planTab};
            }else{
                 return item;
            }
        })
        setData(alldata_modify)
        setCurrentTab(modify_data)
        setModalConfig(false)
    
    }
    const crearPlan =()=>{
        let aux_data = JSON.parse(JSON.stringify(data))
        let aux_plan = JSON.parse(JSON.stringify(currentPlan))
        let aux_currentab = JSON.parse(JSON.stringify(currentTab))
        aux_currentab.push(aux_plan)
        aux_currentab.sort(function(a, b) {
                return a.hour - b.hour;
              });
        aux_currentab.map((item,index)=>(item.id = `num-${index+1}`))
        let modify_plan = aux_data.map(item=>{
            if(item.id ===planTab){
                item.data = aux_currentab
            }
            return item;
            })
        setData(modify_plan)
        setCurrentTab(aux_currentab)
        setModalCrear(false)
    }
    const handleChange = (event) => {
        setCurrentPlan({
            ...currentPlan,
            [event.target.name]: event.target.value,
        });

    };
    const eliminarPlan = (__data)=>{
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
                let aux_currentab = JSON.parse(JSON.stringify(currentTab))
                aux_currentab = aux_currentab.filter(item=> item.id !== __data.id)
                aux_currentab.map((item,index)=>(item.id = `num-${index+1}`))
                let modify_plan = aux_data.map(item=>{
                    if(item.id ===planTab){
                        item.data = aux_currentab
                    }
                    return item;
                    })
                setCurrentTab(aux_currentab)
                setData(modify_plan)

            }
        })
    }
    const abrirModalCrear=()=>{
        setModalCrear(true)
    }
    return(
        <>    
            <Container maxWidth="lg" style={{paddingTop:15}}>
                <Grid container spacing={2}>
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
                    <Grid item md={3} xs={12} >
                    <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Plan Tab</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={planTab}
                                label="split tab"
                                onChange={handlePlan}
                            >
                                <MenuItem value={"plan-1"}>Plan 1</MenuItem>
                                <MenuItem value={"plan-2"}>Plan 2</MenuItem>
                                <MenuItem value={"plan-3"}>Plan 3</MenuItem>
                                <MenuItem value={"plan-4"}>Plan 4</MenuItem>
                                <MenuItem value={"plan-5"}>Plan 5</MenuItem>
                                <MenuItem value={"plan-6"}>Plan 6</MenuItem>
                                <MenuItem value={"plan-7"}>Plan 7</MenuItem>
                                <MenuItem value={"plan-8"}>Plan 8</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" color='azulm' sx={{ height: '100%' }} fullWidth onClick={abrirModalCrear}  >Crear Plan</Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} fullWidth onClick={readData}  >Leer Datos</Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" color='oscuro' sx={{ height: '100%' }}  fullWidth onClick={uploadData}>Cargar Datos</Button>
                    </Grid>
              
                    <Grid item md={12} xs={12} >
                    <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                
                                        <TableCell
                                                key={"id"}
                                                align={"center"}
                                          
                                            >
                                                Id
                                            </TableCell>
                                            <TableCell
                                                key={"hora"}
                                                align={"center"}
                                              
                                            >
                                                Hora
                                            </TableCell>
                                            <TableCell
                                                key={"minuto"}
                                                align={"center"}
                                  
                                            >
                                                Minuto
                                            </TableCell>
                                            <TableCell
                                                key={"accion"}
                                                align={"center"}
                                             
                                            >
                                                Accion
                                            </TableCell>
                                            <TableCell
                                                key={"acciones"}
                                                align={"center"}
                                  
                                            >
                                                Acciones
                                            </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentTab
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row,index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                      <TableCell  align={"center"}>
                                                              {row.id}
                                                            </TableCell>
                                                            <TableCell  align={"center"}>
                                                              {row.hour}
                                                            </TableCell>
                                                            <TableCell  align={"center"}>
                                                              {row.minute}
                                                            </TableCell>
                                                            <TableCell  align={"center"}>
                                                              {row.action}
                                                            </TableCell>
                                                 <TableCell  align={"center"}>
                                                         <IconButton color="oscuro" aria-label="add an alarm" onClick={()=>{modificarPlan(row)}} >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton color="rojo" aria-label="add an alarm" onClick={()=>{eliminarPlan(row)}} >
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
                            count={currentTab.length}
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
                            Editar Planes
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>

                        <Grid item xs={12} md={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Modifique La Accion</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentPlan.action}
                                    label="Modifique La Accion"
                                    name='action'
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>Action 1</MenuItem>
                                    <MenuItem value={2}>Action 2</MenuItem>
                                    <MenuItem value={3}>Action 3</MenuItem>
                                    <MenuItem value={4}>Action 4</MenuItem>
                                    <MenuItem value={5}>Action 5</MenuItem>
                                    <MenuItem value={6}>Action 6</MenuItem>
                                    <MenuItem value={7}>Action 7</MenuItem>
                                    <MenuItem value={8}>Action 8</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField id="outlined-basic" 
                        label="Horas" 
                        variant="outlined" 
                        name="hour" fullWidth   
                        InputProps={{ inputProps: { min: 0, max: 24 } }} 
                        onChange={handleChange} 
                        value={currentPlan.hour} 
                        type="number" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField id="outlined-basic" 
                        label="Minutos" 
                        variant="outlined" 
                        name="minute" 
                        fullWidth 
                        InputProps={{ inputProps: { min: 0, max: 60 } }}  
                        onChange={handleChange} 
                        value={currentPlan.minute} 
                        type="number" />
                        </Grid>
                       
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color="rojo" sx={{ marginLeft: 1 }}  onClick={()=>{aplicarCambios()}} >
                        aplicar
                    </Button>
                    <Button variant="contained" onClick={() => { setModalConfig(false) }} color="oscuro" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modalCrear} >
                <ModalHeader>
                    <div>
                        <h1>
                            Crear Planes
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>

                        <Grid item xs={12} md={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Modifique La Accion</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentPlan.action}
                                    label="Modifique La Accion"
                                    name='action'
                                    onChange={handleChange}
                                >
                                    <MenuItem value={1}>Action 1</MenuItem>
                                    <MenuItem value={2}>Action 2</MenuItem>
                                    <MenuItem value={3}>Action 3</MenuItem>
                                    <MenuItem value={4}>Action 4</MenuItem>
                                    <MenuItem value={5}>Action 5</MenuItem>
                                    <MenuItem value={6}>Action 6</MenuItem>
                                    <MenuItem value={7}>Action 7</MenuItem>
                                    <MenuItem value={8}>Action 8</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField id="outlined-basic" 
                        label="Horas" 
                        variant="outlined" 
                        name="hour" fullWidth   
                        InputProps={{ inputProps: { min: 0, max: 24 } }} 
                        onChange={handleChange} 
                        value={currentPlan.hour} 
                        type="number" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField id="outlined-basic" 
                        label="Minutos" 
                        variant="outlined" 
                        name="minute" 
                        fullWidth 
                        InputProps={{ inputProps: { min: 0, max: 60 } }}  
                        onChange={handleChange} 
                        value={currentPlan.minute} 
                        type="number" />
                        </Grid>
                       
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color="rojo" sx={{ marginLeft: 1 }}  onClick={()=>{crearPlan()}} >
                        aplicar
                    </Button>
                    <Button variant="contained" onClick={() => { setModalCrear(false) }} color="oscuro" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>

        </>
    );
}

