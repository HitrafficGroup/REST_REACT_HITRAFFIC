import React,{useState} from 'react';
import Select from '@mui/material/Select';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
export default function HorariosView(){
    const [horarios,setHorarios] = useState([

    ]);
    return(
        <>
      <Container maxWidth="md">
                <h1>Horarios View</h1>
                <Grid item xs={12}>
                <Table className='home-t'>
                            <Thead>
                                <Tr>

                                    <Th className='home-t-th'>Nro</Th>
                                    <Th className='home-t-th'>Hora de Inicio</Th>
                                    <Th className='home-t-th'>Modo Operativo</Th>
                                    <Th className='home-t-th'>Plan No.</Th>
                                    <Th className='home-t-th'>Desfase</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {horarios.map((dato, index) => (
                                    <Tr key={index} >
                                        <Td>
                                            {dato.name}
                                        </Td>
                                        <Td >
                                1

                                        </Td>
                                        <Td >
                               1
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                </Grid>
            </Container> 
        </>
    );
    
    }