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

// Everything before `/answers` and after `/` will be put inside
// the req.params object under the key questionId
router.post('/:questionId/answers', function (req, res, next) {
  // Step 1: We find the question that will own the answer

  // The callback passed to Mongoose query methods receives the err and result
  // argument in a very specific order. The error is always the pifirst argument.
  // The is very typical of the callback pattern
  Question.findOne({_id: req.params.questionId}, function (err, question) {
    if (err) {
      // Step 2: If doesn't find a question, let the app continue to 404 page
      next(err);
    } else {
      // Step 3: Question having been found, push the properties of the answer
      // inside the question.answers array
      // This is how Mongoose creates sub-documents
      question.answers.push({description: req.body.description});

      // Step 4: Having modified the question, we save those changes
      question.save(function (err, question) {
        if (err) {
          next(err);
        } else {
          // Step 5: We send the user back to originating question
          res.redirect(`/questions/${question.id}`)
        }
      });
    }
  });
})

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
