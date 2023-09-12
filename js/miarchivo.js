//CODIGO PARA MOSTRAR GRILLA DE PRODUCTOS Y AGREGAR PRODUCTOS AL CARRO
//---------------------------------------->INICIO<----------------------------------------
//Uso de constantes
const products = [
  // Aquí se agregan los productos a ser listados  
  {
      image: '../img/Suplementos/WheyProtein/WheyProtein_1-removebg-preview.png',
      title: 'Producto 1',
      description: 'Descripción del Producto 1',
      price: 19.99
  },
  {
      image: '../img/Suplementos/WheyProtein/WheyProtein_2-removebg-preview.png',
      title: 'Producto 2',
      description: 'Descripción del Producto 2',
      price: 24.99
  },
  {
      image: '../img/Suplementos/WheyProtein/WheyProtein_3-removebg-preview.png',
      title: 'Producto 3',
      description: 'Descripción del Producto 3',
      price: 29.99
  },  
];

const productGrid = document.getElementById('productGrid');

//Uso de bucles
products.forEach((product, index) => {
  const productCard = document.createElement('div');
  productCard.className = 'col-md-4 mb-4';

    productCard.innerHTML = `
        <div class="card">
            <img src="${product.image}" class="card-img-top" alt="${product.title}">
            <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">${product.description}</p>
                <p class="card-text">$${product.price.toFixed(2)}</p>
                <div class="input-group mb-3">
                    <input type="number" class="form-control" value="1" min="1" id="quantity${index}">
                    <button class="btn btn-primary" onclick="addToCart(${index})">Agregar al carrito</button>
                </div>
            </div>
        </div>
    `;

  productGrid.appendChild(productCard);
});

const cart = [];

//Uso de funciones
function addToCart(index) {
  const quantity = parseInt(document.getElementById(`quantity${index}`).value);
  if (quantity > 0) {
      cart.push({
          product: products[index],
          quantity
      });
      alert(`Se agregó ${quantity} ${products[index].title}(s) al carrito`);
      document.getElementById(`quantity${index}`).value = 1;
  }
}

//---------------------------------------->FIN<----------------------------------------

//CODIGO PARA CUMPLIMIENTO DE REQUISITOS DE PRE ENTREGA
//INICIO

//-->CREACION DE FUNCIONES<--
function finalizarCompra() {
    ////-->USO DE FUNCIONES DECLARADAS POSTERIORMENTE <--
    const totalCompra = calcularTotalCompra();

    //-->USO DE CONDICIONALES<--
    if (totalCompra <= 0) {
        alert("El total de la compra debe ser mayor a cero. Agrega productos al carrito antes de finalizar la compra.");
        return;
    }
    else{
        ////-->USO DE FUNCIONES DECLARADAS POSTERIORMENTE <--
        const nombreUsuario = pedirNombre();

        //-->USO DE CONDICIONALES<--
        if (nombreUsuario !== null) {
            alert(`Hola, ${nombreUsuario}! Vamos a finalizar la compra.`);

            const medioPagoSeleccionado = solicitarMedioDePago();
        
        if (medioPagoSeleccionado !== null) {
            let mensaje = `Has seleccionado: ${medioPagoSeleccionado}`;

            // Calcular el total de la compra si el pago es efectivo/débito
            if (medioPagoSeleccionado === "Efectivo/Débito") {
                const totalCompra = calcularTotalCompra();
                mensaje += `\nTotal de la compra: $${totalCompra.toFixed(2)}`;
            } else if (medioPagoSeleccionado.startsWith("Tarjeta de Crédito")) {
                const cuotas = obtenerCantidadCuotas(medioPagoSeleccionado);                
                const precioPorCuota = totalCompra / cuotas;
                mensaje += `\nTotal de la compra: $${totalCompra.toFixed(2)}`;
                mensaje += `\nCantidad de cuotas: ${cuotas}`;
                mensaje += `\nPrecio por cuota: $${precioPorCuota.toFixed(2)}`;
            }

                alert(mensaje); 
                alert('Compra finalizada con exito. Gracias por su preferencia!'); 
                cart.length = 0;                   
            }
        } 
    }        
}

//Solcita el nombre al cliente, se valida que no se vacio y que solo tenga letras
function pedirNombre() {
    let nombre = "";
    let valido = false;

    while (!valido) {
        nombre = prompt("Por favor, ingresa tu nombre:");

        if (nombre === null) {
            // El usuario canceló la entrada
            return null;
        }

        // Validar que el nombre no esté vacío y solo contenga letras
        if (nombre.trim() === "") {
            alert("El nombre no puede estar vacío. Por favor, ingresa tu nombre.");
        } else if (!/^[A-Za-zÁ-ÿ\s]+$/.test(nombre)) {
            alert("El nombre solo puede contener letras. Por favor, ingresa un nombre válido.");
        } else {
            valido = true;
        }
    }

    return nombre;
}

//Funcioón que solicita el medio de pago para la compra
function solicitarMedioDePago() {
    let medioPago = "";
    let valido = false;

    while (!valido) {
        medioPago = prompt("Selecciona el medio de pago:\n1 - Efectivo/Débito\n2 - Tarjeta de Crédito");

        if (medioPago === null) {
            // El usuario canceló la entrada
            return null;
        }

        if (medioPago !== "1" && medioPago !== "2") {
            alert("Opción no válida. Por favor, selecciona 1 para Efectivo/Débito o 2 para Tarjeta de Crédito.");
        } else {
            valido = true;
        }
    }

    if (medioPago === "2") {
        let cuotas = "";
        valido = false;

        while (!valido) {
            cuotas = prompt("Selecciona la cantidad de cuotas:\n2, 4, 6 u 12");

            if (cuotas === null) {
                // El usuario canceló la entrada
                return null;
            }

            if (cuotas !== "2" && cuotas !== "4" && cuotas !== "6" && cuotas !== "12") {
                alert("Opción no válida. Por favor, selecciona 2, 4, 6 u 12 para la cantidad de cuotas.");
            } else {
                valido = true;
            }
        }

        return `Tarjeta de Crédito (${cuotas} cuotas)`;
    } else {
        return "Efectivo/Débito";
    }
}

// Función para calcular el total de la compra
function calcularTotalCompra() {
    let total = 0;
    for (const item of cart) {
        total += item.product.price * item.quantity;
    }
    return total;
}

// Función para obtener la cantidad de cuotas
function obtenerCantidadCuotas(medioPagoSeleccionado) {
    let partes = medioPagoSeleccionado.split(" ")
    return parseInt(partes[3].replace("(", ""));    
}

// Esperar a que el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    // Obtener referencia al botón
    const finalizarCompraBtn = document.getElementById("finalizarCompraBtn");

    // Agregar evento de clic al botón
    finalizarCompraBtn.addEventListener("click", finalizarCompra);
});

//FIN