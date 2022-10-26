import axios from 'axios';


async function getIpsFromRestApi(){
    console.log('se ejecuta peticion');
   const res = await axios.get('http://127.0.0.1:8000/rest/listarIps')
    console.log(res)
// axios({
//     url:'http://127.0.0.1:8000/rest/listarIps',
//     method:"GET",
//     mode: 'no-cors',
//     headers:{
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": process.env.REACT_APP_API_URL,
//         "Access-Control-Request-Headers": 'Content-Type, Authorization'

//     }
// })
// .then(res => {
//     console.log(res);
// })
// .catch(err =>{
//     console.log(err);
// })
}



export{getIpsFromRestApi}