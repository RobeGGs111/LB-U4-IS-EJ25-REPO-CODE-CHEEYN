import mysql from 'mysql2/promise';

// Creamos un pool de conexiones
const db = mysql.createPool({
  host: 'localhost',       // Por ejemplo 'localhost'
  user: 'user',       // Por ejemplo 'root'
  password: 'root', // Tu contraseña de MySQL
  database: 'cheeyn', // Nombre de tu base de datos
});

export default db;
