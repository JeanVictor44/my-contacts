const express = require('express');
const routes = require('./routes');

const app = express();

// Os middlewares são executados sequencialmente de cima para baixo

// O express interpreta nossas rotas como middlewares, porque basicamente é o que são
app.use(express.json());
app.use(routes);

app.listen(3000, () => console.log('🔥 Server is started on http://localhost:3000'));
