var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Migration Music 2.0'
  });
});

router.get('/circle', function (req, res, next) {
  res.render('circle-on-line');
});

module.exports = router;