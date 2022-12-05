import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import "../css/ResumenView.css";
export default function ResumenView() {

    return (
        <>
            <Container maxWidth="md" >
                <div className='titulos-resumen'>
                    <h4>Resumen del Controlador</h4>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>

                    </Grid>
                </Grid>
            </Container>
        </>
    );

}