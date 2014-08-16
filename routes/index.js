var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.json({message: 'welcome to api'});// res.render('index', { title: 'Express' });
});

module.exports = router;
