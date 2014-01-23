var mongodb = require('mongodb'),
	colors = require('colors'),
	contactsColl = null;

/*
	Connect the phonebook to a Mongo database and collection

	Params:
		url: [string]
			in the format: mongodb://<username>:<password>@host:port/<dbname>
		collection 	
*/
function connect(url, collection, callback){
	mongodb.connect(url, function(err,db){
		if( err ){
			console.log( 'there was an error connecting to mongo'.bold.red );
			callback(false);
			process.exit(1);
		}
		console.log( 'connected to mongo'.bold.green );
		contactsColl = db.collection(collection);
		callback(true);
	});
}

/*
	Check if a specific phone number is already in use.

	Params:
		number: [string] in a valid format
			Valid format is: +39 02 1234567
				That is a "+" followed by a nonempty group of digits, a space, a nonempty group of digits, a space, a group of digits with at least 6 digits.
		callback: [function]
			function to be called after the async query
			To the function two parameters will be passed:
			err and doc.
			If doc is null, it means the phonenumber is available, else it is already in use.
*/
function exists(number, callback){
	if( contactsColl ){
		contactsColl.findOne({
			numbers: {$in:[number]}
		}, callback);
	}else{
		callback(null);
	}
}


/*
	reveal public methods
*/
module.exports = {
	exists: exists,
	connect: connect
};