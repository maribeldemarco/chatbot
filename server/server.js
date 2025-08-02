// Importa las dependencias necesarias
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Importado para hacer la llamada a la API de Gemini
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
const sessionPath = sessionClient.sessionPath(projectId, '123456');
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

// NUEVO ENDPOINT para el chatbot de Gemini
// Este endpoint recibe el prompt del frontend de Angular y llama a la API de Gemini
app.post('/api/gemini', async (req, res) => {
console.log('--- Nueva petición a /api/gemini ---');
// Se lee la clave de la API de forma segura desde las variables de entorno
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
 console.error("Error: La clave de la API de Gemini no está configurada.");
 return res.status(500).json({ error: "Clave de API no configurada." });
}
const userPrompt = req.body.prompt;
const prompt = `Eres un chatbot útil para una popular heladería llamada "Ice Cream Shop". Tu propósito es responder preguntas frecuentes.
Aquí están los datos específicos que debes usar, no inventes nada:
- Dirección: Calle Falsa 123, Buenos Aires.
- Teléfono: 11-1111-8910.
- Horario: Lunes a viernes de 10:00 a 22:00, sábados y domingos de 11:00 a 23:00.
- Productos: Vendemos helados a domicilio.
Basado en esta información, responde a la pregunta del usuario: "${userPrompt}"`;
 const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
const payload = { contents: chatHistory };
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`;
try {
 const response = await fetch(apiUrl, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(payload)
 });
 const result = await response.json();
 const respuestaIA = result.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude generar una respuesta. Por favor, intenta de nuevo.";
 res.json({ respuestaIA: respuestaIA });
 } catch (error) {
 console.error('Error en la llamada a la API de Gemini desde el backend:', error);
 res.status(500).json({ error: "Hubo un error en el servidor." });
 }
});

// Escuchar el puerto cuando el servidor inicia.
app.listen(port, () => {
 console.log(` Servidor corriendo en el puerto ${port}`);
});
