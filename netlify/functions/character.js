'use strict';
const fs = require('fs');
const express = require('express');
const serverless = require('serverless-http');
const exp = express();
const bodyParser = require('body-parser');
const app = express.Router();

let personajes = [];

const loadPersonajes = () => {
    fs.readFile(__dirname + '/' + 'personajes.json', 'utf8', (err, data) => {
        personajes = JSON.parse(data)
    });
}
loadPersonajes()

const savePersonajes = () => {
    let data = JSON.stringify(personajes)
    fs.writeFileSync(__dirname + '/' + 'personajes.json', data)
}

app.get('/', (req, res) => {
    res.json(personajes);
})

app.get('/:id', (req, res) => {
    let personaje = personajes.find(i => i.id == req.params.id);
    if (personaje == undefined)
        res.status(404).send('Personaje not found');
    else
        res.json(personaje);
})

app.post('/', (req, res) => {
    let index = personajes.findIndex(i => i.id == req.body.id);
    if (index != -1)
        res.status(404).send('Character already exits');
    else {
        personajes.push(req.body);
        savePersonajes();
    }
    res.status(200).send('Character added');
})

app.post('/delete/:id', (req, res) => {
    let index = personajes.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send('Character not found');
    else {
        personajes = personajes.filter(i => i.id != req.params.id);
        savePersonajes();
    }
    res.status(200).send('Character deleted');
})

app.put('/:id', (req, res) => {
    let index = personajes.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send('Character not found');
    else {
        personajes[index] = req.body;
        savePersonajes();
    }
    res.status(200).send('Character updated');
})

exp.use(bodyParser.json());
exp.use('/.netlify/functions/character', app);

module.exports = exp;
module.exports.handler = serverless(exp);