import React,{useState} from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getPlanHT200,PostPlanHT200 } from '../js/apiFunctionsHT200';
import Button from '@mui/material/Button';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TextField from '@mui/material/TextField';
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
import { db } from "../firebase/firebase-config";
import { updateParamsHT200 } from "../features/controlerht200/controlerHT200Slice";
export default function PlanHT200View(){
    const [planTab,setPlanTab] = useState("plan-1");
    const [currentTab, setCurrentTab] = useState([{}]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [data,setData] = useState([{}]);
    const [modalConfig,setModalConfig] = useState(false);
    const [currentPlan,setCurrentPlan] = useState({});
    const controlerState = useSelector(state => state.controlerht200);
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
        setCurrentTab(data_controller[0].data)
        console.log(data_controller)
        setData(data_controller);
        updateFirebase('plan',data_controller);
        dispatch(updateParamsHT200({target:'plan',data:data_controller}));

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
        let aux_data = JSON.parse(JSON.stringify(data))
        let array_data = []
        let target_plan = []
        for(let i = 0;i<16;i++){
            array_data.push(i+1)
                target_plan = aux_data[i].data
                for(let j = 0;j<24;j++){
                    array_data.push(target_plan[j].hour)
                    array_data.push(target_plan[j].minute)
                    array_data.push(target_plan[j].action)
                }
           
         
        }
        await PostPlanHT200({trama:array_data,ip:controlerState.ip})
        updateFirebase('plan',aux_data);
        dispatch(updateParamsHT200({target:'plan',data:aux_data}));
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
    const handleChange = (event) => {
        setCurrentPlan({
            ...currentPlan,
            [event.target.name]: event.target.value,
        });

    };
    return(
        <>    
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item md={12} xs={12} >
                        <h1>Plan HT200</h1>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} fullWidth onClick={readData}  >Leer Datos</Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" color='oscuro' sx={{ height: '100%' }}  fullWidth onClick={uploadData}>Cargar Datos</Button>
                    </Grid>
                    <Grid item md={6} xs={12} >
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
                    <Grid item md={12} xs={12} >
                    <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
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
                                    {currentTab
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row,index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                 <TableCell  align={"center"}>
                                                         <IconButton color="oscuro" aria-label="add an alarm" onClick={()=>{modificarPlan(row)}} >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton color="rojo" aria-label="add an alarm" >
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
        </>
    );
}

const columns = [
    { id: 'id', label: 'id', minWidth: 100 },
    { id: 'hour', label: 'Hour', minWidth: 100 },
    { id: 'minute', label: 'Minute', minWidth: 100 },
    { id: 'action', label: 'action', minWidth: 100 },
    // { id: 'special', label: 'Especial', minWidth: 100 },
    // { id: 'auxiliary', label: 'Auxiliar', minWidth: 100 },
];
