import { db } from "../firebase/firebase-config";
import {  doc,getDoc,updateDoc } from "firebase/firestore";


async function getCheckData (_mac,data_return,t_muestreo){
    const docRef = doc(db, "controladores",_mac);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        //console.log("entro")
        const t_actual = new Date().getTime(); 
        const valor_guardado = docSnap.data().t_peticion 
        let minutes = t_muestreo
        let extra_time = minutes * 60000 
        let valor_guardado2 = valor_guardado +  extra_time
        console.log("tiempo sin los minutos extra: ",valor_guardado)
        console.log("tiempo con los minutos: ",valor_guardado2)
        console.log("tiempo actual: ",t_actual)
        if(valor_guardado2 > t_actual){
            //console.log("Document data:", docSnap.data()[`${data_return}`]);
           
            //console.log("entro true")
            return docSnap.data()[`${data_return}`]
        }else{
            //console.log("entro false")
           return false
        }
    
    } else {
    //console.log("No such document!");
    return false
    
    }
}

async function updateSamplingTime(_mac){
    const t_actual = new Date().getTime(); 
    console.log("tiempo de muestreo actualizado a: ",t_actual)
    const ref = doc(db, "controladores",_mac);
    await updateDoc(ref, {
        t_peticion: t_actual
    });
}
export { getCheckData,updateSamplingTime}