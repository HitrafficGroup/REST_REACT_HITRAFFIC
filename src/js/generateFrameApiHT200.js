

function generatePhaseFrame(fases){
    let aux_fases = JSON.parse(JSON.stringify(fases))
    let data_fases = []
    let aux_data = []
    aux_fases.forEach((item) => {
        if (item.number > 0) {
            aux_data = [item.number, item.walk,
            item.pedestrianClear, item.minimumGreen, item.passage,
            item.maximun1, item.maximun2,
            item.yellowchange, item.redclear, item.RedRevert, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ]
            data_fases.push(aux_data)
        } else {
            aux_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            data_fases.push(aux_data)
        }

    })
    aux_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let i = 0; i < 12; i++) {
        data_fases.push(aux_data)
    }
    return(data_fases)
}


function generateSeqFrame(secuencias){
    let data_formated = []
    let seq_target
    let aux_secuencias = JSON.parse(JSON.stringify(secuencias))
        for (let i = 0; i < 16; i++) {

            if (aux_secuencias.length > i) {
                data_formated.push(i + 1)
                seq_target = aux_secuencias[i]
                for (let x = 0; x < 4; x++) {

                    if (x === 0) {
                        data_formated.push(1)
                        for (let y = 0; y < 16; y++) {
                            data_formated.push(seq_target.ring1[y].value)
                        }
                    } else if(x=== 1) {
                        data_formated.push(2)
                        for (let y = 0; y < 16; y++) {
                            data_formated.push(seq_target.ring2[y].value)
                        }
                    } else if(x=== 2) {
                        data_formated.push(3)
                        for (let y = 0; y < 16; y++) {
                            data_formated.push(seq_target.ring3[y].value)
                        }
                    }else{
                        data_formated.push(4)
                        for (let y = 0; y < 16; y++) {
                            data_formated.push(seq_target.ring4[y].value)
                        }
                    }
                }
            } else {
                data_formated.push(0)
                for (let x = 0; x < 4; x++) {
                    data_formated.push(0)
                    for (let y = 0; y < 16; y++) {
                        data_formated.push(0)
                    }
                }
            }
        }
        return(data_formated)
}


function generateSplitFrame(splits){
    let array_data = []
    let aux_splits = JSON.parse(JSON.stringify(splits))
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < aux_splits[i].data.length; j++) {
                let target = aux_splits[i].data[j].mode
                if (target === "Otro") {
                    aux_splits[i].data[j].mode = 1
                } else if (target === "Ninguno") {
                    aux_splits[i].data[j].mode = 2
                } else if (target === "Minimun Vehicle Recall") {
                    aux_splits[i].data[j].mode = 3
                } else if (target === "Maximun Vehicle Recall") {
                    aux_splits[i].data[j].mode = 4
                } else if (target === "Pedestrian Recall") {
                    aux_splits[i].data[j].mode = 5
                } else if (target === "Maximun vehicle Pedestrian Recall") {
                    aux_splits[i].data[j].mode = 6
                } else if (target === "Phase Omitted") {
                    aux_splits[i].data[j].mode = 7
                }else {
                    aux_splits[i].data[j].mode = 0
                }
        }
    }
    for(let i = 0; i<20;i++){
        array_data.push(i+1)
        if(i<8){
            let target_array = aux_splits[i].data
            for(let j = 0; j<16;j++){
                if(j<target_array.length){
                    array_data.push(target_array[j].fase)
                    array_data.push(target_array[j].tiempo)  
                    array_data.push(target_array[j].mode)    
                    array_data.push(target_array[j].coord)  
                }else{
                array_data.push(0)
                array_data.push(0)  
                array_data.push(0)    
                array_data.push(0) 
                }
          
            }
        }else{
            for(let j = 0; j<16;j++){
                array_data.push(0)
                array_data.push(0)  
                array_data.push(0)    
                array_data.push(0)  
            }
        }
    }
    return array_data
}

function generatePatternFrame(patterns){
    let array_data = []

    let aux_data = JSON.parse(JSON.stringify(patterns))
    let data_size = aux_data.length
    for(let i = 0;i<100;i++){
        if(i<data_size){
            array_data.push(aux_data[i].number)
            array_data.push(aux_data[i].cycletime & 0xff)
            array_data.push(aux_data[i].cycletime >> 8)
            array_data.push(aux_data[i].offsettime)
            array_data.push(aux_data[i].splitnumber)
            array_data.push(aux_data[i].sequencenumber)
            array_data.push(aux_data[i].workmode)
        }else{
            array_data.push(0)
            array_data.push(0)
            array_data.push(0)
            array_data.push(0)
            array_data.push(0)
            array_data.push(0)
            array_data.push(0)
        }
    
    }
    return array_data
}
function generateActionFrame(actions){
    let array_data = []
    let aux_data =  JSON.parse(JSON.stringify(actions))
        for(let i = 0;i<100;i++){
            if(i <16){
                array_data.push(aux_data[i].number)
                array_data.push(aux_data[i].patron)
                array_data.push(aux_data[i].auxiliary)
                array_data.push(aux_data[i].special)
            }else{
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
                array_data.push(0)
            }
        
        }
    return array_data
}

function generatePlanFrame(planes){
    let aux_data = JSON.parse(JSON.stringify(planes))
    let array_data = []
    let target_plan = []
    for(let i = 0;i<16;i++){
        array_data.push(i+1)
            target_plan = aux_data[i].data
            for(let j = 0;j<24;j++){
                array_data.push(target_plan[j].hour)
                array_data.push(target_plan[j].minute)
                array_data.push(target_plan[j].action)
            }
    }
    return array_data
}
function generateChannelFrame(channel){
    let aux_data = JSON.parse(JSON.stringify(channel))
    let data_array = []
    for( let i =0; i<16;i++){
        data_array.push(aux_data[i].number)
        data_array.push(aux_data[i].source)
        data_array.push(aux_data[i].type)
        data_array.push(aux_data[i].flash)
        data_array.push(aux_data[i].dim)
        data_array.push(aux_data[i].position)
        data_array.push(aux_data[i].direction)
        data_array.push(aux_data[i].countdown)
    }
    return data_array
}
export {generateSeqFrame,generatePhaseFrame,
    generateSplitFrame,generatePatternFrame,
    generateActionFrame,generatePlanFrame,
    generateChannelFrame
}