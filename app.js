const express = require("express");
const path = require("path")
const sqlite3 = require('sqlite3').verbose();

const app = express()
const port = process.env.PORT || 3000;

// Configuraciones del servidor de express
app.use(express.static('public')) // Configuracion para la carpeta de documentos estaticos
app.use('/static', express.static(path.join(__dirname, 'public'))) // Configuracion para la carpeta de documentos estaticos
app.use(express.urlencoded({ extended: true })) // Config. para acceder a datos enviados desde el cliente
app.use(express.json()) // Config. para manejo de JSON en el servidor

// Config. del servidor para acceder a vistas
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

// Ruta principal (el index). Aca esta el formulario y tambien se veran los datos de la db (si existen).
app.get("/", (req, res) => {

    // Referenciamos la DB y la guardamos en una variable
    const db = new sqlite3.Database('./db/database.sqlite');

    // Traemos tooodos los datos de la db
    db.all('SELECT * FROM misdatos', (err, filas) => {
        if (err) {
            // Si hay algun error, mostrarlo en la consola.
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });

        } else {
            if (filas.length > 0) { // filas es un array donde cada elemento es un objeto que representa una fila
                // Enviamos todos los datos al cliente como una variable.
                res.render("index", { filas: filas });
            } else {
                res.render("index", { datosNoEncontrados: "No existen datos" })
            }
        }
    });
})

// Ruta para ver los datos de la DB en JSON desde el cliente.
app.get('/datos', (req, res) => {
    // Referenciamos la DB y la guardamos en una variable
    const db = new sqlite3.Database('./db/database.sqlite');

    // Traemos tooodos los datos de la db
    db.all('SELECT * FROM misdatos', (err, filas) => {
        if (err) {
            // Si hay algun error, mostrarlo en la consola.
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });

        } else {
            console.log(filas) // [ { nombre: 'david' }, { nombre: 'sara' } ]
            
            res.json(filas); // Enviamos todos los datos al cliente en formato JSON.
        }
    });
});


app.post("/enviarDatos", (req, res) => {
    // Los datos que vienen del front se guardan en req.body. El objeto req es donde se almacenan los datos que fueron enviados desde el cliente. El objeto req tiene una propiedad body en la cual se almacena el contenido de los formularios.
    console.log(req.body) // { nombre: 'daviiiiiiiiid' }
    
    // Lo que se haya almacenado en el req.body (los datos que fueron enviados desde el front) generalmente se mandan a una base de datos.
    // --> La lógica para enviar los datos a una base de datos se insertan acá en esta sección.
    const db = new sqlite3.Database('./db/database.sqlite'); // Referenciamos la DB y la guardamos en una variable
    db.serialize(() => {
        const stmt = db.prepare(`INSERT INTO misdatos VALUES (?)`);
        stmt.run(req.body.nombre); // El parametro del run() va en el (?) de la query dentro del prepare()
        stmt.finalize();
    });

    // Una vez terminado el procesamiento de datos, podemos dar por terminado el proceso y mandar una respuesta al cliente.
    res.redirect("/")
})



app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`)
})