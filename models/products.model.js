
const mongoose = require('mongoose'); // importamos moongose

const { Schema } = mongoose;

const ProductoSchema = new Schema({
    _id: String,
    sabor:String,
    precio:Number,
    tamano: String,
}); // creamos esquema

const Producto = mongoose.model('Producto', ProductoSchema, 'listaproductos');

module.exports= Producto;