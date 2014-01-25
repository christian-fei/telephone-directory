var searchToggle = document.querySelector('.search-toggle');
var searchInput = document.querySelector('.search-input');

var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
/*
  the search toggle only exists on the home page
*/
function toggleSearch(e){
  e.preventDefault();
  searchInput.classList.toggle('show');
}
function search(){
  var query = searchInput.value;
  query = query.trim();
  query = encodeURIComponent(query);

  //abort previous request
  xhr.abort();
  xhr.open('GET', '/search/' + query, true);
  xhr.onreadystatechange = function(){
    if( xhr.status == 200 && xhr.readyState == 4 ){
      try{
        var results = JSON.parse( xhr.responseText );
        console.log( results );
      }catch(e){
        console.log( e );
      }
    }
  }
  xhr.send();
}
if(searchToggle && searchInput){
  searchToggle.addEventListener('click', toggleSearch, true);
  searchInput.addEventListener('keyup', search, true)
}
