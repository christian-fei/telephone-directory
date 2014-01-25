var searchToggle = document.querySelector('.search-toggle');
var searchInput = document.querySelector('.search-input');

//register events for the search input field and toggle
searchToggle.addEventListener('click', toggleSearch, true);
searchInput.addEventListener('keyup', search, true)


/*
  to restore the original list if the search query is not valid
*/
var entries = document.querySelector('.entries');
var origList = entries ? entries.innerHTML : '';

/* template of search results */
var searchResultTemplate = '<li><span class="name">{name}</span><span class="surname">{surname}</span><span class="number">{number}</span><a href="/edit/{_id}" class="icon edit"></a><a href="/delete/{_id}" class="icon delete"></a></li>'

/*
  the XMLHttpRequest to retrieve search results from the server
*/
var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");


function toggleSearch(e){
  e.preventDefault();
  setTimeout(function(){
    searchInput.focus();
  },100);
  searchInput.classList.toggle('show');
}
function search(){
  var query = searchInput.value;
  query = query.trim();

  if( query ){
    query = encodeURIComponent(query);

    //abort previous request
    xhr.abort();
    xhr.open('GET', '/search/' + query, true);
    xhr.onreadystatechange = function(){
      if( xhr.status == 200 && xhr.readyState == 4 ){
        try{
          var results = JSON.parse( xhr.responseText );
          if( results.length ){
            entries.innerHTML = '';
            renderSearchResults( results );
          }else{
            entries.innerHTML = '<h4>no entry matched your search criteria</h4>';            
            entries.innerHTML += origList;            
          }
        }catch(e){
          console.log( e );
        }
      }
    }
    xhr.send();
  }else{
    entries.innerHTML = origList;
  }
}
function renderSearchResults(results){
  results.forEach(function(entry){
    output = searchResultTemplate;
    output = searchResultTemplate.replace(/\{(.*?)\}/g, function(match, property) {
        return entry[property];
    });
    entries.innerHTML += output;
  });
}

/**
var numberInput = document.querySelector('input#number'); 
if( numberInput ){
  numberInput.addEventListener('keyup', checkNumber, true);
}
function checkNumber(){
    if( !/^\+[0-9]{2,4} [0-9]{2,4} [0-9]{6,15}$/.test(numberInput.value) ){
      numberInput.classList.add('error');
    }else{
      numberInput.classList.remove('error');
    }
}
/**/