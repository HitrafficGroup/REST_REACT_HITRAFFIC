import FlagIcon from '@mui/icons-material/Flag';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import HomeIcon from '@mui/icons-material/Home';
import BugReportIcon from '@mui/icons-material/BugReport';
import { SvgIcon } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
export const items = [
  {
    title: 'Controladores',
    path: '/equipos',
    icon: (
      <SvgIcon fontSize="small">
        <MenuOpenIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Inicio',
    path: '/controlador_HT200/home',
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Parametros Iniciales',
    path: '/controlador_HT200/unit',
    icon: (
      <SvgIcon fontSize="small">
        <FlagIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Configuración Básica',
    path: '/controlador_HT200/config',
    icon: (
      <SvgIcon fontSize="small">
        <SettingsIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Registro de Errores',
    path: '/controlador_HT200/errores',
    icon: (
      <SvgIcon fontSize="small">
        <BugReportIcon />
      </SvgIcon>
    )
  },

];
