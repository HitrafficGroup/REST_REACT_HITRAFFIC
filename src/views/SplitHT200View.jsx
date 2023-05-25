import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from '@mui/material/Button';
import { getSplitHT200,PostSplitHT200} from "../js/apiFunctionsHT200";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
//iconos
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
export default function SplitHT200View() {

    const [splitTab, setSplitTab] = useState("split-1");
    const [splits, setSplits] = useState([{}]);
    const [currentTab, setCurrentTab] = useState([{}]);
    const [modalConfig, setModalConfig] = useState(false);
    const [currentSplit, setCurrentSplit] = useState({ tiempo: 0 });
    const readData = async () => {
        let data = await getSplitHT200("23:45:15:56", "192.168.1.122");

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 16; j++) {

                let target = data[i].data[j].mode
                if (target === 1) {
                    data[i].data[j].mode = "Otro"
                } else if (target === 2) {
                    data[i].data[j].mode = "Ninguno"
                } else if (target === 3) {
                    data[i].data[j].mode = "Minimun Vehicle Recall"
                } else if (target === 4) {
                    data[i].data[j].mode = "Maximun Vehicle Recall"
                } else if (target === 5) {
                    data[i].data[j].mode = "Pedestrian Recall"
                } else if (target === 6) {
                    data[i].data[j].mode = "Maximun vehicle Pedestrian Recall"
                }  else if (target === 7) {
                    data[i].data[j].mode = "Phase Omitted"
                }else {
                    data[i].data[j].mode = "Ninguno"
                }

            }
        }

        setSplits(data)
        setCurrentTab(data[0].data)
        setSplitTab("split-1");

    }

    const handleSplit = (event) => {
        setSplitTab(event.target.value);

        let split_actual = splits.filter((item) => item.id === event.target.value)
        setCurrentTab(split_actual[0].data);
    };



    const handleChange = (event) => {
        setCurrentSplit({
            ...currentSplit,
            [event.target.name]: event.target.value,
        });

    };

    const modficarSplit = (__data) => {
        setModalConfig(true)
        setCurrentSplit(__data)


    }
    const aplicarCambios = () => {
        let aux_data = JSON.parse(JSON.stringify(currentSplit))
        let aux_split = JSON.parse(JSON.stringify(currentTab))
        aux_data.coord = parseInt(aux_data.coord)
        aux_data.tiempo = parseInt(aux_data.tiempo)
        let flag = true
        let split_edited = []
        console.log(aux_data)
        if(aux_data.fase === 0){
            for(let i = 0;i<16;i++){
                if( aux_split[i].fase === 0){
                    if(flag){
                        aux_data.fase = i+1
                        split_edited.push(aux_data)
                        flag = false
                    }else{
                        split_edited.push(aux_split[i])
                    }
                }else{
                    split_edited.push(aux_split[i])
                }
            }

        }else{
            split_edited = aux_split.map((item) => {

                if (aux_data.fase === item.fase) {
                    return aux_data
                } else {
                    return item
                }
            })
        }
      
        setCurrentTab(split_edited)
        setModalConfig(false)
    }

    const uploadData = async() =>{
      

        let array_data = []
        let aux_splits = JSON.parse(JSON.stringify(splits))
        let data = aux_splits.map((item) => {
            if(item.id === splitTab){
                return {data:  JSON.parse(JSON.stringify(currentTab)),id:splitTab}

            }else{
                return item;
            }
        })

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 16; j++) {

                let target = data[i].data[j].mode
                if (target === "Otro") {
                    data[i].data[j].mode = 1
                } else if (target === "Ninguno") {
                    data[i].data[j].mode = 2
                } else if (target === "Minimun Vehicle Recall") {
                    data[i].data[j].mode = 3
                } else if (target === "Maximun Vehicle Recall") {
                    data[i].data[j].mode = 4
                } else if (target === "Pedestrian Recall") {
                    data[i].data[j].mode = 5
                } else if (target === "Maximun vehicle Pedestrian Recall") {
                    data[i].data[j].mode = 6
                } else if (target === "Phase Omitted") {
                    data[i].data[j].mode = 7
                }else {
                    data[i].data[j].mode = 0
                }

            }
        }
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 16; j++) {
                let target = data[i].data[j].fase
                if(target === 0){
                    data[i].data[j].mode = 0
                    data[i].data[j].coord = 0
                    data[i].data[j].tiempo = 0
                }
            }
        }
        console.log(data)
        for(let i = 0; i<20;i++){
            array_data.push(i+1)
            if(i<8){
                let target_array = data[i].data
                for(let j = 0; j<16;j++){
                    array_data.push(target_array[j].fase)
                    array_data.push(target_array[j].tiempo)  
                    array_data.push(target_array[j].mode)    
                    array_data.push(target_array[j].coord)  
                }
            }else{
                for(let j = 0; j<16;j++){
                    array_data.push(0)
                    array_data.push(0)  
                    array_data.push(0)    
                    array_data.push(0)  
                }
            }
        }
   
        await PostSplitHT200({trama:array_data,mac:"12:32:12:23"})
    }
    const eliminarSplit = (__data) =>{
        let custom_delete = {fase:0,mode:"Ninguno",tiempo:0,coord:0}
        if(__data.fase !== 0){
          
            let aux_split = JSON.parse(JSON.stringify(currentTab))
            console.log("eliminamos: ",__data)
            let temp = aux_split.filter(item => item.fase !== __data.fase)
            temp.push(custom_delete)
          
            setCurrentTab(temp)
        }else{

        }

    }

    return (
        <>
            <Container maxWidth="md">
                <h1>Vista Split</h1>
                <Grid container spacing={2}>
                   

                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Split Tab</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={splitTab}
                                label="split tab"
                                onChange={handleSplit}
                            >
                                <MenuItem value={"split-1"}>ciclo 1</MenuItem>
                                <MenuItem value={"split-2"}>ciclo 2</MenuItem>
                                <MenuItem value={"split-3"}>ciclo 3</MenuItem>
                                <MenuItem value={"split-4"}>ciclo 4</MenuItem>
                                <MenuItem value={"split-5"}>ciclo 5</MenuItem>
                                <MenuItem value={"split-6"}>ciclo 6</MenuItem>
                                <MenuItem value={"split-7"}>ciclo 7</MenuItem>
                                <MenuItem value={"split-8"}>ciclo 8</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} fullWidth onClick={readData}  >Leer Datos</Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" sx={{ height: '100%' }} color='oscuro' fullWidth onClick={uploadData}>Cargar Datos</Button>
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <Table className='home-t'>
                            <Thead>
                                <Tr>
                                    <Th className='home-t-th'>Fase</Th>
                                    <Th className='home-t-th'>Tiempo</Th>
                                    <Th className='home-t-th'>Mode</Th>
                                    <Th className='home-t-th'>Fase Coordinada</Th>
                                    <Th className='home-t-th'>Fase Clave</Th>
                                    <Th className='home-t-th'>Fase Fija</Th>
                                    <Th className='home-t-th'>Acciones</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {currentTab.map((dato, index) => (
                                    <Tr className="tablas-focus" key={index} >
                                        <Td>
                                            {dato.fase}
                                        </Td>
                                        <Td >
                                            {dato.tiempo}
                                        </Td>

                                        <Td >
                                            {dato.mode}
                                        </Td>
                                        <Td >
                                            {dato.coord === 1 ? <DoneIcon color="verde2" /> : <ClearIcon color="gris" />}
                                        </Td>
                                        <Td >
                                            {dato.coord === 2 ? <DoneIcon color="verde2" /> : <ClearIcon color="gris" />}
                                        </Td>
                                        <Td >
                                            {dato.coord === 4 ? <DoneIcon color="verde2" /> : <ClearIcon color="gris" />}
                                        </Td>
                                        <Td >
                                            <div className="horarios-t-buttons">
                                                <IconButton color="oscuro" aria-label="add an alarm" onClick={() => { modficarSplit(dato) }} >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="rojo" aria-label="add an alarm" onClick={() => { eliminarSplit(dato) }}>
                                                    <DeleteIcon />
                                                </IconButton>

                                            </div>

                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <div style={{height:80}}>

                        </div>
                    </Grid>

                </Grid>
            </Container>
            <Modal isOpen={modalConfig} >
                <ModalHeader>
                    <div>
                        <h1>
                            Editar
                        </h1>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <Grid container spacing={4}>

                        <Grid item xs={12} md={6}>
                            <TextField id="outlined-basic" label="Tiempo" variant="outlined" name="tiempo" onChange={handleChange} value={currentSplit.tiempo} type="number" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Modo</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentSplit.mode}
                                    label="split tab"
                                    name="mode"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"Otro"}>Otro</MenuItem>
                                    <MenuItem value={"Ninguno"}>Ninguno</MenuItem>
                                    <MenuItem value={"Minimun Vehicle Recall"}>Minimun Vehicle Recall</MenuItem>
                                    <MenuItem value={"Maximun Vehicle Recall"}>Maximun Vehicle Recall</MenuItem>
                                    <MenuItem value={"Pedestrian Recall"}>Pedestrian Recall</MenuItem>
                                    <MenuItem value={"Maximun vehicle Pedestrian Recall"}>Maximun vehicle Pedestrian Recall</MenuItem>
                                    <MenuItem value={"Phase Omitted"}>Phase Omitted</MenuItem>
                                    <MenuItem value={"No declarado"}>sin seleccionar</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <FormControl>
                                <FormLabel id="demo-controlled-radio-buttons-group">Seleccionar Coord</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="coord"
                                    value={currentSplit.coord}
                                    onChange={handleChange}
                                    row
                                >
                                    <FormControlLabel value={1} control={<Radio />} label="Fase Clave" />
                                    <FormControlLabel value={2} control={<Radio />} label="Fase Fija" />
                                    <FormControlLabel value={4} control={<Radio />} label="Fase Coord" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color="rojo" sx={{ marginLeft: 1 }} onClick={aplicarCambios} >
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