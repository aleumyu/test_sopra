require("dotenv").config();
var express = require('express');
var router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { checkTokenForRoles } = require('../middleware/checktoken');
const clientsData = 'http://www.mocky.io/v2/5808862710000087232b75ac';
const policiesData = 'http://www.mocky.io/v2/580891a4100000e8242b75c5';



// generate JWT token
router.get('/api/v1/users/token/:userid', function(req, res, next) {
  axios.get(clientsData) 
    .then(results => {
      if (results.error) {
        res.status(500).send(results.error);
      } else {
        for ( let i = 0; i < results.data.clients.length; i++ ) {
          if (results.data.clients[i].id === req.params.userid) {
            return res.send(jwt.sign(results.data.clients[i], process.env.secretKey, { expiresIn: '1h' }));
          }
        }
        console.log('ERROR: cannot login');
        return res.status(404).send('404 Error: No user found for that id');
        
      }
    });
});

// Get user data filtered by userid or username OK
router.get('/api/v1/users/', checkTokenForRoles('user,admin'), function(req, res, next) {
  console.log('test')
  let idParam = req.query.userid;
  let nameParam = req.query.username;
  axios.get(clientsData)
    .then(results => {
      if (results.error) {
        res.status(500).send(results.error);
      } else if (idParam) {
        for ( let i = 0; i < results.data.clients.length; i++) {
          if (results.data.clients[i].id === idParam) {
            return res.send(results.data.clients[i]); 
          } 
        }
        return res.status(404).send('client with the id not found');
      } else if (nameParam) {
        for ( let i = 0; i < results.data.clients.length; i++) {
          if (results.data.clients[i].name.toLowerCase() === nameParam.toLowerCase()) {
            return res.send(results.data.clients[i]);
          } 
        }
        return res.status(404).send('client with the name not found');
      }    
    });   
});


// Get the list of policies linked to a username OK
router.get('/api/v1/policies', function(req, res, next) {
  let userName = req.query.username;
  let userId = '';
  let policies = [];
  axios.get(clientsData)
    .then(results1 => {
      if (results1.error) {
        res.status(500).send(results1.error);
      } else {
        for ( let i = 0; i < results1.data.clients.length; i++) {
          if (results1.data.clients[i].name.toLowerCase() === userName.toLowerCase()) {
            userId = results1.data.clients[i].id; 
            return axios.get(policiesData);
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
            policies.push(results2.data.policies[i]);           
          }
        }
        return policies;
      }
    })
    .then(results3 => {
      if (results3.error) {
        res.status(500).send(results3.error);
      } else if (results3[0]) {
        res.send(results3);
      } else {
        res.status(404).send('policy not found');
      } 
    });
}); 


// Get the user linked to a policy number OK
router.get('/api/v1/users/:policyId', function(req, res, next) {
  let userId = '';
  let found = false;
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
        return res.status(404).send('client not found');
      }
    });
});

module.exports = router;
