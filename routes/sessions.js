var express = require('express');
var router  = express.Router();
var passport = require('passport');

router.get('/new', function(req, res, next){
  res.render('sessions/new');
});

router.post('/', passport.authenticate('local', { successRedirect: '/',
                                                  failureRedirect: '/sessions/new',
                                                  failureFlash: true })
            );

module.exports = router;
