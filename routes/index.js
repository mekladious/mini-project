var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var User = require('../models/user');

// Homepage
router.get('/', function(req, res){
  Post.find({}, function(err, projects){
	if(err) throw err;
		User.find({}, function(err, users){
			if(err) throw err;
			 res.render('index', {
			 projects: projects,
			 users : users, 
			 user : req.user
			});
		});
	});
});

module.exports = router;
