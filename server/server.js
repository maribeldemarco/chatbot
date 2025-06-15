require('dotenv').config({ path: '../.env' }); // ruta para traer variables de entorno
const mongoose = require('mongoose'); // Importamos Mongoose
const express = require('express'); // Importamos Express
const cors = require('cors');
const app = express();
const port = 3000;
const Producto = require('../models/products.model'); // Importamos el modelo
const Sabor = require('../models/sabores.model');
const Pedido = require('../models/pedido.model');
app.use(express.json()); // Asegurate de tener esto para parsear JSON

app.use(cors({ origin: '*' })); // ✅ Esto habilita CORS para todas las solicitudes
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



app.post('/webhook', async (req, res) => {
  console.log('Webhook recibido:', JSON.stringify(req.body, null, 2)); 

  const queryResult = req.body.queryResult;
  if (!queryResult) {
    return res.json({ fulfillmentText: "No recibí queryResult en la petición." });
  }

  const parametros = queryResult.parameters;

  console.log("Parámetros recibidos:", parametros); // Ver datos

  const nuevoPedido = new Pedido({
    nombre: parametros.nombre,
    direccion: parametros.direccion,
    sabor: Array.isArray(parametros.sabor) ? parametros.sabor.join(', ') : parametros.sabor,
    tamano: parametros.tamano
  });

  console.log('Intentando guardar pedido:', nuevoPedido); // Ver objeto completo

  try {
    await nuevoPedido.save();
    console.log('Pedido guardado con éxito'); // Confirmar guardado

    res.json({
      fulfillmentText: `Tu pedido fue recibido: ${parametros.nombre}, ${parametros.sabor}, ${parametros.tamano}, ${parametros.direccion}`
    });
  } catch (error) {
    console.error('Error al guardar pedido:', error); // Mostrar error
    res.json({
      fulfillmentText: 'Lo siento, hubo un problema al guardar tu pedido.'
    });
  }
});

// Escuchar el puerto cuando el servidor inicia
app.listen(port, () => {
  console.log(` Servidor corriendo en el puerto ${port}`);
});