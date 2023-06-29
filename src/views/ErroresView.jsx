
import CardController from "../components/CardController";
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { getErroresSW12 } from '../js/apiFunctionsSW12';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import "../css/ErroresView.css";
import { useSelector} from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';



export default function ErroresView() {
    const controlerState = useSelector(state => state.controlers);
    const [errores,setErrores] = useState([{}])
    const [deshabilitar,setDeshabilitar] = useState(true);
    const [deshabilitar2,setDeshabilitar2] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const getDatosFromRestApi = async () =>{
        try {
            setDeshabilitar2(true);
            let data = await getErroresSW12(controlerState.ip)
            let data_modify = data.map(item=>{
                item.minute = formatData(item.minute)
                item.hour =formatData(item.hour)
                item.year = "20"+formatData(item.year)
                item.seconds = formatData(item.seconds)
                item.day = devolverDia(item.day)
                return item
            })


            setErrores(data_modify.reverse());
            setDeshabilitar(false)
            setDeshabilitar2(false)
        } catch (error) {
            setDeshabilitar2(false)
        }
       

    }

    const devolverDia = (__data)=>{
       if(__data === 1){
            return 'Lunes';
        }else if(__data === 2){
            return 'Martes';
        }else if(__data === 3){
            return 'Miercoles';
        }else if(__data === 4){
            return 'Jueves';
        }else if(__data === 5){
            return 'Viernes';
        }else if(__data === 6){
            return 'Sabado';
        }else if(__data === 7){
            return 'Domingo';
        }


    }
    const formatData = (_data)=>{
        let data = _data.toString(16)
        if (data.length < 2) {
            data = "0" + data
        }
        return data
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    
    return (
        <>
            <Container maxWidth="md" >
                <div className='titulos-errores'>
                    <h4>Tabla de Registro de Errores</h4>
                </div>
                <Grid container spacing={2}>
                <Grid item md={4} xs={12}>
                    <Button color="verde2" sx={{height:'100%'}} fullWidth variant="contained" onClick={getDatosFromRestApi}>Leer Datos</Button>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Button variant="contained"   sx={{height:'100%',bgcolor:'#CB4335'}} disabled={deshabilitar} fullWidth onClick={getDatosFromRestApi}  endIcon={<PictureAsPdfIcon />}>Generar PDF</Button>
                </Grid>
                <Grid item xs={12}>
                <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                            <TableCell
                                                key={"date"}
                                                align={"left"}
                                                style={{ minWidth: 50 }}
                                            >
                                                Fecha
                                            </TableCell>
                                            <TableCell
                                                key={"hour"}
                                                align={"left"}
                                                style={{ minWidth: 50 }}
                                            >
                                                Hora
                                            </TableCell>
                                            <TableCell
                                                key={"event"}
                                                align={"center"}
                                                style={{ minWidth: 100 }}
                                            >
                                                Evento
                                            </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {errores
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row,index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                <TableCell  align={"left"}>
                                                     {row.year}-{row.month}-{row.date}
                                                </TableCell> 
                                                 <TableCell  align={"left"}>
                                                     {row.hour}:{row.minute}:{row.seconds}
                                                </TableCell> 
                                                <TableCell  align={"center"}>
                                                     Se Encendido
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
                            count={errores.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Grid>
             

                </Grid>
                <div style={{height:15}}>

                </div>
            </Container>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deshabilitar2}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <CardController/>
        </>
    );

}

