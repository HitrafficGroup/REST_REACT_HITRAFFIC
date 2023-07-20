
import HomeIcon from '@mui/icons-material/Home';
import { SvgIcon } from '@mui/material';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import MonitorIcon from '@mui/icons-material/Monitor';
import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt';
export const items = [
  {
    title: 'Home',
    path: '/info',
    icon: (
      <SvgIcon fontSize="small">
      <HomeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Configuracion Individual',
    path: '/equipos',
    icon: (
      <SvgIcon fontSize="small">
        <AppSettingsAltIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Configuracion Grupal',
    path: '/group_config',
    icon: (
      <SvgIcon fontSize="small">
        <WorkspacesIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Sistema de Monitoreo',
    path: '/monitoreo',
    icon: (
      <SvgIcon fontSize="small">
        <MonitorIcon />
      </SvgIcon>
    )
  },
  // {
  //   title: 'Informacion del Sistema',
  //   path: '/informarcion_central',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <ImportContactsIcon />
  //     </SvgIcon>
  //   )
  // },
 

];
