// models/pedido.model.js
const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  nombre: String,
  direccion: String,
  sabor: String,
  tamano: String,
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', pedidoSchema);
