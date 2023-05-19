import React, { useState } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { getSecuencyHT200 } from "../js/apiFunctionsHT200";
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "../css/SecuencyHT200View.css";
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
//iconos
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
const options = ['Option 1', 'Option 2'];
export default function SecuencyHT200View() {

    const [secuencias, setSecuencias] = useState([{ data: [], id: '' }]);
    const [modalConfig, setModalConfig] = useState(false)
    const [value, setValue] = useState(options[0]);
    const [inputValue, setInputValue] = useState('');
    const [currentSeq,setCurrentSeq]= useState([{}]);

    const readData = async () => {
        let data = await getSecuencyHT200("23:45:15:56", "192.168.1.122");
        let data_formated = []
        data.forEach(element => {
            let aux_data = element.data
            let dictionario = {
                id: element.id,
                data: aux_data[0]
            }
            data_formated.push(dictionario)
        });
        console.log(data_formated)
        setSecuencias(data_formated)
    }

    const configurarSecuencia = (__data) => {

        console.log(__data)

        let seq_formated = __data.data.filter(item => item.value !== 0)

        console.log(seq_formated)
        setCurrentSeq(seq_formated)
        setModalConfig(true)
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
                        <Button color='oscuro' variant="contained"   >Cargar datos</Button>
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
                                            <IconButton aria-label="delete" color="oscuro" onClick={() => { configurarSecuencia(seq) }} >
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
                                value={value}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}
                                inputValue={inputValue}
                                onInputChange={(event, newInputValue) => {
                                    setInputValue(newInputValue);
                                }}
                                fullWidth
                                id="controllable-states-demo"
                                options={options}

                                renderInput={(params) => <TextField {...params} label="Controllable" />}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button variant="contained" fullWidth color="primary" sx={{ height: "100%" }} >
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
                                            <IconButton aria-label="delete" color="oscuro"  >
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
                    <Button variant="contained" color="rojo" sx={{ marginLeft: 1 }}>
                        guardar cambios
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