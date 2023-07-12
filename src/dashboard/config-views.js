
import SsidChartIcon from '@mui/icons-material/SsidChart';
import AnimationIcon from '@mui/icons-material/Animation';
import LoopIcon from '@mui/icons-material/Loop';
import PatternIcon from '@mui/icons-material/Pattern';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import BallotIcon from '@mui/icons-material/Ballot';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WifiChannelIcon from '@mui/icons-material/WifiChannel';

import { SvgIcon } from '@mui/material';

export const items_views = [

  {
    title: 'Fases',
    path: '/controlador_HT200/fases',
    icon: (
      <SvgIcon fontSize="small">
        <SsidChartIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Secuencia de Fases',
    path: '/controlador_HT200/sequency',
    icon: (
      <SvgIcon fontSize="small">
        <AnimationIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Tiempo de Fases',
    path: '/controlador_HT200/split',
    icon: (
      <SvgIcon fontSize="small">
        <LoopIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Modo de Operación',
    path: '/controlador_HT200/pattern',
    icon: (
      <SvgIcon fontSize="small">
        <PatternIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Acción',
    path: '/controlador_HT200/action',
    icon: (
      <SvgIcon fontSize="small">
        <SportsMartialArtsIcon />
      </SvgIcon>
    )
  },
   {
    title: 'Planificación Horaria',
    path: '/controlador_HT200/plan',
    icon: (
      <SvgIcon fontSize="small">
        <BallotIcon />
      </SvgIcon>
    )
  },
   {
    title: 'Calendario',
    path: '/controlador_HT200/horario',
    icon: (
      <SvgIcon fontSize="small">
        <ScheduleIcon />
      </SvgIcon>
    )
  },
   {
    title: 'Configuración de Grupos',
    path: '/controlador_HT200/channel',
    icon: (
      <SvgIcon fontSize="small">
        <WifiChannelIcon />
      </SvgIcon>
    )
  },
];
