import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import "../css/ClonacionView.css"
export default function ClonacionView(){

    return(
        <>
        <Container maxWidth="md" >
            <div className='titulos-clonacion'>
                <h4>Clonacion del Controlador</h4>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={12}>

                </Grid>
            </Grid>
        </Container>
    </>
    );
}