document.addEventListener("DOMContentLoaded", () => {
  const carrito = [];
  const listaCarrito = document.getElementById("lista-carrito");
  const botonesAgregar = document.querySelectorAll(".agregar-carrito");
  const contadorCarrito = document.querySelector(".cart-count");
  const totalElement = document.getElementById("total");
  let totalCompra = 0; // Variable para el total de la compra

  // Evento de clic para agregar productos al carrito
  document.querySelectorAll(".agregar-carrito").forEach((boton) => {
    boton.addEventListener("click", function () {
      const productoDiv = boton.closest(".producto"); // Div padre del producto
      const select = productoDiv.querySelector(".opciones"); // Selector de opciones
      const nombreProducto = productoDiv.querySelector("h3").textContent; // Nombre del producto
      const precioTexto = productoDiv.querySelector("p.precio").textContent; // Precio predeterminado
      let precioSeleccionado, nombreSeleccionado;

      // Comprobar si se seleccionó una opción
      if (select.value) {
        precioSeleccionado =
          select.options[select.selectedIndex].getAttribute("data-precio");
        nombreSeleccionado = select.options[select.selectedIndex].text;
      } else {
        // Usar el precio y nombre predeterminado si no hay opción seleccionada
        precioSeleccionado = parseFloat(precioTexto.replace("Precio: $", ""));
        nombreSeleccionado = "Sin selección de tamaño";
      }

      agregarProductoAlCarrito(
        `${nombreProducto} - ${nombreSeleccionado}`,
        parseFloat(precioSeleccionado)
      );
    });
  });

  // Actualizar el precio mostrado al seleccionar una opción en el `select`
  selectores.forEach((select) => {
    const precioP = select.nextElementSibling; // p que muestra el precio

    select.addEventListener("change", function () {
      const precioSeleccionado =
        select.options[select.selectedIndex].getAttribute("data-precio");
      precioP.textContent = `Precio: $${precioSeleccionado}`;
    });
  });

  // Función que agrega el producto al carrito
  function agregarProductoAlCarrito(producto, precio) {
    carrito.push({ producto, precio });
    mostrarCarrito();
    actualizarContadorCarrito();
    actualizarTotal(precio);
  }

  function mostrarCarrito() {
    listaCarrito.innerHTML = ""; // Limpia la lista de productos en el carrito
    if (carrito.length === 0) {
      listaCarrito.innerHTML = "<p>El carrito está vacío.</p>"; // Mensaje si el carrito está vacío
      return;
    }
    carrito.forEach((item, index) => {
      const li = document.createElement("p");
      li.style.borderBottom = "1px solid #ddd"; // Añade la línea separadora
      li.style.padding = "10px 0"; // Espaciado para mejor visibilidad
      li.innerHTML = `${item.producto} - $${item.precio.toFixed(2)}`; // Formato con dos decimales

      // Crear botón de eliminar
      const botonEliminar = document.createElement("button");
      botonEliminar.textContent = "Eliminar";
      botonEliminar.style.marginLeft = "10px";
      botonEliminar.style.cursor = "pointer";
      botonEliminar.style.backgroundColor = "#ff6b6b";
      botonEliminar.style.color = "white";
      botonEliminar.style.border = "none";
      botonEliminar.style.padding = "3px 6px";
      botonEliminar.style.borderRadius = "2px";

      // Agregar evento para eliminar producto
      botonEliminar.addEventListener("click", () => {
        eliminarProducto(index);
      });

      // Añadir el botón al elemento de la lista
      li.appendChild(botonEliminar);
      listaCarrito.appendChild(li);
    });
  }

  function eliminarProducto(index) {
    const precio = carrito[index].precio;
    carrito.splice(index, 1); // Elimina el producto del carrito
    mostrarCarrito(); // Actualiza la visualización del carrito
    actualizarContadorCarrito(); // Actualiza el contador del carrito
    actualizarTotal(-precio); // Resta el precio del total
  }

  function actualizarContadorCarrito() {
    contadorCarrito.textContent = carrito.length;
    contadorCarrito.style.display = carrito.length === 0 ? "none" : "block"; // Mostrar u ocultar contador
  }

  function actualizarTotal(precio) {
    totalCompra += precio; // Suma o resta el precio al total
    totalElement.textContent = totalCompra.toFixed(2); // Actualiza el elemento que muestra el total
  }

  //-------------------------------------------------------------------------------Otra función
  function enviarCorreo(contactoInfo) {
    // Convertimos el array de productos a un string HTML de lista
    const productosLista = carrito
      .map((item) => `<li>${item.producto} - $${item.precio.toFixed(2)}</li>`)
      .join(""); // Unimos todo en un string

    const data = {
      service_id: "service_e8bmdo6",
      template_id: "template_7jh64o9",
      user_id: "lKPpFVkeMWuB0bYDo",
      template_params: {
        username: contactoInfo, // Enviar el email o teléfono
        productos: productosLista, // Enviar la lista de productos como string HTML
        total: totalCompra.toFixed(2), // Total de la compra con dos decimales
      },
    };

    return $.ajax("https://api.emailjs.com/api/v1.0/email/send", {
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
    });
  }

  // Evento de clic para realizar el pedido
  document.getElementById("checkout").addEventListener("click", () => {
    const contactoInfo = document.getElementById("contacto-info").value;

    // Validar si el campo de contacto está vacío
    if (!contactoInfo) {
      alert("Por favor, ingresa tu número de teléfono o email.");
      return; // Detener la ejecución si el campo está vacío
    }

    // Validar el formato del número de teléfono o email
    const phonePattern = /^\d{10}$/; // 10 dígitos
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email válido

    if (!phonePattern.test(contactoInfo) && !emailPattern.test(contactoInfo)) {
      alert(
        "Por favor, ingresa un número de teléfono válido (10 dígitos) o un email válido."
      );
      return; // Detener la ejecución si el formato es inválido
    }

    if (carrito.length > 0) {
      enviarCorreo(contactoInfo)
        .done(function () {
          alert("Muchas gracias por tu compra\n¡Tu pedido ha sido enviado!");
          // Limpieza del carrito y actualización de la UI
          document.getElementById("contacto-info").value = ""; // Limpiar el campo
          carrito.length = 0; // Vaciar el carrito
          mostrarCarrito(); // Actualizar la visualización del carrito
          actualizarContadorCarrito(); // Actualizar el contador
          totalCompra = 0; // Reiniciar el total
          totalElement.textContent = "0.00"; // Reiniciar el total mostrado
          document.getElementById("carrito").style.display = "none"; // Cerrar el carrito
        })
        .fail(function (error) {
          alert("Oops... " + JSON.stringify(error));
        });
    } else {
      alert("El carrito está vacío.");
    }
  });

  document.getElementById("cerrar").addEventListener("click", () => {
    document.getElementById("carrito").style.display = "none"; // Cerrar el carrito
  });

  // Seleccionamos el carrito de compras (el div con clase cart) y la sección del carrito
  const carritoIcono = document.querySelector(".cart");
  const carritoSeccion = document.getElementById("carrito");

  // Inicializamos el estilo del carrito para que se desplace desde el lado derecho y esté oculto al inicio
  carritoSeccion.style.transition = "transform 300ms ease"; // Movimiento suave
  carritoSeccion.style.transform = "translateX(100%)"; // Posición fuera de la vista

  // Función para mostrar/ocultar el carrito con animación suave
  carritoIcono.addEventListener("click", function () {
    const isCarritoVisible = carritoSeccion.style.transform === "translateX(0)";
    carritoSeccion.style.transform = isCarritoVisible
      ? "translateX(100%)"
      : "translateX(0)";
  });

  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  const menuIcon = document.querySelector(".menu-icon");
  const menu = document.querySelector(".menu");

  menuIcon.addEventListener("click", () => {
    menu.classList.toggle("show");
  });

  // Obtén el menú
  const menuLinks = menu.querySelectorAll("a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("show"); // Cierra el menú al hacer clic en un enlace
    });
  });

  // Función para verificar si el elemento está en la vista
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  }
  //efecto de productos
  // Función que maneja la visibilidad de los elementos al hacer scroll
  function handleVisibility(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Si el producto entra en el viewport, añádelo a la clase 'visible'
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Deja de observar el elemento una vez que es visible
      }
    });
  }

  // Crear un IntersectionObserver para observar los productos
  const observer = new IntersectionObserver(handleVisibility, {
    root: null, // El viewport
    threshold: 0.1, // El porcentaje mínimo de visibilidad para activar el efecto
  });

  // Seleccionar todos los productos que quieres observar
  const productos = document.querySelectorAll(".producto");
  productos.forEach((producto) => {
    observer.observe(producto); // Comienza a observar cada producto
  });

  // Añadir el event listener al scroll
  window.addEventListener("scroll", handleScroll);
  // Llamar a la función al cargar la página para verificar elementos visibles al inicio
  handleScroll();

  //-------------------------otro efecto para los precios

  const socialIcons = document.querySelectorAll(".social-icon");

  socialIcons.forEach((icon) => {
    icon.addEventListener("mouseover", () => {
      icon.style.transform = "scale(1.2)";
    });

    icon.addEventListener("mouseout", () => {
      icon.style.transform = "scale(1)";
    });
  });

  window.addEventListener("scroll", function () {
    const containerImg = document.querySelector(".container-img");
    const scrollPosition = window.scrollY || window.pageYOffset;

    if (scrollPosition > containerImg.offsetTop) {
      containerImg.classList.add("fade-in"); // Añade la clase 'fade-in' cuando el contenedor se muestra
    } else {
      containerImg.classList.remove("fade-in"); // Elimina la clase 'fade-in' si se desplaza hacia arriba
    }
  });
});

