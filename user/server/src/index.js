//Archivo donde se inicia el servidor
import app from "./app"

app.listen(app.get('port'))

console.log('Server on port', app.get('port'))
    