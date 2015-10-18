// Load modules

var Path = require('path');
var Boards = require('./boards');
var Home = require('./home');


module.exports = [
    { path: '/3rd-party/{file*}', method: 'GET', config: { handler: { directory: { path: Path.join(__dirname, '../../assets/3rd-party') } } } },
    { path: '/css/{file*1}', method: 'GET', config: { handler: { directory: { path: Path.join(__dirname, '../../assets/css') } } } },
    { path: '/js/{file*1}', method: 'GET', config: { handler: { directory: { path: Path.join(__dirname, '../../assets/js') } } } },
    { path: '/node_modules/nes.js', method: 'GET', config: { handler: { file: Path.join(__dirname, '../../assets/3rd-party/js/nes.js') } } },
    { path: '/node_modules/node_modules/ws.js', method: 'GET', config: { handler: { file: Path.join(__dirname, '../../assets/3rd-party/js/ws.js') } } },
    { path: '/', method: 'GET', config: Home },
    { path: '/boards', method: 'GET', config: Boards }
];
