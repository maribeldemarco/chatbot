require('dotenv').config({ path: '../.env' }); // ruta para traer variables de entorno
const mongoose = require('mongoose'); // Importamos Mongoose
const express = require('express'); // Importamos Express
const cors = require('cors');
const app = express();
const port = 3000;
const Producto = require('../models/products.model'); // Importamos el modelo
const Sabor = require('../models/sabores.model');

app.use(cors()); // ✅ Esto habilita CORS para todas las solicitudes
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(" Conectado a MongoDB"))
.catch((err) => console.error(" Error al conectar a MongoDB:", err));

app.get('/', async (req, res) => {  
  try {
    const productos = await Producto.find(); // Obtener productos  
    console.log("Productos en la base de datos:", productos);  
    res.json(productos); // 
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" }); 
  }
});
app.get('/api/sabores', async (req, res) => {
  try {
    const sabores = await Sabor.find(); // Obtener sabores
    console.log("Sabores en la base de datos:", sabores);
    res.json(sabores);
  } catch (error) {
    console.error("Error al obtener sabores:", error);
    res.status(500).json({ error: "Error al obtener sabores" });
  }
});

// Escuchar el puerto cuando el servidor inicia
app.listen(port, () => {
  console.log(` Servidor corriendo en el puerto ${port}`);
});
