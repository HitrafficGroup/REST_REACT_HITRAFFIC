import React ,{useState}from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import '../css/ControlersView.css';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
//iconos
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import CableIcon from '@mui/icons-material/Cable';
function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

function createData(name, calories, fat) {
    return { name, calories, fat };
}
const dataTest=[
    {name:'nombre 1',ip:'192.168.1.2',mac:'h3:ft:a2:l2',provincia:'azuay',estado:true},
    {name:'nombre 2',ip:'192.168.1.3',mac:'f3:f1:a2:t2',provincia:'loja',estado:false},
    {name:'nombre 3',ip:'192.168.1.4',mac:'gf3:12:fw:36',provincia:'pichincha',estado:false},
    {name:'nombre 4',ip:'192.168.1.5',mac:'f3:f1:a2:32',provincia:'guayas',estado:false},
    {name:'nombre 5',ip:'192.168.1.6',mac:'l3:fa1:a2:37',provincia:'cotopaxi',estado:true},
    {name:'nombre 6',ip:'192.168.1.7',mac:'f3:m1:a2:367',provincia:'el oro',estado:true},
    {name:'nombre 7',ip:'192.168.1.8',mac:'13:f1:a2:39',provincia:'zamora chinchipe',estado:true},
    {name:'nombre 8',ip:'192.168.1.9',mac:'f3:f1:a2:32',provincia:'azuay',estado:true},
    {name:'nombre 9',ip:'192.168.1.10',mac:'m3:f1:a2:88',provincia:'cañar',estado:false},
    {name:'nombre 10',ip:'192.168.1.11',mac:'n3:f1:s2:32',provincia:'loja',estado:false},
    {name:'nombre 11',ip:'192.168.1.12',mac:'f3:f1:a2:22',provincia:'azuay',estado:true}
]

export default function ControlersView() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataTest.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <>
            <Container maxWidth="md" sx={{paddingTop:3}}>
                <Grid container spacing={2}>
                    <Grid md={8} xs={12}>
                        <div className="card-admin"></div>
                    </Grid>
                    <Grid md={4} xs={12}>
                        <div className="card-admin"></div>
                    </Grid>
                    
                    <Grid md={12}>
                        <div className="shadow-table">
                     
                            <TableContainer component={Paper}>
                                <Table  aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="right">Ip</TableCell>
                                            <TableCell align="right">Mac</TableCell>
                                            <TableCell align="right">Canton</TableCell>
                                            <TableCell align="center">Estado</TableCell>
                                            <TableCell align="center">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? dataTest.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : dataTest
                                        ).map((row) => (
                                            <TableRow key={row.name}>
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell  align="right">
                                                    {row.ip}
                                                </TableCell>
                                                <TableCell  align="right">
                                                    {row.mac}
                                                </TableCell>
                                                <TableCell  align="right">
                                                    {row.provincia}
                                                </TableCell>
                                                <TableCell  align="center">
                                                    <Chip color={row.estado?'verde':'anaranjado1'}  size="small" label={row.estado?'conectado':'desconectado'} icon={<CableIcon />} />
                                                </TableCell>
                                                <TableCell  align="center">
                                                <Stack direction="row" spacing={1}>
                                                    <IconButton color="rojo" aria-label="editar">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton color="crema" aria-label="editar">
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton color="azulm" aria-label="editar">
                                                        <InfoIcon />
                                                    </IconButton>
                                                    </Stack>
                                                </TableCell>
                                                
                                            </TableRow>
                                        ))}

                                        {emptyRows > 0 && (
                                            <TableRow style={{ height: 72.8 * emptyRows }}>
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                colSpan={6}
                                                count={dataTest.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                SelectProps={{
                                                    inputProps: {
                                                        'aria-label': 'rows per page',
                                                    },
                                                    native: true,
                                                }}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                ActionsComponent={TablePaginationActions}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}
