import axios from 'axios';

const BASE_PATH_WS = 'http://127.0.0.1:8000';
async function getIpsFromRestApi(){
    console.log('se ejecuta peticion');
   const res = await axios.get('http://127.0.0.1:8000/rest/listarIps')
   return res
}
function ajaxPostData(url,json=null){
    url=this.addExtraDataToURL(url);
    console.log("POST:"+url);
    this.onStartAjax();
    let that=this;
    return  new Promise((resolve,reject)=>{
          var xhttp = new XMLHttpRequest();
          

          xhttp.onreadystatechange = function() {
              if (this.readyState === 4){
                  if(this.status === 200)
                {
                    if(this.responseText && (this.responseText.startsWith('{')||this.responseText.startsWith('[')))
                          resolve(JSON.parse(this.responseText));
                    else
                        resolve(this.responseText);
                       
                }
                   else {
                       reject({message:this.responseText,status:this.status});
                       
                   }
                   that.onEndAjax();
                }
          };
          xhttp.open("POST", url, true);
        //agregar token a cabecera 
        xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        xhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        if(json!=null){
            xhttp.setRequestHeader("contentType", "application/json; charset=utf-8");
            //console.log("enviando dato")
            //console.log(json);
            xhttp.send(json);
        }
        else{
            //console.log("enviando nada")
            xhttp.send();
        }

     });
}
function getFasesControlador(ip){

    let urlWS=`${BASE_PATH_WS}/rest/restGetFasesControlador`;
    return new Promise((resolve,reject)=>{

        if(ip==null || (""+ip.trim())=="")
            reject({message:"se requiere pasar la ip"})
            
            let jsonReq = {
                "ip": ip
            };
            jsonReq=JSON.stringify(jsonReq)


        ajaxPostData(urlWS,jsonReq)
        .then((data)=>{resolve(data); console.log('holis2',data);})
        .catch((err)=>{reject(err);})
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}



export{getIpsFromRestApi,getFasesControlador}