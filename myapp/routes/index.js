var express = require('express');
var router = express.Router();
const axios = require("axios");
const clientsData = 'http://www.mocky.io/v2/5808862710000087232b75ac';
const policiesData = 'http://www.mocky.io/v2/580891a4100000e8242b75c5'
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/v1/users', function(req, res, next) {
  console.log("test call");
  axios.get(clientsData)
    .then((results) => {
      if (results.error) {
        console.log("hi");
        res.status(500).send(results.error);
      }
      console.log("hello");
      res.send(results.data);
    })
})

router.get('/api/v1/users/id/:id', function(req, res, next) {
  axios.get(clientsData)
    .then(results => {
      if (results.error) {
        res.status(500).send(results.error);
      } else {
        for ( let i = 0; i < results.data.clients.length; i++) {
          if (results.data.clients[i].id === req.params.id) {
            console.log('hi');
            return res.send(results.data.clients[i]);
          } 
        }
        console.log('bye');
        res.status(404).send('not found');
      }
    })   
})

router.get('/api/v1/users/name/:name', function(req, res, next) {
  axios.get(clientsData)
    .then(results => {
      if (results.error) {
        res.status(500).send(results.error);
      } else {
        console.log(req.params.name);
        console.log(results.data.clients[0].name);
        for ( let i = 0; i < results.data.clients.length; i++) {
          if (results.data.clients[i].name === req.params.name) {
            console.log('hi');
            return res.send(results.data.clients[i]);
          } 
        }
        console.log('bye');
        res.status(404).send('not found');
      }
    })   
})

module.exports = router;
