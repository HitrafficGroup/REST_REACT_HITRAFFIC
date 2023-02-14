function parseToArray(value) {
    if (typeof (value) === "string") {
        value = value.replace("(", "").replace(",)", "");
        value = JSON.parse("[" + value + "]")
    }
    return value;
}


function convertToFases(respuesta, mac, num_grupos = 4) { //Concatenacion de colores de 2 Bits por grupo a una variable de 8 bits para los 4 grupos 

    let fasesConverted = []

    for (let index_f = 0; index_f < 16; index_f++) {
        let faseOb = { "faseNum": index_f + 1, "grupos": [] }
        let dato = respuesta[mac]["fase" + (index_f + 1).toString()]
        //Normalmente antes se esperaria que llegara en binario directamente
        dato = parseInt(dato)
        dato = dato.toString(2);
        let bits_faltantes = 16 - dato.length;
        for (let bit = 0; bit < bits_faltantes; bit++) {
            dato = "0" + dato;
        }

        let count_grupos = 2
        let list_grupo_color = []
        let str_color = ''
        for (let index_g = 15; index_g >= (num_grupos * 2) - 1; index_g--) {
            //console.log(index_g)
            if (count_grupos == 0) {
                list_grupo_color.push(str_color)
                str_color = ''
                count_grupos = 2
            }
            str_color = dato[index_g] + str_color
            count_grupos -= 1
        }
        for (let index_c = 0; index_c < num_grupos; index_c++) {

            let idFase = `g${index_c + 1}_fase_${index_f + 1}`;
            let faseGrupo = { "grupoNum": index_c + 1, "id": idFase, "faseNum": index_f + 1 }
            let val = '';
            let valDescription = '';
            switch (list_grupo_color[index_c]) {
                case '00':
                    val = 0
                    valDescription = "rojo"
                    break;
                case '01':
                    val = 1
                    valDescription = "verde"
                    break;
                case '10':
                    val = 2
                    valDescription = "destello"
                    break;
                case '11':
                    val = 3
                    valDescription = "apagado"
                    break;
            }
            faseGrupo["color"] = val;
            faseGrupo["colorDescripcion"] = valDescription;
            faseOb.grupos.push(faseGrupo);
        }
        fasesConverted["fase" + faseOb.faseNum] = (faseOb);
    }
    //console.log(fasesConverted)
    return fasesConverted;


}
function convertToPlanes(respuesta, mac) {


    //planes_datos = {}
    let lista_datos = []
    let lista_datos_2 = []
    for (let index_plan = 0; index_plan < 16; index_plan++) {
        var numPlan = "plan" + (index_plan + 1).toString()
        let plan_lst = respuesta[mac][numPlan] //esq tu utilizas plan_list aqui
        plan_lst = parseToArray(plan_lst)
        let par = 0;
        let impar= 1;
        let plan_paso = []
        for(let i = 0;i<12 ;i++){
            let paso={
                name: `Paso ${(i+1)}`,
                fase: plan_lst[(par)],
                duracion: plan_lst[(impar)],
            }
            if(paso.duracion === 0 || paso.fase === 0 || paso.fase > 16 || paso.duracion >60) {
                paso.fase = 0
                paso.duracion = 0
            }
            plan_paso.push(paso)
            par = par +2;
            impar = impar+2;
        }
        let plan = {
            numPlan: `${numPlan}`,
            pasos: plan_lst
        }
        let plan2 = {
            numPlan: `${numPlan}`,
            pasos:plan_paso
        }
        lista_datos.push(plan)
        lista_datos_2.push(plan2)

        

    }
    
    return ({ [`${mac}`]: lista_datos_2 })

}



function getListHorarios(respuesta, mac) {

    let dia_festivo_lst = respuesta[mac]["dia_festivo"]
    let dia_ordinario_lst = respuesta[mac]["dia_ordinario"]
    let fin_semana_lst = respuesta[mac]["fin_semana"]


    dia_festivo_lst = parseToArray(dia_festivo_lst)
    dia_ordinario_lst = parseToArray(dia_ordinario_lst)
    fin_semana_lst = parseToArray(fin_semana_lst)

    let lista_datos = [dia_ordinario_lst, fin_semana_lst, dia_festivo_lst]





    return lista_datos
}


