var mongodb = require('mongodb'),
  colors = require('colors'),
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
		//console.log( 'connected to mongo'.bold.green );
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
	if( contacts ){
		contacts.findOne({
			number: number
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
		 	 && obj.number){
    return numberValidator.isValid( obj.number );
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
    exists( doc.number, function(exists){
      if( !exists ){
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
    });
  }else{
    callback(false);
  }
}

/*
  Update an existing phone book entry.

  Params:
    callback: [function]
      function to be called after the async query
      To the callback function will be passed one parameter
      true if the update was successful
        or false if unsuccessful
*/
function update(id, doc, callback){
  if( isValidEntry(doc) && id.length == 24 ){
    contacts.update({_id: new mongodb.ObjectID(id)}, 
      {name: doc.name, surname:doc.surname, number: doc.number},
      function(err, updatedCount){
        console.log('update',err, updatedCount);
        if( !err && updatedCount ){
          callback(true);
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
  if( id.length == 24 ){
    contacts.remove({_id: new mongodb.ObjectID(id)}, function(err,numberRemovedItems){
      if( !err && numberRemovedItems ){
        callback(true);
      }else{
        callback(false);
      }
    });
  }else{
    callback(false);
  }
}



/*
  get a single entry

  Params:
    callback: [function]
      to the callback function will be passed the entry or null if not found (or error)
*/
function getEntry(id, callback){
  if( id && id.length == 24){
    contacts.findOne({_id: new mongodb.ObjectID(id)},function(err, doc){
      console.log('getEntry', err,doc);
      if( err ){
        callback(null);
      }else{
        callback(doc);
      }
    });
  }else{
    callback(null);
  }
}

/*
  get a list of available numbers

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
  search by name or phonenumber

  Params:
    query: [string]
      It can contain letters and numbers
      if there are only numbers, only phonenumbers will be searched
      if there are letters too, it will be searched by name
*/
function search(query, callback){
  var onlyNumbers = /^\+?[0-9]{1,15}/;
  console.log( query );
  query = decodeURIComponent(query);
  /* else the regex would fail, because there are no characters to repeat after/before the + */
  query = query.replace('+','');
  console.log( query );
  if( onlyNumbers.test(query) ){
    console.log( 'searching number' );
    contacts.find({number: new RegExp(query)}).toArray(function(err,results){
      if( !err ){
        callback( results );
      }else{
        callback( [] );
      }
    });
  }else{
    console.log( 'searching name' );
    contacts.find({$or: [{name: new RegExp(query, 'gi')},{surname: new RegExp(query, 'gi')}]}).toArray(function(err,results){
      if( !err ){
        callback( results );
      }else{
        callback( [] );
      }
    });
  }
}






/*
	reveal public methods
*/
module.exports = {
	connect: connect,
	disconnect: disconnect,
	isValidEntry: isValidEntry,
  insert: insert,
  update: update,
  remove: remove,
  getEntry: getEntry,
  getEntries: getEntries,
	search: search,
	exists: exists
};