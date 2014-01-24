var mongodb = require('mongodb'),
  colors = require('colors'),
  BSON = mongodb.BSONPure,
 	numberValidator = require('./numberValidator'),
	db = null,
	contacts = null;


/*
	Connect the phonebook to a Mongo database and collection

	Params:
		url: [string]
			in the format: mongodb://<username>:<password>@host:port/<dbname>
		collection: [string]
			the name of the collection that holds the contacts informations
		callback: [function]
			the callback will be called once the connection is established
				or the connection failed
			If successfull, the first param passed to the function will be true,
				else false
*/
function connect(url, collection, callback){
	mongodb.connect(url, function(err, _db){
		if( err ){
			console.log( 'there was an error connecting to mongo'.bold.red );
			callback(false);
			process.exit(1);
		}
		console.log( 'connected to mongo'.bold.green );
		db =  _db;
		contacts = db.collection(collection);
		callback(true);
	});
}



/*
	Used for testing purposes [jasmine needs to end the connection to the database, else it will run endlessly]
*/
function disconnect(callback){
	db.close(callback);
}




/*
	Check if a specific phone number is already in use.

	Params:
		number: [string] in a valid format
			Valid format is: +39 02 1234567
				That is a "+" followed by a nonempty group of digits, a space, a nonempty group of digits, a space, a group of digits with at least 6 digits.
		callback: [function]
			function to be called after the async query
			The first parameter will be a boolean that reports wether the specific phone number exists
			If the collection is not ready yet, the first parameter will be null instead
*/
function exists(number, callback){
	if( contacts  ){
		contacts.findOne({
			numbers: {$in:[number]}
		}, function(err,item){ //callback function of findOne
			/*if there wasn't an error and the item results to be falsy, item doesn't exist*/
			if( !err && !item){
				callback(false);
			}else{
				callback(true);
			}
		});
	}else{
		/* collection is not ready yet */
		callback(null);
	}
}





/*
	checks if the provided object literal is valid.
	to be valid it should contain a field 'name', 'surname' and an array of phone numbers

*/
function isValidEntry(obj){
	if(obj && obj instanceof Object && obj.name
		 && obj.surname && obj.name.trim() && obj.surname.trim()
		 	 && obj.numbers instanceof Array && obj.numbers.length > 0){
		//test each number
		for(var i=0,l=obj.numbers.length; i<l;i++){
			if( !numberValidator.isValid( obj.numbers[i] ) ){
				return false;
			}
		}
		return true;
	}
	return false;
}




/*
	Inserts a new phone book entry.

	Params:
		callback: [function]
      function to be called after the async query
      To the callback function will be passed one parameter
      the inserted document representation
        or false if the query was unsuccessful
*/
function insert(doc, callback){
  if( isValidEntry(doc) ){
    contacts.insert(doc, function(err,item){
      if( !err && item ){
        callback(item[0]);  
      }else{
        callback(false);
      }
    }); 
  }else{
    callback(false);
  }
}


/*
  Deletes an existing phone book entry

  Params:
    callback: [function]
      function to be called after the async query
      To the callback function will be passed one parameter [bool] that
      reports wether the delete query was successful or not

*/
function remove(id, callback){
  contacts.remove({_id: id}, function(err,numberRemovedItems){
    if( !err && numberRemovedItems ){
      callback(true);
    }else{
      callback(false);
    }
  });
}



/*
  get a list of available phonenumbers

  Params:
    limit: [int]
      limit the number of entries returned
    callback: [function]
      to the callback function will be passed an array of entries or null if there was an error
*/
function getEntries(limit, callback){
  contacts.find({},{limit: limit}).toArray(function(err, result){
    if( err ){
      callback(null);
    }else{
      callback(result);
    }
  });
}









/*
	reveal public methods
*/
module.exports = {
	connect: connect,
	disconnect: disconnect,
	isValidEntry: isValidEntry,
  insert: insert,
  remove: remove,
	getEntries: getEntries,
	exists: exists
};