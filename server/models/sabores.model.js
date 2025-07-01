const mongoose = require('mongoose');

const { Schema } = mongoose;

const SaborSchema = new Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: false },
    imagen: { type: String, required: true },
});

const Sabor = mongoose.model('Sabor', SaborSchema, 'sabores');

module.exports = Sabor;