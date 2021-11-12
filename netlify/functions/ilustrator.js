'use strict';
const fs = require('fs');
const express = require('express');
const serverless = require('serverless-http');
const exp = express();
const bodyParser = require('body-parser');
const app = express.Router();

let ilustradores = [];

const loadIlustradores = () => {
    fs.readFile(__dirname + '/' + 'ilustradores.json', 'utf8', (err, data) => {
        ilustradores = JSON.parse(data)
    });
}
loadIlustradores()

const saveIlustradores = () => {
    let data = JSON.stringify(ilustradores)
    fs.writeFileSync(__dirname + '/' + 'ilustradores.json', data)
}

app.get('/', (req, res) => {
    res.json(ilustradores);
})

app.get('/:id', (req, res) => {
    let ilustrador = ilustradores.find(i => i.id == req.params.id);
    if (ilustrador == undefined)
        res.status(404).send('Ilustrator not found');
    else
        res.json(ilustrador);
})

app.post('/', (req, res) => {
    let index = ilustradores.findIndex(i => i.id === req.body.id);
    if (index != -1)
        res.status(404).send('Ilustrator already exits');
    else {
        ilustradores.push(req.body);
        saveIlustradores();
        res.status(200).send('Ilustrator added');
    }
})

app.post('/delete/:id', (req, res) => {
    let index = ilustradores.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send('Ilustrator not found');
    else {
        ilustradores = ilustradores.filter(i => i.id != req.params.id);
        saveIlustradores();
    }
    res.status(200).send('Ilustrator deleted');
})

app.put('/:id', (req, res) => {
    let index = ilustradores.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send('Ilustrator not found');
    else {
        ilustradores[index] = req.body;
        saveIlustradores();
    }
    res.status(200).send('Ilustrator updated');
})

exp.use(bodyParser.json());
exp.use('/.netlify/functions/ilustrator', app);

module.exports = exp;
module.exports.handler = serverless(exp);