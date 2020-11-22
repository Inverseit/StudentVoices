
	const dbconfig = require('../config/database');
	const request = require('request');
	
	module.exports = function(app) {
		

		app.get('/api/profile', (req, res) => {
			id = req.query.q;
			console.log(id);
  const customers = {
    user1: {id: 1, firstName: 'Ulan', lastName: 'Seitkaliyev'},
    user2: {id: 2, firstName: 'Temik', lastName: 'Temikov'},
    user3: {id: 3, firstName: 'Yerke', lastName: 'Stal'}
  };
  var real_id = "user" + id;
  res.json(customers[real_id]);
});


}