function convertToHorarios(horario_list = []) {
    let objetos = {}
    let nombres = ["", "Tiempo Fijo", "Pulsante", "Destello", "Todo en Rojo", "Apagado"]
    for (let valor = 0; valor < 4; valor++) {
        switch (valor) {
            case 0:
                let hora = horario_list[valor]
                hora = hora.toString(16)
                if (hora.length < 2) {
                    hora = "0" + hora
                }
                objetos["hora"] = hora
                break;
            case 1:
                let minutos = horario_list[valor]
                minutos = minutos.toString(16)
                if (minutos.length < 2) {
                    minutos = "0" + minutos
                }
                objetos["minutos"] = minutos
                break;
            case 2:
                let mod_plan = horario_list[valor]
                mod_plan = mod_plan.toString(2)
                let bits_faltantes = 8 - mod_plan.length
                for (let bit = 0; bit < bits_faltantes; bit++) {
                    mod_plan = "0" + mod_plan
                }
                let mod = mod_plan.substring(0, 3)
                let plan = mod_plan.substring(3, 8)
                let mod_int = parseInt(mod, 2)
                let plan_int = parseInt(plan, 2)
                objetos["mod"] = mod_int
                objetos["mod_descriptor"] = nombres[mod_int]
                objetos["plan"] = plan_int
                break;
            case 3:
                let desfase = horario_list[valor]
                desfase = desfase.toString(16)
                objetos["desfase"] = desfase
                break;
        }
    }
    return objetos
}

function createHorariosObject(respuesta,mac) {
    
    let horario_list = getListHorarios(respuesta,mac)
    let ordinario = generateObjectForTipoHorario(horario_list[0])
    let semana = generateObjectForTipoHorario(horario_list[1])
    let festivo = generateObjectForTipoHorario(horario_list[2])
    let horarioObject = {
        dia_ordinario: ordinario,
        fin_semana:semana,
        dia_festivo:festivo


    }
    return horarioObject
    
}
function generateObjectForTipoHorario(horario_list){
    let contador = 0
    let arrayObjects = []
    for (let num = 0; num < 16; num++) {
        let lista_by4 = [horario_list[contador], horario_list[contador + 1], horario_list[contador + 2], horario_list[contador + 3]]
        let objetos = convertToHorarios(lista_by4)
        let newObjecto = {
            nro:num,
            horas:objetos["hora"],
            minutos:objetos["minutos"],
            mod:objetos["mod"],
            plan:objetos["plan"],
            desfase:objetos["desfase"],
        }
        arrayObjects.push(newObjecto)
        contador = contador + 4
    }
    return arrayObjects
}
function CheckAndSplitBits(listag, num_bits = 8){
    let datos = []
    for (let j=0; j < listag.length; j++){
        let temp = listag[j]
        let bits_faltantes = num_bits - listag[j].length
        for (let i=0; i<bits_faltantes; i++){
            temp = "0" + temp
        }
        listag[j] = temp
        let direccion = listag[j].substring(0,4)
        let destello = listag[j][4]
        let sentido = listag[j].substring(5,8)
        direccion = parseInt(direccion,2)
        destello = parseInt(destello,2)
        sentido = parseInt(sentido,2)
        datos.push(direccion,sentido,destello)  
    }
    return datos
}
function convertToGrupos(respuesta,mac) {
    let g1 = respuesta[mac]["G1"]
    let g2 = respuesta[mac]["G2"]
    let g3 = respuesta[mac]["G3"]
    let g4 = respuesta[mac]["G4"]
    let lista_nombres = ["direccion", "sentido", "destello"]
    let listag = [parseInt(g1).toString(2), parseInt(g2).toString(2), parseInt(g3).toString(2), parseInt(g4).toString(2)]
    let datos = CheckAndSplitBits(listag)
    console.log(datos)
    let contador = 0;
    let gruposConverted = []
    for (let j = 1; j <= 4; j++) {
        let direccion = datos[contador]
        contador++;
        let sentido = datos[contador]
        contador++;
        let destello = datos[contador]
        contador++;

        let direccionDescripcion
        switch ("" + direccion) {
            case "1": direccionDescripcion = "Norte"; break;
            case "2": direccionDescripcion = "Este"; break;
            case "3": direccionDescripcion = "Sur"; break;
            case "4": direccionDescripcion = "Oeste"; break;
            case "5": direccionDescripcion = "Noroeste"; break;
            case "6": direccionDescripcion = "Sureste"; break;
            case "7": direccionDescripcion = "Suroeste"; break;
            case "8": direccionDescripcion = "Noroeste"; break;
            default: direccionDescripcion = ""; break;
        }

        let sentidoDescripcion
        switch ("" + sentido) {
            case "1": sentidoDescripcion = "Izquierda"; break;
            case "2": sentidoDescripcion = "Derecha"; break;
            case "3": sentidoDescripcion = "Giro Izquierda"; break;
            case "4": sentidoDescripcion = "Giro Derecha"; break;
            case "5": sentidoDescripcion = "Peatonal 1"; break;
            case "6": sentidoDescripcion = "Peatonal 2"; break;
            default: sentidoDescripcion = ""; break;
        }



        let destelloDescripcion
        switch ("" + destello) {
            case "0": destelloDescripcion = "Rojo"; break;
            case "1": destelloDescripcion = "Amarillo"; break;
            default: destelloDescripcion = ""; break;
        }


        let grupo = {
            "grupoNum": j,
            "direccion": direccion,
            "direccionDescripcion": direccionDescripcion,
            "sentido": sentido,
            "sentidoDescripcion": sentidoDescripcion,
            "destello": destello,
            "destelloDescripcion": destelloDescripcion
        }
        gruposConverted["grupo" + j] = grupo
    }
    return gruposConverted;

}

