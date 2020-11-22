	//For routing admin related requested
	const mysql = require('mysql');
	const flash    = require('connect-flash');
	const dbconfig = require('../config/database');
	const request = require('request');
	var xl = require('excel4node');
	const adminid = 126; //id of admin in database

	var connection = mysql.createConnection(dbconfig.connection); //Configing the database connection
	connection.query('USE ' + dbconfig.database);
	module.exports = function(app, passport) {

	app.get('/new',isLoggedIn, function(req, res) {
		// render the page and pass in any flash data if it exists
		var type = req.param('type');
	if(req.user.id === adminid){
		res.render('new.ejs', { message: req.flash('done'),user : req.user,type: type});
	}else{
		res.redirect('/');
	}
	});

	app.get('/admin', isLoggedIn, function(req, res) {
		var user_id = req.user.id;
		if(user_id === adminid){			
				//Querying all subscriptions with all three tables
				var query = 'SELECT subscription.course_id, subscription.user_id, subscription.date , courses.course_name, courses.grade, users.username FROM `subscription` INNER JOIN courses ON subscription.course_id=courses.course_id INNER JOIN users ON users.id = subscription.user_id order by courses.course_name, grade';
				connection.query( query, function(err, results){			    	
				if(err) 
				{console.log(err);} 
				else
					{
						console.log(results);
						var courses = results;
						res.render('admin.ejs', {
						user : req.user, // get the user out of session and pass to template
						courses: courses});
					}
					


				}); 	
		
		}

		else {
			res.redirect('/profile');
		}
	

	});
	app.get('/excel', isLoggedIn, function(req, res) {
		var user_id = req.user.id;
		if(user_id === adminid){
				//Querying all subscriptions to send it to excell file		
				var query = 'SELECT subscription.course_id, subscription.user_id, subscription.date , courses.course_name, courses.grade, users.username FROM `subscription` INNER JOIN courses ON subscription.course_id=courses.course_id INNER JOIN users ON users.id = subscription.user_id order by courses.course_name, grade';
				connection.query( query, function(err, results){			    	
				if(err) 
				{console.log(err);} 
				else
					{
						console.log(results);
						var courses = results;
						// Create a new instance of a Workbook class
						var wb = new xl.Workbook();
						 
						// Add Worksheets to the workbook
						var grade7 = wb.addWorksheet('7grade');
						var grade8 = wb.addWorksheet('8grade');
						var grade9 = wb.addWorksheet('9grade');
						var grade10 = wb.addWorksheet('10grade');
						var grade11 = wb.addWorksheet('11grade');
						var grade12 = wb.addWorksheet('12grade');
			
						var off = 0;
						// Create a reusable style
						var style = wb.createStyle({
						  font: {
						    color: 'black',
						    size: 12,
						  },
						  numberFormat: '$#,##0.00; ($#,##0.00); -',
						});
 						// Set value of cell A1 to 100 as a number type styled with paramaters of style

 						var off = 0; // for offseting

						for (var i = 0; i < courses.length; i++) {
							course_name= courses[i].course_name;
							course_username = courses[i].username;
							course_grade= courses[i].grade;
							if(course_grade == 7){
						
							grade7.cell(i+1+off, 1)
							  .string(course_name)
							  .style(style);
							grade7.cell(i+1+off, 2)
							  .string(course_username)
							  .style(style);
							grade7.cell(i+1+off, 3)
							  .string(course_grade)
							  .style(style);

						};
													if(course_grade == 8){
							
							grade8.cell(i+1+off, 1)
							  .string(course_name)
							  .style(style);
							grade8.cell(i+1+off, 2)
							  .string(course_username)
							  .style(style);
							grade8.cell(i+1+off, 3)
							  .string(course_grade)
							  .style(style);

						};
													if(course_grade == 9){
						
							grade9.cell(i+1+off, 1)
							  .string(course_name)
							  .style(style);
							grade9.cell(i+1+off, 2)
							  .string(course_username)
							  .style(style);
							grade9.cell(i+1+off, 3)
							  .string(course_grade)
							  .style(style);

						};
						if(course_grade == 10){
							
							grade10.cell(i+1+off, 1)
							  .string(course_name)
							  .style(style);
							grade10.cell(i+1+off, 2)
							  .string(course_username)
							  .style(style);
							grade10.cell(i+1+off, 3)
							  .string(course_grade)
							  .style(style);

						};
						if(course_grade == 11){
							
							grade11.cell(i+1+off, 1)
							  .string(course_name)
							  .style(style);
							grade11.cell(i+1+off, 2)
							  .string(course_username)
							  .style(style);
							grade11.cell(i+1+off, 3)
							  .string(course_grade)
							  .style(style);

						};
						if(course_grade == 11){
							
							grade12.cell(i+1, 1)
							  .string(course_name)
							  .style(style);
							grade12.cell(i+1, 2)
							  .string(course_username)
							  .style(style);
							grade12.cell(i+1, 3)
							  .string(course_grade)
							  .style(style);

						};
						 }
						 
						wb.write('Courses.xlsx', function(err, stats) {
						  if (err) {
						    console.error(err);
						  } else {
						    res.send('Done'); // Prints out an done answer
						  }
						});

					}}); 	}

		else {
			res.redirect('/profile');
		}
	

	});
    app.post('/new', function (req, res) {
    	var newcourse = req.body.newcourse;
    	if(newcourse==='insert'){
    	var type = req.body.type;		
    	var grade = req.body.grade;
    	var img = req.body.img;		
    	var course_name = req.body.course_name;	
    	var teacher_id = req.body.teacher_id;
    	var course_description = req.body.course_description;
    	var course_full = req.body.course_full;
		console.log(course_description);
		 var insert = 'INSERT INTO `courses`(`course_name`, `grade`, `teacher_id`, `course_description`, `course_number`, `course_full`, `course_ex`,`img`) VALUES ("'+course_name+'",'+grade+','+teacher_id+',"'+course_description +'",0,'+course_full+',"'+course_description.substr(0, 50)+'","'+img+'")';
    	}
		 connection.query( insert, function(err, rows){
       	if(err) {
       		console.log(err);

       	} else
		{   
			req.flash('Success', 'Registered successfully');
			res.redirect('/new?type=course');
		}
			    	
  		}); 

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
