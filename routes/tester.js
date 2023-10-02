const express = require('express');
const { getBooks } = require('../controllers/books');
const app = express.Router();

const func1 = async (req, res, next) => {
  console.log('FUNC 1 START');
  console.log(req.body);

  res.send(req.body);
  req.body.file = 'Sulemn';
  next();
  console.log('FUNC 1', req.body);
  console.log('FUNC 1 END');
};

app.get('/tester', func1, func2, func3);

async function func2(req, res, next) {
  console.log('FUNC 2 START');
  if (req.body.name) await next();

  console.log(req.body);
  req.body.name = 'New settings';
  req.body.weekend = 'New weekend';
  req.body.logger = () => console.log("LOGGER");
  req.writer = (name) => console.log("Hello", name);

  console.log('FUNC 2 END');
}

async function func3(req, res, next) {
  console.log('FUNC 3 START');
  console.log(req.body);
  // req.body.logger();
  // req.writer("Susan");
  console.log('FUNC 3 END');
}

module.exports = app;
