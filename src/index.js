require('express-async-errors'); /* Esse require deve vir antes do routes */
const express = require('express');
const routes = require('./routes');

const app = express();

// Os middlewares são executados sequencialmente de cima para baixo

// O express interpreta nossas rotas como middlewares, porque basicamente é o que são
app.use(express.json());
app.use(routes);
/* Midleware error handler */
/* O express não consegue tratar esse erro por padrão se vier de um método assíncrono
   ele nunca sabe quando que a resposta virá
   Por isso usamos a lib express-async-errors
*/
app.use((error, request, response, next) => {
  console.log('Deu merda');
  console.log(error);
  response.sendStatus(500);
});

app.listen(3000, () => console.log('🔥 Server is started on http://localhost:3000'));
