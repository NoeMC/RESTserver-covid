// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ============================
//  CADUCCIDAD
// ============================
process.env.CADUCCIDAD_TOKEN = process.env.CADUCCIDAD_TOKEN || 60 * 60 * 24 * 7;

// ============================
//  SEED
// ============================
process.env.SEED = process.env.SEED || 'hola-mundo';


// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/covid';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;