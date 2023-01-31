fetch("./productos.json")
.then(response => response.json())
.then(stockProductos => miPrograma(stockProductos))

function miPrograma(stockProductos) {
    

const contenedorProductos = document.getElementById('contenedor-productos')

const contenedorCarrito = document.getElementById('carrito-contenedor')

const botonVaciar = document.getElementById('vaciar-carrito')

const botonComprar = document.getElementById("comprar-carrito")

const contadorCarrito = document.getElementById('contadorCarrito')


const cantidad = document.getElementById('cantidad')
const precioTotal = document.getElementById('precioTotal')
const cantidadTotal = document.getElementById('cantidadTotal')

let frase
let carrito = []
localStorage.setItem('productos' , JSON.stringify(stockProductos))

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }
})

botonVaciar.addEventListener('click', () => {
    carrito.length = 0
    actualizarCarrito()
    location.reload()
})

botonComprar.addEventListener('click', () => {
    if(carrito.length > 0){
        carrito.length = 0
        actualizarCarrito()
        Swal.fire({
        title:'SUCCESSFUL!',
        text: 'COMPRA REALIZADA!',
        icon: 'success',
        duration: 2000
    })
    }
    else{
        Swal.fire({
            title:'ERROR!',
            text: 'EL CARRITO ESTA VACIO!',
            icon: 'error',
            duration: 2000
        })
    }
})

stockProductos.forEach((producto) => {
    const div = document.createElement('div')
    div.classList.add('producto')
    div.innerHTML = `
    <img src=${producto.img} alt= "">
    <h3>${producto.nombre}</h3>
    <p>${producto.desc}</p>
    <p class="precioProducto">Precio:$ ${producto.precio}</p>
    <p class="stockProducto" id=stock${producto.id}>Stock: ${producto.stock}</p>
    <button id="agregar${producto.id}" class="boton-agregar">Agregar al carrito<i class="fas fa-shopping-cart"></i></button>
    
    `
    contenedorProductos.appendChild(div)

    const boton = document.getElementById(`agregar${producto.id}`)

    boton.addEventListener('click', () => {
        agregarAlCarrito(producto.id)
    })
})



const agregarAlCarrito = (prodId) => {

    const existe = carrito.some (prod => prod.id === prodId) 
    
    if (existe){ 
        const prod = carrito.find((prod) => prod.id === prodId) 
            if (prod.id === prodId && stockProductos[prod.id].stock > 0){
                prod.cantidad++  
                stockProductos[prod.id].stock--
                let contenedorStock = document.getElementById("stock"+prod.id)
                contenedorStock.innerHTML = "Stock: "+stockProductos[prod.id].stock
                frase = "Se agrego otra unidad al carrito"
                mensajeToastifyAgregarProducto(frase)                      
            }
            else{
                mensajeSweetNoHayMasStock()
            
        }
    } else { 
        const item = stockProductos.find((prod) => prod.id === prodId)
        if(item.stock > 0){
            item.stock--
            carrito.push(item)
            let contenedorStock = document.getElementById("stock"+item.id)
                contenedorStock.innerHTML = "Stock: "+stockProductos[item.id].stock 
            frase = "Se ha añadido un nuevo producto al carrito"
                mensajeToastifyAgregarProducto(frase)
        }
        else{
            mensajeSweetNoHayMasStock()
        }
        
        
    }
    actualizarCarrito()
}

const eliminarDelCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId)

    const indice = carrito.indexOf(item)

    carrito.splice(indice, 1)
    actualizarCarrito() 
}

const actualizarCarrito = () => {
    contenedorCarrito.innerHTML = ""
    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `
 
        contenedorCarrito.appendChild(div)
        
        localStorage.setItem('carrito', JSON.stringify(carrito))

    })
    contadorCarrito.innerText = carrito.length
    console.log(carrito)
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)
}



function mensajeSweetNoHayMasStock() {
    Swal.fire({
        title:'No hay stock disponible!',
        text: 'Clickea el boton para continuar!',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    })
}

function mensajeToastifyAgregarProducto(frase) {
    Toastify({
        text: frase,
        duration: 3000,
        gravity: "bottom",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          }
    }).showToast(); 
}}