// Seleccionamos el carrito de compras (el div con clase cart) y la sección del carrito
const carritoIcono = document.querySelector(".cart");
const carritoSeccion = document.getElementById("carrito");

// Añadimos un event listener para mostrar/ocultar el carrito
carritoIcono.addEventListener("click", function () {
  carritoSeccion.style.display =
    carritoSeccion.style.display === "none" ||
    carritoSeccion.style.display === ""
      ? "block"
      : "none";
});

// Seleccionar todos los selectores de opciones
const selectores = document.querySelectorAll(".opciones");

// Iterar sobre cada selector y agregar un evento de cambio
selectores.forEach((select) => {
  const precioP = select.nextElementSibling; // El siguiente elemento p que muestra el precio

  select.addEventListener("change", function () {
    const precioSeleccionado =
      select.options[select.selectedIndex].getAttribute("data-precio");
    precioP.textContent = `Precio: $${precioSeleccionado}`; // Actualizar el precio en el p correspondiente
  });
});

// Agregar eventos de clic a todos los botones de "Agregar al carrito"
document.querySelectorAll(".agregar-carrito").forEach((boton) => {
  boton.addEventListener("click", function () {
    const productoDiv = boton.closest(".producto"); // Obtener el div padre de la opción
    const select = productoDiv.querySelector(".opciones"); // Buscar el select dentro del div del producto
    const precioSeleccionado =
      select.options[select.selectedIndex].getAttribute("data-precio");
    const nombreSeleccionado = select.options[select.selectedIndex].text; // Nombre de la opción seleccionada
    const nombreProducto = productoDiv.querySelector("h3").textContent; // Obtener el nombre del producto

    // Crear un nuevo div para el producto en el carrito
    const nuevoProductoCarrito = document.createElement("div");
    nuevoProductoCarrito.innerHTML = `<h4>${nombreProducto} - ${nombreSeleccionado}</h4><p>Precio: $${precioSeleccionado}</p>`;

    // Agregar el nuevo producto al carrito
    contenidoCarrito.appendChild(nuevoProductoCarrito);
  });
});

