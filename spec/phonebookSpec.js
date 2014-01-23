var phonebook = require('../modules/phonebook');

var validEntry = {
  name:     "Christian",
  surname:  "Fei",
  numbers:  ["+00 00 000000"]
};
var invalidEntry = {
  name:     "Christian",
  surname:  "Fei",
  numbers:  ["+0000 01 000000","+00 00 0000"]
};


describe('phonebook', function(){
  it('should connect to the database', function(done){
    phonebook.connect( process.env.MONGO_URL, 'contacts', function(success){      
      expect( success ).toBeTruthy();
      done();
    });
  },3000);

  it('should result in a valid entry', function(){
    expect( phonebook.isValidEntry(validEntry) ).toBeTruthy();
  });
  it('should result in a invalid entry', function(){
    expect( phonebook.isValidEntry(invalidEntry) ).toBeFalsy();
  });

  it('should insert a new phonebook entry', function(done){
    phonebook.insert(validEntry, function(success){
      expect( success ).toBeTruthy();
      done();
    });
  },3000);

  it('should result in a duplicate phonebook entry', function(done){
    phonebook.insert(validEntry, function(success){
      expect( success ).toBeFalsy();
      done();
    });
  },3000);  

  /**
  it('should result in an existing number', function(done){
    phonebook.exists("+00 00 000000", function(success){
      expect( success ).toBeTruthy();
      done();
    });
  },3000);
  /**/

  it('should close the connection to the database', function(done){
      phonebook.disconnect(function(err,res){
        expect( err ).toBe(null);
        done();
      });
  });
});