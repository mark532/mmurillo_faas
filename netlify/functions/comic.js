'use strict';
const fs = require('fs');
const express = require('express');
const serverless = require('serverless-http');
const exp = express();
const bodyParser = require('body-parser');
const app = express.Router();

let comics = [];

const loadRevistas = () => {
    fs.readFile(__dirname + '/' + 'revistas.json', 'utf8', (err, data) => {
        comics = JSON.parse(data)
    });
}
loadRevistas()

const saveRevistas = () => {
    let data = JSON.stringify(revistas)
    fs.writeFileSync(__dirname + '/' + 'revistas.json', data)
}

app.get('/', (req, res) => {
    res.json(comics);
})

app.get('/:id', (req, res) => {
    let revista = comics.find(i => i.id == req.params.id);
    if (revista == undefined)
        res.status(404).send('Comic not found');
    else
        res.json(comics);
})

app.post('/', (req, res) => {
    let index = comics.findIndex(i => i.id == req.body.id);
    if (index != -1)
        res.status(404).send('Comic already exits');
    else {
        comics.push(req.body);
        saveRevistas();
    }
    res.status(200).send('Comic added');
})

app.post('/delete/:id', (req, res) => {
    let index = comics.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send('Comic not found');
    else {
        comics = comics.filter(i => i.id != req.params.id);
        saveRevistas();
    }
    res.status(200).send('Comic deleted');
})

app.put('/:id', (req, res) => {
    let index = comics.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send('Comic not found');
    else {
        comics[index] = req.body;
        saveRevistas();
    }
    res.status(200).send('Comic updated');
})

exp.use(bodyParser.json());
exp.use('/.netlify/functions/comics', app);

module.exports = exp;
module.exports.handler = serverless(exp);