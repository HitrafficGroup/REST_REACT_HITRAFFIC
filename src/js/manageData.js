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
            numPlan:`${numPlan}`,
            pasos:plan_lst
    }

        lista_datos.push(plan)

    }
    return ({[`${mac}`]:lista_datos})

}

export { convertToFases, convertToPlanes }