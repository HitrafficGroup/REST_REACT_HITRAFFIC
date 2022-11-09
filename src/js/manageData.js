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
    for (let index_plan = 0; index_plan < 16; index_plan++) {
        var numPlan = "plan" + (index_plan + 1).toString()
        let plan_lst = respuesta[mac][numPlan] //esq tu utilizas plan_list aqui
        plan_lst = parseToArray(plan_lst)

        let plan = {
            numPlan: `${numPlan}`,
            pasos: plan_lst
        }

        lista_datos.push(plan)

    }
    return ({ [`${mac}`]: lista_datos })

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


export { convertToFases, convertToPlanes, createHorariosObject }