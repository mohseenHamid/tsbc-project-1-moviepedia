const OMDB_API_KEY = "e2bf0e18";

// function to pull data from omdb API for searching
function searchMovieTitles(searchString){
  const queryURL = "http://www.omdbapi.com/?apikey=" + OMDB_API_KEY + "&s=" + searchString + "*";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function(response){
    const resultsArray = response.Search;
    const resultsDiv = $('#searchResults');
    resultsDiv.empty();
    resultsArray.forEach(element => {

      const movieTitle = $('<div>').text(element.Title + " (" + element.Year + ")");
      resultsDiv.append(movieTitle)
    });
  })
}

// function to pull data from omdb API for data of selected movie
function getMovieDetails(movieTitle){
  const queryURL = "http://www.omdbapi.com/?apikey=" + OMDB_API_KEY + "&t=" + movieTitle;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function(response){
    console.log(response);
  })
}

// function to add keyup handler once document is ready
$(function(){
  $('#movieName').on('keyup', function(event){
    // when key is released this function runs grabbing the text that is in the input box
    const textString = $('#movieName').val();
    // first it checks if more than 2 characters have been typed as 2 or less gives a too many results
    // error from the API
    if(textString.length>2){
      // if more than two characters then it calls the searchMovieTitles function
      searchMovieTitles(textString);
    }
  })
})
// FUNCTION FOR CELEBNINJA API
function celebNinjaClosure(celebName) {
	celebName = "michael jackson"; // PLACEHOLDER

	function celebNinjaInner() {
		$.ajax({
			method: "GET",
			url: "https://api.celebrityninjas.com/v1/search?name=" + celebName,
			headers: { "X-Api-Key": "+qZ8SEACFRjRVK2XZ9RpgQ==urpaH1jT1cOiYaJ6" },
			contentType: "application/json"
		}).then((result) => {
			console.log(result);
		});
	}
	return celebNinjaInner;
}
let celebNinja = celebNinjaClosure();

celebNinja();
