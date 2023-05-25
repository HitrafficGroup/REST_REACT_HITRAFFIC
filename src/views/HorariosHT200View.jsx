import React, { useState } from "react";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { getHorarioHT200 } from "../js/apiFunctionsHT200";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TextField from '@mui/material/TextField';

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

export default function HorariosHT200View(){

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [modalConfig,setModalConfig] = useState(false);
    const [data,setData] = useState([{}]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const readData = async()=>{
        let data = await getHorarioHT200("23:45:15:56", "192.168.1.122");
        setData(data)
        console.log(data)
    }
    const uploadData = ()=>{
        //
    }
    const modificarHorario =(__data)=>{
        console.log(__data)
        let aux_complement = [0,0,0,0,0,0,0,0]
        let temp = __data.m1
        let aux_byte1 = ("00000000"+temp.toString(2)).substr(-8)
        

        let aux_mes = __data.month
        let mes_complement_2 =  aux_mes.toString(2)
       // console.log(mes_complement_2)
        for(let i = 0; i<aux_byte1.length;i++){
            aux_complement[i] = parseInt(aux_byte1[i])
        }
        console.log(compararIndices(aux_complement,mes_byte1))
    }
   
    const compararIndices =(arr1, arr2)=> {
        var resultado = [];
      
        for (var i = 0; i < arr1.length; i++) {
          if (arr1[i] === 1) {
            resultado.push(arr2[i]);
          }
        }
      
        return resultado;
      }
    return(
        <>
              <Container maxWidth="md">
                <h1 style={{ marginBottom: 20 }}>Vista Horarios</h1>
                <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                        <Button variant="contained" color='verde2' sx={{ height: '100%' }} fullWidth onClick={readData}  >Leer Datos</Button>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <Button variant="contained" color='oscuro' sx={{ height: '100%' }}  fullWidth onClick={uploadData}>Cargar Datos</Button>
                    </Grid>
                    <Grid item md={12} xs={12}>
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
                                    {data
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row,index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
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
                                                         <IconButton color="oscuro" aria-label="add an alarm" onClick={()=>{modificarHorario(row)}} >
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
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    )


}

const columns = [
    { id: 'id', label: 'id', minWidth: 100 },
    { id: 'day_plan', label: 'Plan', minWidth: 100 },
    { id: 'month', label: 'Mes', minWidth: 100 },
    { id: 'date', label: 'fecha', minWidth: 100 },
    { id: 'day', label: 'dia', minWidth: 100 },
    // { id: 'special', label: 'Especial', minWidth: 100 },
    // { id: 'auxiliary', label: 'Auxiliar', minWidth: 100 },
];
let mes_byte1 = ['julio','junio','mayo','abril','marzo','febrero','enero','']