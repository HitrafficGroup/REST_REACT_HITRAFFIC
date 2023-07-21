import React, { useState } from "react"
import { SideNavInfo } from "../dashboard-info/side-nav-info";
import { TopNavInfo } from "../dashboard-info/top-nav-info";
import Container from '@mui/material/Container';
// imagenes
import individual_ref1 from '../assets/lonely.jpg';
import individual_ref2 from '../assets/config_equipos.jpg';
import i_ref2 from '../assets/filtros_individual.jpg';
import i_ref3 from '../assets/creacion_individual.jpg';
//
import Grid from '@mui/material/Grid';
import SimpleBar from "simplebar-react";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
export default function InfoView() {

    const [openNav, setOpenNav] = useState(false);



    return (
        <>
            <TopNavInfo onNavOpen={() => setOpenNav(true)} />
            <SideNavInfo open={openNav} onClose={() => setOpenNav(false)} />
            <SimpleBar style={{ height: "85vh" }}>
                <Container maxWidth="md" sx={{ marginTop: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <h3>Configuracion Individual</h3>
                            <p>
                                la vista de configuracion individual tiene como finalidad permitir el acceso a la programacion de cada controlador,
                                idependientemente , la vista de inicio de esta seccion nos indica todos los controladores que tenemos disponibles.
                            </p>
                            <SimpleBar dir="row">
                                <img src={individual_ref1} alt="" width={800} height={400} className="img-vistainfo" />
                            </SimpleBar>
                            <p>
                                la tabla tiene diferentes apartados cada uno indica cierta informacion de interes acerca de los controladores:
                            </p>
                            <ul>
                                <li> <strong>Ultima Conexion:</strong> Nos avisa de la ultima vez que se accedio a las configuraciones del controlador</li>
                                <li><strong>Nombre:</strong> Es el nombre con el cual se crea el controlador</li>
                                <li><strong>Online:</strong> Nos indica si actualmente el controlador se encuentra accesible, si esta en rojo significa que posiblemente el controlador
                                    este presentando algun tipo de fallo.</li>
                                <li><strong>Ip:</strong> Cuando se registra un nuevo controlador se le asigna una ip al controlador por ende este parametro nos indica la ip del controlador</li>
                                <li><strong>Modelo</strong> Hitraffic Sa dispone de varios modelos de controlador en este caso aqui nos indicara el moldeo actual del controlador</li>
                                <li><strong>Canton:</strong> Es el canton donde esta ubicado el controlador          </li>
                                <li><strong>Acciones:</strong> Existen 3 botones que nos permiten realizar diferentes acciones el primero es eliminar se puede distingir por el icono de <DeleteIcon color="rojo" />
                                    este boton nos permite eliminar el controlador en caso de ser necesario. el siguiente icono es el de ajustes el cual tiene el siguiente icono <SettingsIcon color="gris" /> , este boton nos da acceso  a una
                                    ventana con la posibilidad de configurar los datos del controlador tales como Nombre,Ip y Canton.
                                </li>
                            </ul>
                        </Grid>
                        <Grid item xs={12} md={4}>

                            <img src={individual_ref2} alt="" width={280} height={240} className="img-vistainfo" />

                        </Grid>
                        <Grid item xs={12} md={8}>
                            <p>
                                Cuando se cambien los valores dentro de los campos de texto se debera hacer click en el boton guardar,
                                esto ocasionara que se actualice la informacion de la base de datos del controlador. <strong>Nota:</strong>
                                es sumamente importante realizar el cambio del valor de la IP solo si se ha realizado el cambio fisico de la ip
                                del controlador, para ello debera acceder al controlador manualmente y realizar el cambio de Ip con el software original.
                                Si no se a realizado cambios en la Ip no se deberia cambiar este parametro ya que inabilitaria la comunicacion entre la central
                                y el controlador. El ultimo boton es el de informacion y tiene el siguiente aspecto <InfoIcon color="warning" /> , el boton de informacion nos
                                permite visualizar datos del controlador tales como , latitud - longitud - nombre - ip - mac y canton.
                            </p>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <h5>
                                Creacion y Filtrado de Nuevos Controladores
                            </h5>
                            <p>
                                La vista de inicio de las configuraciones individuales dispone de una seccion de filtros que nos
                                dan la capacidad de especificar los controladores de interes de acuerdo al modelo o al canton , una vez que se
                                selcciona el controlador o modelo objetivo se debe hacer click al boton filtrar , eso ocasionara que en la tabla solo aparezcan
                                los controladores especificos.  Adicionalmente tambien se pueden crear nuevos controladores haciendo click en el boton de crear
                                controlador , una vez que hace click le aparecera una ventana con un formulario para llenar.
                            </p>
                            <SimpleBar dir="row">
                                <img src={i_ref2} alt="" width={800} height={130} className="img-vistainfo" />
                            </SimpleBar>

                        </Grid>

                        <Grid item xs={12} md={6}>
                            <p>
                                Para la creación de los nuevos controladores, se deben seguir varios pasos importantes.
                                 En primer lugar, es fundamental contar con los datos del controlador,
                                  como su dirección IP y el Cantón donde se encuentra instalado.
                                A continuación, se procede a seleccionar el modelo específico del controlador que se desea crear.

                                Es crucial destacar que la IP del controlador debe coincidir exactamente
                                 con la configuración establecida en el mismo. De esta forma,
                                  se garantiza un correcto funcionamiento y conectividad del nuevo controlador.
                            </p>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <img src={i_ref3} alt="" width={350} height={240} className="img-vistainfo" />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <p>
                                Además, para obtener información precisa de latitud y longitud,
                                 es necesario que el GPS del controlador esté conectado y operativo
                                  durante el proceso de creación. En caso de que el controlador
                                   no esté en línea, no será posible generar el nuevo controlador.
                            </p>
                            <h3>
                                Configuración de Controladores
                            </h3>
                        </Grid>
                        <Grid item xs={12}>
                            <div style={{ height: 50 }}>

                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </SimpleBar>

        </>
    )

}

//https://www.amazon.com/-/es/navegaci%C3%B3n-posicionamiento-compatible-sensibilidad-precisi%C3%B3n/dp/B08MZ2CBP7/ref=sr_1_8?__mk_es_US=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2MN5BC2W05YNG&keywords=modulo+gps&qid=1689964999&sprefix=modulo+gps%2Caps%2C147&sr=8-8