function CheckAndLinkBits(listag){
    let datos = []
    let num_grupos = 3;
    var dato_binario = ""
    var contador = 0;
    for (let j=0; j <= listag.length; j++){
        //console.log(contador)
        if ((contador % num_grupos)==0 && contador != 0) {
            datos.push(parseInt(dato_binario,2).toString())
            //console.log("reset")
            dato_binario = ""
            contador = 0;
        }
        switch (contador){
            case 0:
                let direccion = parseInt(listag[j]).toString(2)
                let bits_faltantes = 4 - direccion.length
                for (let i=0; i<bits_faltantes; i++){
                    direccion = "0" + direccion
                }
                dato_binario = dato_binario + direccion
                //console.log(dato_binario)
                contador+=1
                break;
            
            case 1:
                let destello = parseInt(listag[j]).toString(2)
                dato_binario = dato_binario + destello
                //console.log(dato_binario)
                contador+=1
                break;
            
            case 2:
                let sentido = parseInt(listag[j]).toString(2)
                let bits_faltantes_sentido = 3 - sentido.length
                for (let i=0; i<bits_faltantes_sentido; i++){
                    sentido = "0" + sentido
                }
                dato_binario = dato_binario + sentido
                //console.log(dato_binario)
                contador+=1
                break;
        }
    }

    return datos
}
function convertToDiasEspeciales(especiales_list = []) {

    let EspecialesConverted = []
    let nombresdiasespeciales = ["", "Dia Ordinario", "Fin de Semana", "Dia Festivo"]

    let dato_binario = parseInt(especiales_list[0]).toString(2)
    let bits_faltantes = 7 - dato_binario.length
    for (let falta = 0; falta < bits_faltantes; falta++) {
        dato_binario = "0" + dato_binario
    }
    EspecialesConverted["fines_semana"] = dato_binario

    let especiales_lst = parseToArray(especiales_list[1])

    let contador = 0
    let dias_especiales = []

    for (let dato = 0; dato < especiales_lst.length; dato += 3) {
        let dias_especial = { "mes": especiales_lst[dato], "dia": especiales_lst[dato + 1], "valor_modo": especiales_lst[dato + 2], "descriptor_modo": nombresdiasespeciales[especiales_lst[dato + 2]] }
        dias_especiales.push(dias_especial);
    }

    EspecialesConverted["dias_especiales"] = dias_especiales

    //console.log(EspecialesConverted)
    return EspecialesConverted

}

function verificarCeroFecha(atributo) {
    atributo = atributo.toString(16)
    if (atributo.length < 2) {
        atributo = "0" + atributo
    }
    return atributo
}

function convertirDiasEspeciales(respuesta,mac) {
    //ESTABLECER CHECKBOX CON O SIN CHECKED
    
    let fines_semana = respuesta[mac]["fines_semana"]
    let especiales_lst = parseToArray(respuesta[mac]["dias_festivos"]); 

    let EspecialesConverted = convertToDiasEspeciales([fines_semana, especiales_lst])
    let days = [
                {dia:'domingo',estado:false},
                {dia:'lunes',estado:false},
                {dia:'martes',estado:false},
                {dia:'miercoles',estado:false},
                {dia:'jueves',estado:false},
                {dia:'viernes',estado:false},
                {dia:'sabado',estado:false},
            ]
    for (let checkbox = 0; checkbox < 7; checkbox++) {
        if (EspecialesConverted["fines_semana"][EspecialesConverted["fines_semana"].length - (checkbox + 1)] == "1") {
           days[checkbox].estado = true
        } else {
            days[checkbox].estado = false
        }
    }
    let listofDays = []
    for(let dataTable = 0; dataTable< EspecialesConverted['dias_especiales'].length ; dataTable++){
        let objecTable = EspecialesConverted['dias_especiales'][dataTable];
        let mes = verificarCeroFecha(objecTable['mes'])
        let dia = verificarCeroFecha(objecTable['dia'])
        objecTable['mes'] = mes;
        objecTable['dia'] = dia;
        if(mes !== '00' && dia !==''){
            listofDays.push(objecTable)
        }
       
    }
   
    return {fines_semana:days,dia_festivo:listofDays}

}

export { convertToFases, convertToPlanes, createHorariosObject,convertToGrupos ,CheckAndLinkBits,convertirDiasEspeciales}