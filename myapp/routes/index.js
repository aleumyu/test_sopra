var express = require('express');
var router = express.Router();
const axios = require("axios");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/v1/users', function(req, res, next) {
  axios.get('http://www.mocky.io/v2/5808862710000087232b75ac')
    .then((users) => {
      console.log(users);
    })
    .catch((err) => {
      console.log(err);
    })
})

module.exports = router;
