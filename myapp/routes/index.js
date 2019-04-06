var express = require('express');
var router = express.Router();
const axios = require('axios');
const clientsData = 'http://www.mocky.io/v2/5808862710000087232b75ac';
const policiesData = 'http://www.mocky.io/v2/580891a4100000e8242b75c5';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Test axios
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

// Get user data filtered by user id OK
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
        res.status(404).send('client not found');
      }
    })   
})

// Get user data filtered by user name OK
router.get('/api/v1/users/name/:name', function(req, res, next) {
  axios.get(clientsData)
    .then(results => {
      if (results.error) {
        res.status(500).send(results.error);
      } else {
        for ( let i = 0; i < results.data.clients.length; i++) {
          if (results.data.clients[i].name.toLowerCase() === req.params.name.toLowerCase()) {
            return res.send(results.data.clients[i]);
          } 
        }
        res.status(404).send('client not found');
      }
    })   
}) 

// Get the list of policies linked to a user name OK
router.get('/api/v1/policies/:name', function(req, res, next) {
  let userId = '';
  axios.get(clientsData)
    .then(results1 => {
      if (results1.error) {
        res.status(500).send(results1.error);
      } else {
        for ( let i = 0; i < results1.data.clients.length; i++) {
          if (results1.data.clients[i].name.toLowerCase() === req.params.name.toLowerCase()) {
            userId = results1.data.clients[i].id; 
            return axios.get(policiesData)
          } 
        }
        res.status(404).send('client not found');
      }
    })
    .then(results2 => {
      if (results2.error) {
        res.status(500).send(results2.error);
      } else {
        for ( let i = 0; i < results2.data.policies.length; i++) {
          if (userId === results2.data.policies[i].clientId) {
            return res.send(results2.data.policies[i]);
          }
        }
        res.status(404).send('policy not found');
      }
    })
}) // to be included: toLowerCase


// Get the user linked to a policy number OK
router.get('/api/v1/users/:policyId', function(req, res, next) {
  let userId = '';
  axios.get(policiesData)
    .then(results1 => {
      if (results1.error) {
        res.status(500).send(results1.error);
      } else {
        for ( let i = 0; i < results1.data.policies.length; i++) {
          if (results1.data.policies[i].id === req.params.policyId) {
            userId = results1.data.policies[i].clientId; 
            return axios.get(clientsData)
          } 
        }
        res.status(404).send('policy not found');
      }
    })
    .then(results2 => {
      if (results2.error) {
        res.status(500).send(results2.error);
      } else {
        for ( let i = 0; i < results2.data.clients.length; i++) {
          if (userId === results2.data.clients[i].id) {
            return res.send(results2.data.clients[i]);
          }
        }
        res.status(404).send('client not found');
      }
    })
})

module.exports = router;
