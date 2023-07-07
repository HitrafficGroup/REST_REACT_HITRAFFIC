
import React, { useState } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { getRegErrores } from "../../js/apiFunctionsHT200";
import { useSelector } from 'react-redux';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CardControllerHT200 from "../../components/CardControllerHT200";
export default function RegistroErroresHT200View() {
    const controlerState = useSelector(state => state.controlerht200);
    const [data, setData] = useState([{}]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const readData = async () => {
        let controller_data = await getRegErrores(controlerState.ip)
        console.log(controller_data)
        let data_modify = controller_data.map(item => {
            item.minute = formatData(item.minute)
            item.hour = formatData(item.hour)
            item.year = "20" + formatData(item.year)

            item.day = devolverDia(item.day)
            return item
        })
        setData(data_modify)
    }
    const devolverDia = (__data) => {
        if (__data === 1) {
            return 'Lunes';
        } else if (__data === 2) {
            return 'Martes';
        } else if (__data === 3) {
            return 'Miercoles';
        } else if (__data === 4) {
            return 'Jueves';
        } else if (__data === 5) {
            return 'Viernes';
        } else if (__data === 6) {
            return 'Sabado';
        } else if (__data === 7) {
            return 'Domingo';
        }


    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const formatData = (_data) => {
        let data = _data.toString(16)
        if (data.length < 2) {
            data = "0" + data
        }
        return data
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (<>
        <Container maxWidth="md" sx={{ paddingTop: 6 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Button variant="contained"  fullWidth color="verde2" sx={{ height: '100%' }} onClick={readData}>LEER DATOS</Button>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Button variant="contained" endIcon={<PictureAsPdfIcon/>} fullWidth color="rojo" sx={{ height: '100%' }} onClick={readData}>GENERAR REPORTE</Button>
                </Grid>
                <Grid item xs={12} md={12}>
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
                                {data
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                <TableCell align={"left"}>
                                                    {row.year}-{row.month}-{row.date} {row.day}
                                                </TableCell>
                                                <TableCell align={"left"}>
                                                    {row.hour}:{row.minute}:{row.seconds}
                                                </TableCell>
                                                <TableCell align={"center"}>
                                                    Se Encendio
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


        <CardControllerHT200 />



    </>);
}