import { CircleMarker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import PropTypes from 'prop-types';
export default function SemaforoCircle(props) {
    const { position,id } = props;
    const [grupos,setGrupos] = useState({g1:"red",g2:"red",g3:"red",g4:"red"})
    const formatCollor=(__value)=>{
        if(__value === 1){
            return "green"
        }else if(__value ===2){
            return "yellow"
        }else if(__value ===3){
            return "red"
        }
    }
    const readDataController = () => {
        const db2 = getDatabase();
        const starCountRef = ref(db2, id);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            data.g1 = formatCollor(data.g1)
            data.g2 = formatCollor(data.g2)
            data.g3 = formatCollor(data.g3)
            data.g4 = formatCollor(data.g4)
            setGrupos(data)
        });
    }
    useEffect(() => {

        readDataController();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <CircleMarker center={position[0]} pathOptions={{ color: grupos.g1 }} radius={5}>
                <Popup>
                    <p style={{ margin: 0, fontStyle: "italic" }}><strong>Nombre: Grupo 1 </strong>  </p>
                </Popup>
            </CircleMarker>
            <CircleMarker center={position[1]} pathOptions={{ color: grupos.g2 }} radius={5}>
                <Popup>
                    <p style={{ margin: 0, fontStyle: "italic" }}><strong>Nombre: Grupo 2 </strong>  </p>
                </Popup>
            </CircleMarker>
            <CircleMarker center={position[2]} pathOptions={{ color: grupos.g3 }} radius={5}>
                <Popup>
                    <p style={{ margin: 0, fontStyle: "italic" }}><strong>Nombre: Grupo 3 </strong>  </p>
                </Popup>
            </CircleMarker>
            <CircleMarker center={position[3]} pathOptions={{ color: grupos.g4 }} radius={5}>
                <Popup>
                    <p style={{ margin: 0, fontStyle: "italic" }}><strong>Nombre: Grupo 4 </strong>  </p>
                </Popup>
            </CircleMarker>
            
        </>
    )
}
SemaforoCircle.propTypes = {
    position: PropTypes.array,
    id: PropTypes.string,
  };
  