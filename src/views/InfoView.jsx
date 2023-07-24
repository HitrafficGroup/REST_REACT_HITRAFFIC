import React, { useState } from "react"
import { SideNavInfo } from "../dashboard-info/side-nav-info";
import { TopNavInfo } from "../dashboard-info/top-nav-info";
import Container from '@mui/material/Container';
// imagenes
import individual_ref1 from '../assets/lonely.jpg';
import individual_ref2 from '../assets/config_equipos.jpg';
import i_ref2 from '../assets/filtros_individual.jpg';
import i_ref3 from '../assets/creacion_individual.jpg';
import i_ref4 from '../assets/tiempos_i.jpg';
import i_ref5 from '../assets/mapa_i.jpg';
import i_ref6 from '../assets/crear_semaforo.jpg';
import i_ref7 from '../assets/mapa_configured_i.jpg';
import i_ref8 from '../assets/manual_i.jpg';
import i_ref9 from "../assets/unit.jpg";
import i_ref10 from "../assets/basic_plan.jpg";
import i_ref11 from "../assets/basic_info1.jpg";
import i_ref12 from "../assets/planes_creados.jpg";
import i_ref13 from "../assets/crear_fase.jpg";
import i_ref14 from "../assets/secuencias_ring.jpg";
import i_ref15 from "../assets/split_config.jpg";
import i_ref16 from "../assets/patron_config.jpg";
import i_ref17 from "../assets/accion config.jpg";
//
import Grid from '@mui/material/Grid';
import SimpleBar from "simplebar-react";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import Chip from '@mui/material/Chip';
import RoomIcon from '@mui/icons-material/Room';
import Button from '@mui/material/Button';
import LightModeIcon from '@mui/icons-material/LightMode';
//
import Fab from '@mui/material/Fab';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
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
                            <p>Para acceder a las configuraciones del controlador debe hacer clic en el boton  <Button variant="contained" color="oscuro" >Programar</Button> en el controlador
                                al cual se requiere configurar , esto provocara que se redireccione a una nueva vista donde dispondra de un menu con todas las
                                posibles configuraciones que se pueden realizar dentro del controlador. Al inicio la aparecera una vista Informativa del controlador
                                dentro de esa vista podra ver datos como la hora del controlador , la ip etc. se dispone tambien el acceso a un mapa con la capacidad
                                de simular el funcionamiento en tiempo real de la interseccion donde se instalo en controlador de trafico , Adicionalmente tendra acceso
                                a el control manual del dispositivo.
                            </p>
                            <SimpleBar dir="row">
                                <img src={i_ref4} alt="" style={{ marginBottom: 14 }} width={800} height={250} className="img-vistainfo" />
                            </SimpleBar>
                            <h5>
                                Configuración del Mapa del Controlador
                            </h5>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <img src={i_ref5} alt="" width={330} height={140} className="img-vistainfo" />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <p>
                                El mapa nos proporciona una ayuda visual del comportamiento de la
                                interseccion en tiempo real. para ver en accion esta simulacion es necesario darle click al boton play <Fab color="success" aria-label="add" size="small" >{<PlayCircleOutlineIcon />}</Fab> ,
                                sin embargo en el caso de querer modificar los puntos que representan a los grupos configurados , es necesario desplazar el icono <RoomIcon color="error" /> de ubicacion
                            </p>
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <p>
                                Una vez que hayas desplazado el icono de ubicación a la posición deseada, es importante hacer clic en el botón "Guardar ubicación". <Fab color="info" sx={{ marginLeft: 1, marginRight: 1 }} aria-label="add" size="small" >{<SaveIcon />}</Fab>
                                Al hacerlo, se desplegará una ventana con un formulario que te permitirá agregar la nueva área que representará el grupo que deseas
                                configurar. Cada grupo se refiere a la forma en que se configuró la intersección en particular, por lo tanto, será necesario especificar
                                los puntos de interés que deseas observar para comprender su comportamiento.
                            </p>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <img src={i_ref6} alt="" width={300} height={200} className="img-vistainfo" />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <p>
                                Cuando se termina de configurar el mapa obtendrá como resultado un mapa listo para ayudar al proceso de monitoreo de las intersecciones de interés.
                            </p>
                        </Grid>
                        <Grid item xs={12}>

                            <SimpleBar dir="row">
                                <img src={i_ref7} style={{ marginBottom: 15 }} alt="" width={800} height={320} className="img-vistainfo" />
                            </SimpleBar>
                            <h3>
                                Uso del  Control Manual
                            </h3>
                            <p>
                                La funcionalidad de control manual ofrece al usuario la capacidad de enviar comandos instantáneos a los controladores para que se activen de inmediato después de recibir la orden correspondiente. Sin embargo, para asegurar un funcionamiento adecuado, es necesario establecer previamente un valor de tiempo para desactivar el modo manual. Una vez transcurrido ese tiempo, el controlador volverá automáticamente al modo automático, evitando así quedar enclavado en el modo manual y permitiendo que retome sus funciones normales.
                            </p>
                            <p>
                                Esta configuración es importante para garantizar una transición fluida entre el control manual y automático, evitando posibles inconvenientes y asegurando un comportamiento óptimo del sistema. Así, el usuario podrá contar con el control total cuando sea necesario, mientras se mantiene la operación automática habitual del controlador en otras situaciones.
                            </p>
                            <SimpleBar dir="row">
                                <img src={i_ref8} alt="" style={{ marginBottom: 14 }} width={800} height={350} className="img-vistainfo" />
                            </SimpleBar>
                            <h5>
                                Funciones del Control Manual
                            </h5>
                            <ul>
                                <li><strong>Destello:</strong> Manda a destellar a los grupos del controlador objetivo</li>
                                <li><strong>Todo en Rojo:</strong> Todos los grupos se ponen en Rojo</li>
                                <li><strong>Apagado:</strong> Apaga las salidas del controlador y por ende los grupos se apagan.</li>
                                <li><strong>Siguiente Paso:</strong> Dependiendo de la fase en la que se encuentre, manda a ejecutar la siguiente fase que sigue en la secuencia</li>
                                <li><strong>Mantener el Paso</strong> Se queda enclavado en una fase en específico.</li>
                                <li><strong>Pasar a Automatico:</strong>Nos devuelve al modo de funcionamiento normal</li>
                            </ul>
                            <h3>
                                Configuración de Parámetros Iniciales
                            </h3>
                            <p>
                                la configuracion de parametros iniciales establece por defecto los tiempos maximos y minimos
                                que se pueden ser configurados en los controladores , adicionalmente tambien nos facilita la
                                configuracion de que tipo de errores va a capturar para el registro de errores.
                            </p>
                            <SimpleBar dir="row">
                                <img src={i_ref9} alt="" style={{ marginBottom: 14 }} width={800} height={220} className="img-vistainfo" />
                            </SimpleBar>
                            <h3>
                                Configuración Basica
                            </h3>
                            <p>
                                La Configuración Básica es una herramienta que simplifica la programación del controlador, ya que nos permite programarlo sin tener que acceder a cada una de las pestañas de configuración y modificar los valores manualmente. En esencia, esta vista genera automáticamente todas las configuraciones necesarias para lograr el resultado deseado de manera más eficiente. Así, podemos ahorrar tiempo y esfuerzo al obtener rápidamente el controlador listo para su funcionamiento óptimo.
                            </p>
                            <h5>
                                Configuración de un nuevo plan
                            </h5>
                            <SimpleBar dir="row">
                                <img src={i_ref11} alt="" style={{ marginBottom: 14 }} width={800} height={150} className="img-vistainfo" />
                            </SimpleBar>
                            <ol>
                                <li>Haz clic en el botón "Agregar Paso".</li>
                                <li>Asegúrate de contar con al menos 2 pasos para habilitar el botón "Crear Plan".</li>
                                <li>Especifica la duración de cada paso, que hace referencia al tiempo estimado de ejecución de cada secuencia.</li>
                                <li>Establece el horario en el cual deseas activar este plan.</li>
                                <li>Modifica el estado de encendido de los grupos que puede estar entre "verde o rojo" de acuerdo a tus necesidades para ello haz clic en  <Chip label={"VERDE"} color={"verde"} icon={<LightModeIcon />} sx={{ width: '100px' }} /> para cambiar a rojo
                                    y clic en <Chip label={"ROJO"} color={"rojo"} icon={<LightModeIcon />} sx={{ width: '100px' }} /> para cambiar a verde .
                                </li>
                            </ol>
                            <Alert variant="outlined" severity="warning">
                                <AlertTitle>Warning</AlertTitle>
                                En caso de no <strong>modificar</strong>  algunos parametros de esta utilidad  por defecto establecera los datos de duracion de paso en 10s y horario del plan
                                a las 0:0 horas.
                            </Alert>
                            <p>cuando se utiliza esta utilidad el sistema de centralizacion afecta directamente a los siguientes parametros del controlador:<strong> "pattern","fases","split","acction","channel"</strong>, tambien
                                se debe tener en cuenta que cada grupo tiene asignado por defecto una fase.</p>
                            <ul>
                                <li><strong>Grupo1:</strong> por defecto fase 1</li>
                                <li><strong>Grupo2:</strong> por defecto fase 2</li>
                                <li><strong>Grupo3:</strong> por defecto fase 3</li>
                                <li><strong>Grupo4:</strong> por defecto fase 4</li>
                            </ul>
                            <p>
                                si siguio todos los pasos como se especifico en esta seccion ,se le habilitara finalmente el boton de agregar plan y se agregara su nuevo plan a la base de datos.
                            </p>
                            <SimpleBar dir="row">
                                <img src={i_ref10} alt="" style={{ marginBottom: 14 }} width={800} height={210} className="img-vistainfo" />
                            </SimpleBar>
                            <p>
                                Cada tabla generada se muestra gráficamente en la parte inferior de la vista, permitiéndonos visualizar todos los planes creados. Si deseas eliminar algún plan en específico, simplemente haz clic en el botón de "Eliminar plan".
                            </p>
                            <SimpleBar dir="row">
                                <img src={i_ref12} alt="" style={{ marginBottom: 14 }} width={800} height={240} className="img-vistainfo" />
                            </SimpleBar>
                            <h3>
                                Configuración de Fases
                            </h3>
                            <p>
                                El propósito de las fases es activar las salidas de los grupos de acuerdo con la secuencia especificada. Puedes declarar hasta un máximo de 16 fases, según
                                las necesidades de la intersección.Para agregar cada fase, simplemente haz clic en el botón "Agregar Fase", y automáticamente se desplegarán todas las opciones de configuración necesarias.
                            </p>

                        </Grid>
                        <Grid item xs={12} md={5}>
                            <SimpleBar dir="row">
                                <img src={i_ref13} alt="" style={{ marginBottom: 14 }} width={320} height={350} className="img-vistainfo" />
                            </SimpleBar>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <p>
                                <strong>Verde Peatonal:</strong> es el tiempo que estara activo en modo peatonal esa fase.
                            </p>
                            <p>
                                <strong>Destello Peatonal:</strong> es el tiempo en destello del grupo en modo peatonal.
                            </p>

                            <p>
                                <strong>Minimo en Verde:</strong> es el tiempo minimo en verde que va estar el semaforo peatonal.
                            </p>
                            <p>
                                <strong>Tiempo en Amarillo:</strong> es el tiempo en amarillo de la fase.
                            </p>
                            <p>
                                <strong>Maximo en Verde 1:</strong> es el tiempo maximo que puede estar en verde.
                            </p>
                            <p>
                                <strong>Tiempo Todo en Rojo:</strong> es el tiempo en rojo de la fase.
                            </p>
                            <p>
                                <strong>Tiempo de Destello en verde:</strong> tiempo que va durar el destello en verde de esa fase.
                            </p>
                        </Grid>
                        <Grid item xs={12}>
                            Las Fases creadas pueden ser editadas haciendo clic en el boton de ajustes <SettingsIcon color="gris" /> , entre los ajustes
                            que nos indicara un formulario similar al de crear para configurar las fases del controlador , en el caso
                            de que se requiera eliminar puede hacer cliic en el boton <DeleteIcon color="rojo" />
                            <h3>
                                Configuración de Secuencias
                            </h3>
                            <p>las secuencias se encargan de ir ejcutando las fases secuencialmente o en parallelo , dependiendo de la configuracion que se establezca</p>


                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ol>
                                <li>
                                    Seleccione el anillo (ring) que desea modificar y haga clic en el icono de ajustes dentro de la ventana de configuración de secuencias.
                                </li>
                                <li>
                                    En la ventana de configuración, podrá seleccionar las fases que se ejecutarán secuencialmente para el anillo seleccionado.
                                </li>
                                <li>
                                    Si desea que se ejecuten fases en paralelo, simplemente seleccione otro anillo y repita el paso anterior.
                                </li>
                            </ol>
                            <p><strong>nota: </strong>Cada anillo ejecuta en paralelo las fases que se programen en su secuencia, en relación con los demás anillos.</p>

                        </Grid>
                        <Grid item xs={12} md={6}>
                            <img src={i_ref14} alt="" width={310} height={340} className="img-vistainfo" />
                        </Grid>
                        <Grid item xs={12} >
                            <h3>
                                Configuración de los Tiempos de Fase
                            </h3>
                            <p>
                                La ventana permite la configuración de hasta 20 tiempos diferentes y cada una puede contener hasta 16 fases con tiempos y parámetros asignados de funcionamiento.
                            </p>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <img src={i_ref15} alt="" style={{ marginBottom: 14 }} width={320} height={270} className="img-vistainfo" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ol>
                                <li>
                                    Seleccione la fase que quiere configurar el tiempo.
                                </li>
                                <li>
                                    en el campo duracion asignele el tiempo de ejecucion de dicha fase.
                                </li>
                                <li>
                                    Seleccione el modo de funcionamiento.
                                </li>
                                <li>
                                    Escoga el tipo de fase a conveniencia.
                                </li>
                                <li>
                                    Finalmente de click en aceptar y vea los cambios reflejados en la tabla, tambien puede modificar el tiempo de una fase ya configurada.
                                </li>
                            </ol>
                        </Grid>
                        <Grid item xs={12} >
                            <h3>
                                Configuración de Patrón
                            </h3>
                            <p>
                                Nos permite la configuración del desfase, secuencia, tiempo y modo operativo,
                                además de calcular automáticamente el ciclo de trabajo en función al numero de secuencia y tiempo ingresado.
                            </p>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ol>
                                <li>
                                    Seleccione el patron que quiere configurar.
                                </li>
                                <li>
                                    Asigenele un ciclo que se se configuro en la vista de tiempos de fase.
                                </li>
                                <li>
                                    Escoga el modo de tabajo del controlador .
                                </li>
                                <li>
                                    Proporcione el valor de desfase en caso de que requiera este campo.
                                </li>
                                <li>
                                    Escoga el tipo de secuencia que va ejecutar.
                                </li>
                                <li>
                                    Acepte los cambios dando clic en aceptar.
                                </li>
                            </ol>
                        </Grid>
                        <Grid item xs={12} md={6} >
                            <img src={i_ref16} alt="" style={{ marginBottom: 14 }} width={320} height={270} className="img-vistainfo" />
                        </Grid>
                        <Grid item xs={12} >
                            <h3>
                                Configuración de Acción
                            </h3>
                          
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <img src={i_ref17} alt="" style={{ marginBottom: 14 }} width={260} height={270} className="img-vistainfo" />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            la configuracion de acciones es muy simple unicamente  se debe relacionar el mismo número de patrón con el mismo número de acción , con ello 
                            ya se tendria configurado esta vista dentro del controlador.
                        </Grid>
                        <Grid item xs={12} >
                            <h3>
                                Configuración de Plan
                            </h3>
                          
                        </Grid>
                    </Grid>
                </Container>
            </SimpleBar>

        </>
    )

}

//https://www.amazon.com/-/es/navegaci%C3%B3n-posicionamiento-compatible-sensibilidad-precisi%C3%B3n/dp/B08MZ2CBP7/ref=sr_1_8?__mk_es_US=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2MN5BC2W05YNG&keywords=modulo+gps&qid=1689964999&sprefix=modulo+gps%2Caps%2C147&sr=8-8