var express = require('express');
var router  = express.Router();

router.get('/new', function(req, res, next){
  res.render('questions/new');
});

router.post('/', function(req, res, next){
  res.end('creating question action');
});

module.exports = router;
