const http = require('http');
const debug = require('debug')('node-angular')
const app = require('./backend/app');

const normalizePort = val => {
  let port = parseInt(val, 10);

  if(isNaN(val)) {

    return val;
  }

  if(port >= 0) {

    return port;
  }

  return false;
}

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe' + addr : 'port' + port;
  debug('Listening on ' + bind);
  console.log('listening on ' + bind)
}

const onError = error => {
  if(error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof addr === 'string' ? 'pipe' + addr: 'port' + port;

  switch(error.code) {
    case 'EACCESS':
      console.error(bind + ' request elevated previlages');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');

    break;
      default:
      throw error;

  }

};

const port = normalizePort(process.env.PORT || "3000");

app.set(port, port)
const server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);

server.listen(port)
