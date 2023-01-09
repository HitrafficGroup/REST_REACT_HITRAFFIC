import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import LightModeIcon from '@mui/icons-material/LightMode';
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { getFasesFromRestApi, postFasesFromRestApi } from '../js/apiFunctions'
import { updateFasesSamplingTime, getCheckDataFases } from '../js/gestionSolicitudes';
import "../css/MapaUniversalView.css";
import { useSelector } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import '../css/FasesView.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import CardController from '../components/CardController';

export default function MapaUniversalView() {



    return (
        <>
            <Container maxWidth="lg" >
                <div >
                    <MapContainer center={[-2.9002025261800206, -78.99967753716173]} zoom={14} scrollWheelZoom={false} className={"leaflet-container-2"}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </MapContainer>
                </div>
            </Container>
        </>
    );

}

