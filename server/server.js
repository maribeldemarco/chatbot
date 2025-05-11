require('dotenv').config({ path: '../.env' }); // Asegúrate de que la ruta sea correcta

const mongoose = require('mongoose'); // Importamos Mongoose
const express = require('express'); // Importamos Express

const app = express();
const port = 3000;
const Producto = require('../models/products.model'); // Importamos el modelo

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(" Conectado a MongoDB"))
.catch((err) => console.error(" Error al conectar a MongoDB:", err));

app.get('/', async (req, res) => { //  
  try {
    const productos = await Producto.find(); //  Obtener productos 
    console.log("Productos en la base de datos:", productos);
    res.send('Probando servidor con productos: ' + JSON.stringify(productos)); // Enviar datos al cliente
  } catch (error) {
    console.error(" Error al obtener productos:", error);
  }
});

// Escuchar el puerto cuando el servidor inicia
app.listen(port, () => {
  console.log(` Servidor corriendo en el puerto ${port}`);
});
