var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});	
var screenshot = multer({dest: 'public/screenshots/'});	

var User = require('../models/user');
var Post = require('../models/post');

// View profile
router.get('/profile', isLoggedIn, function(req, res) {
	 Post.find({username: req.user.username}, function(err, projects){
		if(err) throw err;
		 res.render('profile', {
			 projects: projects,
			 user : req.user // get the user out of session and pass to template
  		  });
	});
});

router.get('/profile/:param', function(req, res) {
	 Post.find({username: req.params.param}, function(err, projects){
		if(err) throw err;
		User.findOne({username: req.params.param}, function(err, profileVisit){
			if(err) throw err;
			res.render('profile', {
				projects: projects,
				profileVisit : profileVisit
			});
		});
	});
   
});

// View addwork
router.get('/addwork', function(req, res){
	res.render('addwork', {
        user : req.user // get the user out of session and pass to template
    });
});

// View editprofile
router.get('/editprofile', function(req, res){
		res.render('editprofile', {
        user : req.user // get the user out of session and pass to template
    });
});

router.post('/addwork', screenshot.single('screenshot'),function(req, res){
	var title = req.body.title;
	if(req.body.desc)
		var desc = req.body.desc;
	if(req.file)
		var img = "/screenshots/"+req.file.filename;
    var username = req.user.username;
	// Validation
	req.checkBody('title', 'Title is required').notEmpty();

	var errors = req.validationErrors();
	
	if(errors){
		res.render('addwork',{
			errors: errors
		});
	} else {
		var newPost = new Post({
			username: username,
			title: title,
			desc: desc,
			img: img
		});

		Post.addWork(newPost, function(err, post){
			if(err) throw err;
		});

		req.flash('success_msg', 'Post has been uploaded successfully');
		res.redirect('./profile');
	}
});

router.post('/editprofile', upload.single('profileimg'), function(req, res){
	//console.log("here");
	var img = "/uploads/"+req.file.filename;
	//console.log(req.user);
	User.addProfilePic(req.user, img, function(err, post){
		if(err) throw err;
	});
	req.flash('success_msg', 'Profile picture has been uploaded successfully');
	res.redirect('./profile');
});

router.get('/allprojects', function(req, res){
	Post.find({username: req.user.username}, function(err, projects){
		if(err) throw err;
		res.render('allprojects', {
			projects: projects,
			user : req.user // get the user out of session and pass to template
		});
	});
});

router.get('/allprojects/:param', function(req, res){
	var username = req.params.param;
	User.findOne({username: username}, function(err, profileVisit){
			Post.find({username: profileVisit.username}, function(err, projects){
			if(err) throw err;
			res.render('allprojects', {
				projects: projects,
				profileVisit : profileVisit // get the user out of session and pass to template
			});
		});
	});
	
});

router.get('/projectdetails/:param1', function(req, res){
	Post.findOne({_id:req.params.param1}, function(err, project){
		if(err) throw err;
		User.findOne({username: project.username}, function(err, profile){
			if(err) throw err;
			res.render('projectdetails', {
				project: project, 
				profileVisit:profile
			});
		});
	});

});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


module.exports = router;