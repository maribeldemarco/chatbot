require('dotenv').config({ path: '../.env' }); 
const mongoose = require('mongoose'); 
const express = require('express'); 
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const Producto = require('./models/products.model'); 
const Sabor = require('./models/sabores.model');
const Pedido = require('./models/pedido.model');
const dialogflowClient = require('./dialogflowClient');
const { sessionClient, projectId } = require('./dialogflowClient');


app.use(express.json()); 

app.use(cors({ origin: '*' })); 
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

 
const saborParam = queryResult.parameters?.sabor;

if (
  queryResult.intent.displayName === 'hacer_pedido' &&
  (!saborParam || saborParam === '' || (Array.isArray(saborParam) && saborParam.length === 0))
)
 {
  const sabores = await Sabor.find();
  const saboresListados = sabores.map(s => `– ${s.sabor}`).join('\n');

  return res.json({
    fulfillmentText: `¿Qué sabor te gustaría? 🍨\n${saboresListados}`
  });
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


app.post('/dialogflow', async (req, res) => {
  console.log('--- Nueva petición a /dialogflow ---');

  const { message } = req.body;

  try {
    // Llamás a Dialogflow
    const sessionPath = sessionClient.sessionPath(projectId, '123456'); //

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'es',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    console.log('Intención detectada:', result.intent.displayName);

    if (result.intent.displayName === 'hacer_pedido') {
      const parametros = result.parameters.fields;

      const nombre = parametros.nombre?.stringValue || '';
      const direccion = parametros.direccion?.stringValue || '';
      const sabor = parametros.sabor?.listValue?.values?.map(v => v.stringValue).join(', ') || '';
      const tamano = parametros.tamano?.stringValue || '';

      if (tamano) {
        const nuevoPedido = new Pedido({ nombre, direccion, sabor, tamano });

        try {
          await nuevoPedido.save();
          console.log('Pedido guardado desde /dialogflow');
        } catch (err) {
          console.error('Error guardando pedido:', err);
        }
      } else {
        console.log('No se guardó el pedido porque falta el tamaño');
      }
    }

    res.json({ reply: result.fulfillmentText });

  } catch (error) {
    console.error('Error al enviar mensaje a Dialogflow:', error);
    res.status(500).json({ error: 'Error al comunicarse con Dialogflow' });
  }
});

// Escuchar el puerto cuando el servidor inicia.
app.listen(port, () => {
  console.log(` Servidor corriendo en el puerto ${port}`);
});
