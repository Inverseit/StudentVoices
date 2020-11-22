//For routing user related requested
	const mysql = require('mysql');
	const flash    = require('connect-flash');
	const dbconfig = require('../config/database');
	const request = require('request');

	var connection = mysql.createConnection(dbconfig.connection);
	connection.query('USE ' + dbconfig.database);
	module.exports = function(app, passport) {

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});


	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/load', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/load');
    });




	
	//====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/load', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		var user_id = req.user.id;
		var query= 'SELECT subscription.course_id, subscription.user_id, subscription.date ,courses.course_name,courses.course_number,courses.teacher_id,teachers.teacher_lastname, teachers.teacher_name,courses.grade FROM `subscription` INNER JOIN courses ON subscription.course_id=courses.course_id INNER JOIN teachers ON teachers.teacher_id = courses.teacher_id where subscription.user_id='+user_id;
		connection.query( query, function(err, results){
				if(err) {console.log(err);} else
					{
						console.log(results);
						var courses = results;
						if(isEmpty(courses)) {
						    courses = undefined;
						    var size= undefined;
						} else {
						    courses = results;
						    var size = Object.size(courses);

						}
						console.log(typeof courses)
						res.render('profiletest.ejs', {
						user : req.user, // get the user out of session and pass to template
						courses: courses,
						size: size });
					}

							    	
		}); 		

	});

		app.post('/profile', function(req, res) {
		    var user_id = req.body.userid;
		    var deleteid = req.body.deleteid;
		    var course_number = parseInt(req.body.course_number)-1;
			var query= "SELECT `sub_id` as id FROM `subscription` WHERE `user_id`="+user_id+" and `course_id`="+deleteid;
			connection.query( query, function(err, results){
				        	if(err) {console.log(err); res.redirect('/profile');} else
							        {
							        	var deleteidsub = results[0].id;
							        	console.log(deleteidsub);
							        	query= "DELETE FROM `subscription` WHERE `sub_id`="+deleteidsub;
							        	connection.query( query, function(err, results){
							        	if(err) {console.log(err); res.redirect('/profile');} else
										        {
										        	query = ' UPDATE `courses` SET course_number ='+course_number+' WHERE course_id ='+deleteid;
													connection.query( query, function(err, results){
										        	if(err) {console.log(err); res.redirect('/profile');} else
													        {
													        	console.log(query);
													        	console.log('deleted');
										        			res.redirect('/profile');
													    	}
													    	
										    		});

										    	}
										    	
							    		});
							    	}
							    	
				    		});
				    		 
		    
		});
	
	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

}
