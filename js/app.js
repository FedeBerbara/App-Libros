//Definición de las clases
class Libro{
    constructor(titulo, autor, isbn){
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
    }
}

//Manejamos el DOM
class UI{
    static mostrarLibros(){
        // Traigo los libros del local storage
        const libros = Datos.traerLibros();
        libros.forEach((libro) => UI.agregarLibroLista(libro));
    }

    static agregarLibroLista(libro){
        // Creo una variable donde voy a almacenar el libro
        const lista = document.querySelector('#libro-list');

        // Creo el elemento donde se va a mostrar el libro
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        
        lista.appendChild(fila);

    }

    static eliminarLibro(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static mostrarAlerta(mensaje, className){
        // Creo el div que va a mostrarme la alerta
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(mensaje));

        // Posiciono la alerta abajo del titulo y antes del form
        const container = document.querySelector('.container');
        const form = document.querySelector('#libro-form');
        container.insertBefore(div, form);

        //Muestro la alerta por 3 segundos
        setTimeout(()=>document.querySelector('.alert').remove(), 3000);
    }

    static limpiarCampos(){
        document.querySelector('#titulo').value = '';
        document.querySelector('#autor').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Manejo el local storage
class Datos{
    static traerLibros(){
        // Consulto al local storage si existe algun libro o no
        let libros;
        if(localStorage.getItem('libros') === null){
            libros = [];
        }else{
            libros = JSON.parse(localStorage.getItem('libros'));
        }
        return libros;
    }

    static agregarLibro(libro){
        // Agrego un libro al local storage
        const libros = Datos.traerLibros();
        libros.push(libro);
        localStorage.setItem('libros', JSON.stringify(libros));
    }

    static removerLibro(isbn){
        const libros = Datos.traerLibros();
        // Muestro el ISBN que se va a borrar
        console.log(isbn);

        libros.forEach((libro, index) => {
            if(libro.isbn === isbn){
                libros.splice(index, 1);
            }
        });
        localStorage.setItem('libros', JSON.stringify(libros));
    }
}

//Carga de la página
document.addEventListener('DOMContentLoaded',UI.mostrarLibros());

//Controlar el Evento Submit
document.querySelector('#libro-form').addEventListener('submit',(e) => {
    e.preventDefault();

    //Obtener valores de los campos
    const titulo = document.querySelector('#titulo').value;
    const autor = document.querySelector('#autor').value;
    const isbn = document.querySelector('#isbn').value;

    // Valido mi form
    if(titulo === '' || autor === '' || isbn === ''){
        UI.mostrarAlerta('Por favor ingrese todos los datos', 'danger');
    }else{
        //Creo mi objeto libro
        const libro = new Libro(titulo, autor, isbn);
        // Envia el libro al local storage
        Datos.agregarLibro(libro);
        // Agrego el libro a la lista
        UI.agregarLibroLista(libro);
        // Muestro un mensaje cuando el libro se añade correctamente
        UI.mostrarAlerta('Libro agregado a la colección','success');
        // Limpio el form luego de agregar un libro
        UI.limpiarCampos();
    }
});

// Capturo el evento click 
document.querySelector('#libro-list').addEventListener('click', (e) => {
    UI.eliminarLibro(e.target);
    // Hago todo el recorrido para que elimine guiandose de un valor
    Datos.removerLibro(e.target.parentElement.previousElementSibling.textContent);
    // Alert de libro eliminado
    UI.mostrarAlerta('Libro Eliminado','success');
});