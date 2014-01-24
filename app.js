/*
	MODULES
*/
var express = require('express'),
  phonebook = require('./modules/phonebook'),
	numberValidator = require('./modules/numberValidator'),
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
  /*
    render a list of entries if any
  */
  phonebook.getEntries(10, function(entries){
    res.render('index', {entries: entries});
  });
});
app.get('/add', function(req,res){
  /*
    render the add form
  */
  res.render('form',{name:'add'});
});
app.post('/add', function(req,res){
  /*
    insert (if not existing and valid)
    and redirect to / with GET
  */
  var entry = req.body;
  phonebook.insert(entry, function(doc){
    /* redirect the post request */
    res.writeHead(302, {
      'Location': '/'
    });
    res.end();
  });
});
app.get('/edit/:id', function(req,res){
  /*
    render the edit form
    with the prefilled fields
  */
  var id = req.params.id;
  phonebook.getEntry(id, function(entry){
    console.log( entry );
    if(entry){
      res.render('form',{name:'edit', entry: entry});
    }else{
      res.render('form',{name:'add'});
    }
  });
});
app.post('/edit', function(req,res){
  /*
    update the entry with the updated information
  */
  /**/
  var id = req.body.id,
    doc = req.body;

  console.log( doc );

  phonebook.update(id, doc, function(success){
    console.log( success );
    res.writeHead(302, {
      'Location': '/'
    });
    res.end();
  });
  /**/
});


/*
	LAUNCH THE SERVER
*/
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on http://localhost:' + app.get('port'));
});