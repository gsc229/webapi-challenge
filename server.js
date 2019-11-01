const express = require('express');
const morgan = require('morgan');
const projectsRouter = require('./routers/projectsRouter');
const actionsRouter = require('./routers/actionsRouter');

const server = express();
server.use(express.json());

server.use(morgan('dev'));

server.use('/api/projects', projectsRouter)
server.use('/api/actions', actionsRouter)



server.get('/', (req, res) => { res.send(`<h2>This is the server working</h2>`) })
module.exports = server;