import React, { useState } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { getSecuencyHT200,PostSecuenciasHT200 } from "../js/apiFunctionsHT200";
import Button from '@mui/material/Button';
import "../css/SecuencyHT200View.css";
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
//iconos
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useSelector, useDispatch } from 'react-redux';
export default function SecuencyHT200View() {

    const [secuencias, setSecuencias] = useState([{ data: [], id: '' }]);
    const [modalConfig, setModalConfig] = useState(false)
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [currentSeq,setCurrentSeq]= useState([{}]);
    const [idSeq,setIdSeq] = useState();
    const controlerState = useSelector(state => state.controlers)
    const readData = async () => {
        let data = await getSecuencyHT200(controlerState.ip);
        let data_formated = []
        data.forEach(element => {
            let aux_data = element.data
            let dictionario = {
                id: element.id,
                data: aux_data[0]
            }
            data_formated.push(dictionario)
        });

        setSecuencias(data_formated)
    }

    const configurarSecuencia = (__data) => {


        let seq_formated = __data.data.filter(item => item.value !== 0)
        setIdSeq(__data.id)
        setCurrentSeq(seq_formated)
        setModalConfig(true)
    }
    
    const agregarFasesSeq = ()=>{
        let aux_seq = JSON.parse(JSON.stringify(currentSeq))
        let newSeq = {
            id: 'paso-'+(currentSeq.length +1),
            value: parseInt(value)
        }
        
        aux_seq.push(newSeq)
        setCurrentSeq(aux_seq)
        
    }

    const guardarFase =()=>{
        let aux_seq = JSON.parse(JSON.stringify(secuencias))
        let formated_seq = JSON.parse(JSON.stringify(currentSeq))
        for(let i = 0; i<=16;i++){
            if(formated_seq.length < i){
                let custom_data = {
                    id:'paso-'+i,
                    value:0
                }
                formated_seq.push(custom_data)
            }
        }

        aux_seq.map((item)=>{
            if(item.id === idSeq){
                item.data = formated_seq
            }
        })
        setSecuencias(aux_seq)
        setModalConfig(false)
    }
    const eliminarFase = (__data)=>{
 
        let aux_seq = JSON.parse(JSON.stringify(currentSeq))
        let data_filter = aux_seq.filter(item=> item.id !== __data.id)
        if(data_filter.length >0){
            data_filter.map((item,index) =>{
                item.id = 'paso-'+(index+1)
            })
        }
      
        setCurrentSeq(data_filter)
      
    }

    const uploadData = async() =>{
        let data_formated = []
       
        let seq_target
        let aux_secuencias = JSON.parse(JSON.stringify(secuencias))
       
        for(let i = 0; i<16;i++){
            
            if(aux_secuencias.length > i){
                data_formated.push(i+1)
                seq_target = aux_secuencias[i].data
                console.log(seq_target)
                for(let x = 0; x<4;x++){
                    
                    if(x === 0){
                        data_formated.push(1)
                        for(let y = 0; y<16;y++){
                            data_formated.push(seq_target[y].value)
                        }
                    }else{
                        data_formated.push(0)
                        for(let y = 0; y<16;y++){
                            data_formated.push(0)
                        }
                    }
                }
            }else{
                data_formated.push(0)
                for(let x = 0; x<4;x++){
                    data_formated.push(0)
                    for(let y = 0; y<16;y++){
                        data_formated.push(0)
                        }
                }
                    
                }

            }
            console.log(data_formated.length)
            await PostSecuenciasHT200({trama:data_formated,ip:controlerState.ip})

    }
    return (

        <>
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid item xs={8} md={12} >
                        <h1>Secuencias</h1>
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <Button color='verde' variant="contained" onClick={readData}  >leer datos</Button>
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <Button color='oscuro' variant="contained"  onClick={uploadData} >Cargar datos</Button>
                    </Grid>
                    <Grid item xs={4} md={12}>
                        {/* <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Tabla</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Tabla"
                        >
                        <MenuItem value={10}>Tabla 1</MenuItem>
                        <MenuItem value={20}>Tabla 2</MenuItem>
                        <MenuItem value={30}>Tabla 3</MenuItem>
                        <MenuItem value={10}>Tabla 4</MenuItem>
                        <MenuItem value={10}>Tabla 5</MenuItem>
                        <MenuItem value={10}>Tabla 6</MenuItem>
                        <MenuItem value={10}>Tabla 7</MenuItem>
                        <MenuItem value={10}>Tabla 8</MenuItem>
                        </Select> */}
                        {/* </FormControl> */}
                    </Grid>
                    <Grid item xs={4}>
                        <div className="seq-div">

                            {secuencias.map((seq, index) => {

                                return (<div className="seq-container">
                                    <p key={index}>{seq.id}</p>
                                    <ul className="seq-list">
                                        <li className="list" >
                                            <IconButton aria-label="delete" color="oscuro"  onClick={()=>{configurarSecuencia(seq)}}  >
                                                <SettingsIcon />
                                            </IconButton>
                                        </li>
                                        {seq.data.map((item, index) => {
                                            return (
                                                <li className="list" key={index}>{item.value}</li>
                                            );
                                        })}
                                    </ul>
                                </div>);
                            })}
                        </div>
                    </Grid>
                    <Grid item xs={8}>

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

                        <Grid item xs={12} md={8}>
                            <Autocomplete
                                disableClearable
                
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}
                               
                                fullWidth
                                id="controllable-states-demo"
                                options={options}
                                
                                renderInput={(params) => <TextField {...params} label="Seleccionar Fase" />}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button variant="contained" fullWidth color="primary" onClick={()=>{agregarFasesSeq()}} sx={{ height: "100%" }} >
                                agregar
                            </Button>
                        </Grid>

                        <Grid item xs={12} md={12}>

                            <ul className="list-container-seq">
                                {currentSeq.map((item,index)=>{
                                    return(
                                    <li key={index} className="list-items-seq">
                                        <div className="fase-container">
                                        <p style={{margin:0}}>fase - {item.value}</p>
                                            <IconButton aria-label="delete" color="oscuro" onClick={()=>{eliminarFase(item)}}  >
                                                <CloseSharpIcon />
                                            </IconButton>
                                        </div>
                                      
                                    </li>
                                    );
                                })}
                               
                            </ul>

                        </Grid>
                    </Grid>
                </ModalBody>
                <ModalFooter >
                    <Button variant="contained" color="rojo" sx={{ marginLeft: 1 }} onClick={guardarFase}>
                        GUARDAR CAMBIOS
                    </Button>
                    <Button variant="contained" onClick={() => { setModalConfig(false) }} color="oscuro" sx={{ marginLeft: 1 }}>
                        cancelar
                    </Button>
                </ModalFooter>
            </Modal>
        </>

    );


}

let aux_data = [
    {
        phase: 1,
        ped_walk: 2,
        ped_clear: 3,
        mini_green: 4,
        passage: 5,
        max_green: 1,
        max_green2: 1,
        vehicle_yellow: 5,
        red_clear: 9,
        red_revert: 5,
        vehicle_clear: 8
    }
]

const columns = [
    { id: 'qw', label: 'seq1', minWidth: 100 },
    { id: 'cowede', label: 'seq2', minWidth: 100 },
    { id: 'w', label: 'seq3', minWidth: 100 },
    { id: 'wq', label: 'seq4', minWidth: 100 },
    { id: 'cs', label: 'seq5', minWidth: 100 },
    { id: '31', label: 'seq6', minWidth: 100 },
    { id: 'weq1', label: 'seq7', minWidth: 100 },
    { id: 'qww', label: 'seq8', minWidth: 100 },
];
const options = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16'];