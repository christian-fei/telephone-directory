var searchToggle = document.querySelector('.search-toggle');
var searchInput = document.querySelector('.search-input');

/*
  to restore the original list if the search query is not valid
*/
var entries = document.querySelector('.entries');
var origList = entries ? entries.innerHTML : '';

/* template of search results */
var searchResultTemplate = '<li><span class="name">{name}</span><span class="surname">{surname}</span><span class="number">{number}</span><a href="/edit/{_id}" class="edit">edit</a><a href="/delete/{_id}" class="delete">delete</a></li>'

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
          entries.innerHTML = '';
          console.log( results );
          renderSearchResults( results );
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
if(searchToggle && searchInput){
  searchToggle.addEventListener('click', toggleSearch, true);
  searchInput.addEventListener('keyup', search, true)
}
