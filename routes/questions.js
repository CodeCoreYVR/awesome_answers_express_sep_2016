var express = require('express');
var router  = express.Router();
var Question = require('../models/question');

// The order of routes matter. The first route that matches
// a given path will be used while the following routes will be ignored
// Be careful with routes that have `:` in their path as it
// signifies a wildcard match

router.get('/new', function(req, res, next){
  res.render('questions/new');
});

router.get('/', function(req, res, next) {
  // We can query Mongo with Mongoose by using the
  // .find method (there are many others). If we give find's
  // first argument and empty object, it will get all the questions
  Question.find({}).sort({createdAt: -1}).exec(function(err, questions) {
    if (err) {
      next();
    } else {
      res.render('questions/', {questions: questions})
    }
  })
})

router.get('/:id', function (req, res, next) {
  var questionId = req.params.id;
  Question.findOne({_id: questionId}, function (err, question) {
    if (err) {
      next();
    } else {
      res.render('questions/show', {question: question});
    }
  })
})

router.post('/', function(req, res, next){
  var question = new Question({
    title: req.body.title,
    description: req.body.description
  })

  question.save(function (err, question) {
    if (err) {
      res.render('questions/new', {errors: err});
    } else {
      // Send the user to the question index if save is
      // successful
      res.redirect('/questions');
    }
  })
});

router.delete('/:id', function (req, res, next) {
  var questionId = req.params.id;
  Question.remove({_id: questionId}, function (err, question) {
    if (err) {
      next();
    } else {
      res.redirect('/questions');
    }
  })
})

module.exports = router;
