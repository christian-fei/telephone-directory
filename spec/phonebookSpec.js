var phonebook = require('../modules/phonebook');

var validEntry = {
  name:     "Christian",
  surname:  "Fei",
  number:  "+00 00 000000"
};
var updatedValidEntry = {
  name:     "ChristianUpdated",
  surname:  "FeiUpdated",
  number:  "+00 00 000001"
};
var invalidEntry = {
  name:     "Christian",
  surname:  "Fei",
  number:  "+00 00 0000"
};

var insertedId = null;


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
    phonebook.insert(validEntry, function(doc){
      insertedId = '' + doc._id;
      expect( doc ).toBeTruthy();
      done();
    });
  },3000);

  it('should result in a duplicate phonebook entry', function(done){
    phonebook.insert(validEntry, function(doc){
      expect( doc ).toBeFalsy();
      done();
    });
  },3000);  

  it('should result in an existing number', function(done){
    phonebook.exists("+00 00 000000", function(success){
      expect( success ).toBeTruthy();
      done();
    });
  },3000);

  it('should update an existing entry', function(done){
    phonebook.update(insertedId, updatedValidEntry, function(success){
      expect( success ).toBeTruthy();
      done();
    });
  },3000);

  it('should return an array of results', function(done){
    phonebook.getEntries(10, function(results){
      //console.log( results );
      expect( results ).toBeTruthy();
      done();
    });
  },3000);

  it('should remove the previously inserted document by id', function(done){
    phonebook.remove(insertedId, function(success){
      expect( success ).toBeTruthy();
      done();
    });
  },3000);

  it('should close the connection to the database', function(done){
      phonebook.disconnect(function(err,res){
        expect( err ).toBe(null);
        done();
      });
  });
});