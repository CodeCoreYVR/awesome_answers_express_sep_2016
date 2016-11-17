var express = require('express');
var router  = express.Router();
var Question = require('../models/question');

router.get('/new', function(req, res, next){
  res.render('questions/new');
});

router.post('/', function(req, res, next){
  var question = new Question({
    title: req.body.title,
    description: req.body.description
  })

  question.save(function (err, question) {
    if (err) {
      res.render('questions/new', {errors: err});
    } else {
      res.end(`Created Question with id: ${question.id}`)
    }
  })
});

module.exports = router;
