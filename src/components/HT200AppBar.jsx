import AppBar from '@mui/material/AppBar';
import React,{useState} from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Drawer from '@mui/material/Drawer';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import "../css/ButtonAppBar.css"
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
//iconos
import FlagIcon from '@mui/icons-material/Flag';
import SsidChartIcon from '@mui/icons-material/SsidChart';
import AnimationIcon from '@mui/icons-material/Animation';
import LoopIcon from '@mui/icons-material/Loop';
import PatternIcon from '@mui/icons-material/Pattern';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import BallotIcon from '@mui/icons-material/Ballot';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WifiChannelIcon from '@mui/icons-material/WifiChannel';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import HomeIcon from '@mui/icons-material/Home';
import BugReportIcon from '@mui/icons-material/BugReport';

export default  function HT200AppBar(){
    const [drawerHT,setDrawerHT] = useState({left:false});
    const navigate = useNavigate(); // hook para navegar entre urls o vistas

    const menuState = useSelector(state => state.menu);
    const userState = useSelector(state => state.auth);

      // funcion para hacer funcionar el drawer
      const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setDrawerHT({ ...drawerHT, [anchor]: open });
      };
      const cerrarSesion = ()=>{
        navigate('/');
    }

    return(
    <>
        <AppBar position="static" sx={{ backgroundColor: "#34495E" }}>
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer('left', true)}
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            <Typography sx={{ display: { md: 'flex' },flexGrow: 1 }} variant="h6" component="div">
            {menuState.menu}
          </Typography>
            <Typography  sx={{ display: { xs: 'none', md: 'flex' } }}variant="h6" component="div">
                   Bienvenido {userState.name} {userState.lastname} !
                </Typography>
          <Button sx={{marginLeft:2}} variant="contained" color='error' onClick={cerrarSesion} endIcon={<LogoutIcon />} >SALIR</Button>
            </Toolbar>
        </AppBar>
        <Drawer
        anchor={'left'}
        open={drawerHT['left']}
        onClose={toggleDrawer('left', false)}
      >
        
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Configuracion Basica
          </ListSubheader>
          }
        >
             <ListItemButton onClick={()=>{navigate('/equipos')}} >
                        <ListItemIcon>
                            <MenuOpenIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Controladores"/>
            </ListItemButton>
            <ListItemButton onClick={()=>{navigate('home')}} >
                        <ListItemIcon>
                            <HomeIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Home"/>
            </ListItemButton>
            <ListItemButton onClick={()=>{navigate('unit')}} >
                        <ListItemIcon>
                            <FlagIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Unit"/>
            </ListItemButton>
            <ListItemButton onClick={()=>{navigate('config')}} >
                        <ListItemIcon>
                            <SettingsIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Config"/>
            </ListItemButton>
            {/* <ListItemButton onClick={()=>{navigate('pruebas')}} >
                        <ListItemIcon>
                            <BugReportIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Pruebas"/>
            </ListItemButton> */}
            </List>
            <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
            Configuracion Avanzada
          </ListSubheader>
          }
        >
           
            <ListItemButton onClick={()=>{navigate('fases')}} >
                        <ListItemIcon>
                            <SsidChartIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Fases"/>
            </ListItemButton>
            <ListItemButton onClick={()=>{navigate('sequency')}} >
                        <ListItemIcon>
                            <AnimationIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Secuencias"/>
            </ListItemButton>

            <ListItemButton onClick={()=>{navigate('split')}} >
                        <ListItemIcon>
                            <LoopIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Ciclo"/>
            </ListItemButton>
            <ListItemButton onClick={()=>{navigate('pattern')}} >
                        <ListItemIcon>
                            <PatternIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Pattern"/>
            </ListItemButton>
            <ListItemButton onClick={()=>{navigate('action')}} >
                        <ListItemIcon>
                            <SportsMartialArtsIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Action"/>
            </ListItemButton>
            <ListItemButton onClick={()=>{navigate('plan')}} >
                        <ListItemIcon>
                            <BallotIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Plan"/>
            </ListItemButton>
            <ListItemButton onClick={()=>{navigate('horario')}} >
                        <ListItemIcon>
                            <ScheduleIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Horario"/>
            </ListItemButton>
            <ListItemButton onClick={()=>{navigate('channel')}} >
                        <ListItemIcon>
                            <WifiChannelIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="channel"/>
            </ListItemButton>
            <ListItemButton onClick={()=>{navigate('errores')}} >
                        <ListItemIcon>
                            <BugReportIcon fontSize='large' />
                        </ListItemIcon>
                        <ListItemText primary="Registro Errores"/>
            </ListItemButton>
         
        </List>

      </Drawer>
    </>
    );
}