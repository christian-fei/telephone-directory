var phonebook = require('../phonebook');

describe('phonebook', function(){
	/**/
	it('should connect to the database', function(done){
		phonebook.connect( process.env.MONGO_URL, 'contacts', function(success){      
			expect(success).toBeTruthy();
			done();
		});
	},3000);
	it('should result be an existing number', function(done){
		phonebook.exists(123, function(err,doc){
			expect(doc).toBeTruthy();
			done();
		});
	},3000);
	/**/
});