//carrusel de productos
document.addEventListener("DOMContentLoaded", () => {
  const productos = document.querySelectorAll(".producto"); // Selecciona todos los contenedores de producto

  productos.forEach((producto) => {
    const imagenes = producto.querySelectorAll(".producto-vela");
    const puntos = producto.querySelectorAll(".punto");
    let imagenActual = 0;

    puntos.forEach((punto, index) => {
      punto.addEventListener("click", () => {
        // Cambiar la imagen activa
        imagenes[imagenActual].classList.remove("activo");
        puntos[imagenActual].classList.remove("activo");

        imagenActual = index;

        imagenes[imagenActual].classList.add("activo");
        puntos[imagenActual].classList.add("activo");
      });
    });
  });
});

//Efecto para los h3
document.addEventListener("DOMContentLoaded", () => {
  const elementos = document.querySelectorAll(".aparecer");

  function mostrarElemento() {
    elementos.forEach((elemento) => {
      const distancia = elemento.getBoundingClientRect().top;
      const alturaVentana = window.innerHeight;

      if (distancia < alturaVentana - 100) {
        elemento.classList.add("aparecer-activo");
      }
    });
  }

  window.addEventListener("scroll", mostrarElemento);
  mostrarElemento(); // Ejecutar al cargar la página
});

//Efecto en imagen header

document.addEventListener("scroll", function () {
  const containerImg = document.querySelector(".container-img");
  let scrollPosition = window.scrollY;
  containerImg.style.backgroundPosition = `${scrollPosition * 1}px center`;
});
document.addEventListener("scroll", function () {
  const containerImg = document.querySelector(".container-img");
  let scrollPosition = window.scrollY;
  let blurValue = Math.min(scrollPosition * 0.02, 10); // Máximo blur de 10px
  containerImg.style.filter = `blur(${blurValue}px)`;
});

document.addEventListener("DOMContentLoaded", () => {
  const imagen = document.querySelector(".imagen-acerca");

  // Añadimos un pequeño retardo para iniciar la animación
  setTimeout(() => {
    imagen.classList.add("visible");
  }, 800); // Ajusta el tiempo si lo deseas
});

// muestra div oculto ultimas news
document.addEventListener("DOMContentLoaded", () => {
  // Selecciona todos los artículos de noticias
  const newsItems = document.querySelectorAll(".news-item");

  newsItems.forEach((item) => {
    const readMoreBtn = item.querySelector(".read-more-btn");
    const closeBtn = item.querySelector(".close-btn");
    const fullContent = item.querySelector(".full-content");

    // Mostrar contenido completo al hacer clic en "Leer más"
    if (readMoreBtn) {
      readMoreBtn.addEventListener("click", () => {
        fullContent.style.display = "block";
        readMoreBtn.style.display = "none";
        closeBtn.style.display = "inline-block";
      });
    }

    // Ocultar contenido completo al hacer clic en "Cerrar"
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        fullContent.style.display = "none";
        readMoreBtn.style.display = "inline-block";
        closeBtn.style.display = "none";
      });
    }
  });
});
