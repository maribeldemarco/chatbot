const express = require('express')
// importo express y luego lo ejecuto
const app = express()
const port = 3000

// ruta principal de la app envia este mensaje al cliente con app.get ya que no se modifican datos

app.get('/', (req, res) => {
  res.send('Probando servidor')
})
//llama a que escuche al puerto cuando inicializa el servidor
app.listen(port, () => {
  console.log(`Escuchando el puerto ${port}`)
})
