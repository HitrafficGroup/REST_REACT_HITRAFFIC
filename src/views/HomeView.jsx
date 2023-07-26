import React from "react"
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import individual from '../assets/individual.jpg';
import grupal from '../assets/grupal.jpg';
import simulacion from '../assets/simulacion.jpg';
import manual from "../assets/manual_fondo.jpg"
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
export default function HomeView() {

    const navigate = useNavigate();



    return (

        <>
        <div  className="background-home"> 
            <Container  fixed>
                <Grid alignItems={"center"} container spacing={2}>
                    <Grid item xs={12}>
                        <div className="container-difuminado">
                            <h1  className="titulo-home">
                                HiTraffic Centralizacion
                            </h1>
                            <h3  className="subtitulo-home">
                                Sistema de Centralizacion para el monitoreo y manipulacion de controladores Remotamente
                            </h3>
           
                        </div>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Card sx={{ maxWidth: 345 }} onClick={()=>{navigate('/equipos')}}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={individual}
                                        alt="funcionamiento individual"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                        Configuración Individual de Controlador
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                        La plataforma de centralización proporciona un acceso sencillo a las configuraciones avanzadas del controlador, a través de una interfaz de usuario amigable. Su objetivo es simplificar el proceso de configuración de cada controlador para el usuario final.
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                            </Grid>
                            <Grid item md={4} xs={12}>
                            <Card sx={{ maxWidth: 345 }} onClick={()=>{navigate('/group_config')}}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={grupal}
                                        alt="funcionamiento grupal"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                        Configuración Grupal de Controladores
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            La aplicación de centralización cuenta con un módulo de configuración grupal que permite gestionar varios controladores simultáneamente. Esta funcionalidad resulta muy útil cuando se trata de administrar múltiples intersecciones al mismo tiempo.
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                            </Grid>
                            <Grid item md={4} xs={12}>
                            <Card sx={{ maxWidth: 345  }} onClick={()=>{navigate('/monitoreo')}}   >
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={simulacion}
                                        alt="simulacion"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                        Simulación de Intersección en Tiempo Real
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">

                                        La funcionalidad de simulación en tiempo real brinda al usuario la capacidad de visualizar el comportamiento del controlador de un semáforo en una ubicación específica. Esto se logra a través de una animación del área donde se encuentra el semáforo.    </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                            </Grid>
                            <Grid item md={6} xs={12}>
                            <Card sx={{ maxWidth: 500 }} onClick={()=>{navigate('/informacion')}}   >
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={manual}
                                        alt="simulacion"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                        Manual de Funcionamiento
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            La App de centralizacion dispone de su propio manual de usuario con la documentacion del funcionamiento de cada modulo
                                          </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                      
                    </Grid>
                    
                </Grid>

            </Container>
        </div>
        </>
    )






}
