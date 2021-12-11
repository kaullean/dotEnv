
const baseUrl= window.location.origin;

async function postData(url = '', data = {}, metodo) {

    const response = await fetch(baseUrl+url, {
      method: metodo, 
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  


//Funciones que manipulan productos SIN DESARROLLAR
function addProduct(){

    let nombre=document.getElementById("title").value;
    let precio=parseInt(document.getElementById("price").value)
    let imagen=document.getElementById("imgUrl").value;
    let nuevoProducto={
        title:titulo ,
        price:precio ,
        imgUrl:imagen,
    }
    postData('/api/productos/guardar',nuevoProducto, 'POST')
    .then(data => {
        renderNuevoProducto(data);
        //console.log(data); // JSON data parsed by `data.json()` call
    });


}

function renderNuevoProducto(nuevoProducto){
    let containerProductos=document.getElementById('containerProductos');
    let noHayDatos=document.getElementById('noHayProductos').parentElement;
    noHayDatos.setAttribute('style', 'visibility : hidden')
    let nuevoElemento=document.createElement('tr')
    
    let plantilla=`                                
            <td class="text-center">${nuevoProducto.title} </td>
            <td class="text-center">${nuevoProducto.price}</td>
            <td class="text-center"><img src=${nuevoProducto.imgUrl}></td>
        `;

    nuevoElemento.innerHTML=plantilla;    
    containerProductos.appendChild(nuevoElemento);   
    return true; 
}
