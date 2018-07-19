var express = require('express');
var router = express.Router();

console.log("loading login page!!!")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Sign In' });
});

router.post('/', function(req, res, next) {
  console.log(req.body.username)
  console.log(req.body.password)
  res.render('signin', { title: 'Sign Into My Account' });
});

module.exports = router;
