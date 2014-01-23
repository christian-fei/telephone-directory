var phonebook = require('../modules/phonebook');

describe('phonebook', function(){
  /**/
  it('should connect to the database', function(done){
    phonebook.connect( process.env.MONGO_URL, 'contacts', function(success){      
      expect(success).toBeTruthy();
      done();
    });
  },3000);

  it('should result in an existing number', function(done){
    phonebook.exists(123, function(err,doc){
      expect(doc).toBeTruthy();
      phonebook.disconnect();
      done();
    });
  },3000);
	/**/
});