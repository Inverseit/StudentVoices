	//For routing general or first time requests
	const moment = require('moment');
	const mysql = require('mysql');
	const flash    = require('connect-flash');
	const dbconfig = require('../config/database');
	const request = require('request');
	const langs = require('../config/langs'); //Connect the language dictionary


	var connection = mysql.createConnection(dbconfig.connection);
	connection.query('USE ' + dbconfig.database);
	module.exports = function(app, passport) {
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/load', isLoggedIn, function(req, res) {
		var ln = req.query.lang;
			console.log(ln);
			if(ln === 'ru'){
				setuplanguage = langs.ru; //russian
			}else{
				if(ln === 'en'){ 
					setuplanguage = langs.en; //english
				}else{
					setuplanguage = langs.kz;
				}

			};
			
		// connection.query("SELECT * FROM courses ",function(err, results){
		connection.query("SELECT * FROM courses Where grade = ?",[req.user.grade], function(err, results){
        if(err) throw err;
        var courses = results;        
       	console.log(courses);
        res.render('load.ejs', { title: 'courses', courses: courses,user : req.user, messagedanger: req.flash('twice'), messagesuccess: req.flash('success'), lang : setuplanguage  });
    	}); 

	});
	app.get('/',function(req, res) {
			// Configing the get query for the language detection
			var ln = req.query.lang;
			console.log(ln);
			if(ln === 'ru'){
				setuplanguage = langs.ru; //russian
			}else{
				if(ln === 'en'){ 
					setuplanguage = langs.en; //english
				}else{
					setuplanguage = langs.kz;
				}

			};
			

			res.render('index.ejs', { title: 'courses', lang : setuplanguage  });
    });

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

    app.post('/load', function (req, res) {
    	var user_id = req.body.user_id;
    	var course_id= req.body.course_id;
    	var course_number= parseInt(req.body.course_number)+1;
    	var date = moment().format("YYYY-MM-DD");
    	var insertcheck = 'SELECT COUNT(`sub_id`)  as number FROM `subscription` WHERE `course_id`='+course_id+' and `user_id`='+user_id;
    	var insertquery1= 'INSERT INTO `subscription`(`course_id`, `user_id`, `date`) VALUES ('+ course_id+','+ user_id+',"'+date+'");';
    	var insertquery2= ' UPDATE `courses` SET course_number ='+course_number+' WHERE course_id ='+course_id;
    	//Create queries for varies purposes

		connection.query( insertcheck, function(err, rows){
        	if(err) {console.log(err);} else
			        {	
			        	console.log(rows[0].number);
			        	if( rows[0].number>0){
			        		
			        		req.flash('twice', 'You can not register twice');
			        		res.redirect('/load');
			        	}else {
      	
				    	connection.query( insertquery1, function(err, results){
				        if(err) {console.log(err);} else
				        {
				        	connection.query( insertquery2, function(err, results){
				        	if(err) {console.log(err);} else
							        {
							       	var message =  'You subscribed to course '+course_id+' successfully';
							        req.flash('success', message);			        	
							    	res.redirect('/load');
							    	}
							    	
				    		}); 
				    	
				    	}
				    	
				    	}); 

				    }
			    	}
			    	
    		}); 


    	// res.send(insertquery);
	}); 
	app.get('/false', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('err.ejs', { message: req.flash('twice'),user : req.user});
	});











		app.get('/api/customers', (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  res.json(customers);
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


//Helpful fucntions
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
