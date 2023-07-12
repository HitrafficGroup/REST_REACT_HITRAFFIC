import AppBar from '@mui/material/AppBar';
import React, { useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import SimpleBar from 'simplebar-react';
import Drawer from '@mui/material/Drawer';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import "../css/ButtonAppBar.css"
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import { SideNav } from '../dashboard/side-nav';
//
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
//iconos
import FlagIcon from '@mui/icons-material/Flag';
import FileCopyIcon from '@mui/icons-material/FileCopy';
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
import { resetParamsHT200 } from "../features/controlerht200/controlerHT200Slice";
import { setNameMenu } from '../features/menu/menuSlice';
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styled from '@emotion/styled';
import { TopNav } from '../dashboard/top-nav';
const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;
export default function HT200AppBar(props) {
    const [drawerHT, setDrawerHT] = useState({ left: false });
    const navigate = useNavigate(); // hook para navegar entre urls o vistas
    const dispatch = useDispatch();
    const menuState = useSelector(state => state.menu);
    const userState = useSelector(state => state.auth);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        navigate('/');
    };

    // funcion para hacer funcionar el drawer
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerHT({ ...drawerHT, [anchor]: open });
    };
    const LayoutContainer = styled('div')({
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        width: '100%'
      });
      const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: SIDE_NAV_WIDTH
  }
}));
    const cambiarControlador = () => {
        dispatch(resetParamsHT200())
        navigate('/equipos');
    }
    const cambiarVista = (__name, __target) => {
        dispatch(setNameMenu(__name))
        navigate(__target);
    }
    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }
    return (
        <>
            {/* <AppBar position="static" sx={{ backgroundColor: "#273444" }}>
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
                    <Typography sx={{ display: { md: 'flex' }, flexGrow: 1 }} variant="h6" component="div">
                        {menuState.menu} v3
                    </Typography>
                    <IconButton aria-label="delete" color="verde2" size="medium">
                        <HomeIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton aria-label="delete" color="anaranjado1" size="medium">
                        <SettingsRemoteIcon fontSize="inherit" />
                    </IconButton>
                    <Stack direction="row" spacing={2}>
                        <div>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                <Avatar {...stringAvatar(`${userState.name} ${userState.lastname}`)} />
                            </Button>

                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={handleClose}>Profile</MenuItem>
                                <MenuItem onClick={handleClose}>My account</MenuItem>
                                <MenuItem onClick={handleClose}>Logout</MenuItem>
                            </Menu>
                        </div>

                    </Stack>
                </Toolbar>

            </AppBar> */}
            <TopNav/>
            <LayoutRoot>
            <LayoutContainer>
         
       
            <SimpleBar style={{ maxHeight: '90vh' }}>
            {props.children}
            </SimpleBar>
            </LayoutContainer>
            </LayoutRoot>
            <SideNav/>
            {/* <Drawer
                anchor={'left'}
                PaperProps={{
                    sx: {
                        backgroundColor: 'neutral.800',
                        color: 'common.white',
                        width: 280
                    }

                }}
                open={true}
                sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
                variant="permanent"
                onClose={toggleDrawer('left', false)}
            >
                <SimpleBar style={{ maxHeight: '100vh' }}>
                    <List
                        sx={{ width: '100%', maxWidth: 360 }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >
                        <ListItemButton onClick={cambiarControlador} >
                            <ListItemIcon>
                                <MenuOpenIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="Controladores" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { cambiarVista('Dashboard Hitraffic', 'home') }} >
                            <ListItemIcon>
                                <HomeIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { cambiarVista('Configuracion Inicial', 'unit') }} >
                            <ListItemIcon>
                                <FlagIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="Unit" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { cambiarVista('Configuracion Basica', 'config') }} >
                            <ListItemIcon>
                                <SettingsIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="Config" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { cambiarVista('Clonacion de Equipos', 'clonacion') }} >
                            <ListItemIcon>
                                <FileCopyIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="Clonacion" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { cambiarVista('Registro de Errores', 'errores') }} >
                            <ListItemIcon>
                                <BugReportIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="Registro Errores" />
                        </ListItemButton>
                    </List>
                    <List
                        sx={{ width: '100%', maxWidth: 360, }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >
                        <ListItemButton onClick={() => { cambiarVista('Prgramacion de Fases', 'fases') }} >
                            <ListItemIcon>
                                <SsidChartIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="Fases" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { cambiarVista('Programacion de Secuencias', 'sequency') }} >
                            <ListItemIcon>
                                <AnimationIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="Secuencias" />
                        </ListItemButton>

                        <ListItemButton onClick={() => { cambiarVista('Programacion de Split', 'split') }} >
                            <ListItemIcon>
                                <LoopIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="Ciclo" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { cambiarVista('Programacion de pattern', 'pattern') }} >
                            <ListItemIcon>
                                <PatternIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="Pattern" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { cambiarVista('Programacion de accion', 'action') }} >
                            <ListItemIcon>
                                <SportsMartialArtsIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="Action" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { cambiarVista('Programacion de plan', 'plan') }} >
                            <ListItemIcon>
                                <BallotIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="Plan" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { cambiarVista('Programacion de Horario', 'horario') }} >
                            <ListItemIcon>
                                <ScheduleIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="Horario" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { cambiarVista('Programacion de Channel', 'channel') }} >
                            <ListItemIcon>
                                <WifiChannelIcon fontSize='large' />
                            </ListItemIcon>
                            <ListItemText primary="channel" />
                        </ListItemButton>


                    </List>
                </SimpleBar>
            </Drawer> */}



        </>
    );
}