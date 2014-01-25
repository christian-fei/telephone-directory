/*
	      __  _______  ____  __  ____    ___________
       /  |/  / __ \/ __ \/ / / / /   / ____/ ___/
      / /|_/ / / / / / / / / / / /   / __/  \__ \ 
     / /  / / /_/ / /_/ / /_/ / /___/ /___ ___/ / 
    /_/  /_/\____/_____/\____/_____/_____//____/  
                                                  
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
	     _____ ______________  ______ 
      / ___// ____/_  __/ / / / __ \
      \__ \/ __/   / / / / / / /_/ /
     ___/ / /___  / / / /_/ / ____/ 
    /____/_____/ /_/  \____/_/      
                                    
*/
app.set('port', process.env.PORT || 3000); //PORT
app.set('views', __dirname + '/views'); //views dir
app.set('view engine', 'jade'); //use the Jade templating engine


/*
	      __  ___________  ____  __    _______       _____    ____  ___________
       /  |/  /  _/ __ \/ __ \/ /   / ____/ |     / /   |  / __ \/ ____/ ___/
      / /|_/ // // / / / / / / /   / __/  | | /| / / /| | / /_/ / __/  \__ \ 
     / /  / // // /_/ / /_/ / /___/ /___  | |/ |/ / ___ |/ _, _/ /___ ___/ / 
    /_/  /_/___/_____/_____/_____/_____/  |__/|__/_/  |_/_/ |_/_____//____/  
                                                                             
*/
app.use(express.json()); //json middleware
app.use(express.urlencoded()); //urlencoded middleware

app.use(app.router);
app.use(express.static(__dirname + '/public')); //serve static files from the public directory


/*
	      ____  ____  __  ___________________
       / __ \/ __ \/ / / /_  __/ ____/ ___/
      / /_/ / / / / / / / / / / __/  \__ \ 
     / _, _/ /_/ / /_/ / / / / /___ ___/ / 
    /_/ |_|\____/\____/ /_/ /_____//____/  
                                           
*/

function redirectTo( res, path ){
  res.writeHead(302, {
    'Location': path
  });
  res.end();
}

/*
  render a list of entries if any
*/
app.get('/', function(req,res){
  phonebook.getEntries(10, function(entries){
    res.render('index', {entries: entries});
  });
});

/*
  render the add form
*/
app.get('/add', function(req,res){
  res.render('form',{name:'add'});
});

/*
  insert (if not existing and valid)
  and redirect to / with GET
*/
app.post('/add', function(req,res){
  var entry = req.body;
  phonebook.insert(entry, function(doc){
    /* redirect the post request */
    redirectTo(res, '/');
  });
});

/*
  render the edit form
  with the prefilled fields
*/
app.get('/edit/:id', function(req,res){
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

/*
  update the entry with the updated information
*/
/*
  render the edit form
  with the prefilled fields
*/
app.get('/edit/:id', function(req,res){
  var id = req.params.id;
  phonebook.getEntry(id, function(entry){
    if(entry){
      res.render('form',{name:'edit', entry: entry});
    }else{
      res.render('form',{name:'add'});
    }
  });
});
/*
  this route will be hit, when the user submits the edit form
*/
app.post('/edit', function(req,res){
  var id = req.body.id,
    doc = req.body;

  phonebook.update(id, doc, function(success){
    redirectTo(res, '/');
  });
});

app.get('/delete/:id', function(req,res){
  var id = req.params.id;
  phonebook.remove(id, function(success){
    redirectTo(res, '/');
  });
});




/*
	     _____ __________ _    ____________ 
      / ___// ____/ __ \ |  / / ____/ __ \
      \__ \/ __/ / /_/ / | / / __/ / /_/ /
     ___/ / /___/ _, _/| |/ / /___/ _, _/ 
    /____/_____/_/ |_| |___/_____/_/ |_|  
                                          
*/
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on http://localhost:' + app.get('port'));
});