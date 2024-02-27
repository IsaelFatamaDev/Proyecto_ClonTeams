import mysql from 'mysql';

const conexion = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: 'admin',
     database: 'ser'
});

conexion.connect((err) => {
     if (err) {
          console.log("Error al conectar: " + err);
     } else {
          console.log('Conectado a la base de datos');
     }
});

export default conexion;
