// IMPORTANTE: La carpeta y el archivo de la base de datos la hemos creado manualmente.
// Ejecutar este documento solo para crear la tabla sin datos. Si ya existe la tabla y se ejecuta este script, va a tirar un error.

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

db.serialize(() => {
    db.run("CREATE TABLE misdatos (nombre TEXT)");
});

db.close();