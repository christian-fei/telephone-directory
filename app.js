/*
	MODULES
*/
var express = require('express'),
	phonebook = require('./phonebook'),
	http = require('http');

var app = express();

/*
	Connect the phonebook to the collection contacts
*/
phonebook.connect( process.env.MONGO_URL, 'contacts', function(success){
	if(!success){
		console.log( "phonebook connection unsuccessfull".red );
		process.exit(1);
	}
});


/*
	SETUP
*/
app.set('port', process.env.PORT || 3000); //PORT
app.set('views', __dirname + '/views'); //views dir
app.set('view engine', 'jade'); //use the Jade templating engine


/*
	MIDDLEWARES
*/
app.use(express.json()); //json middleware
app.use(express.urlencoded()); //urlencoded middleware

app.use(app.router);
app.use(express.static(__dirname + '/public')); //serve static files from the public directory


/*
	ROUTES
*/
app.get('/', function(req,res){
	res.render('index');
});
app.get('/add', function(req,res){
	res.render('add');
});
app.get('/edit/:id', function(req,res){
	console.log( req.params.id );
	res.render('edit');
});


/*
	LAUNCH THE SERVER
*/
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on http://localhost:' + app.get('port'));
});