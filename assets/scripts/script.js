const omdbKey = "e2bf0e18";

// Poster test
const testURL = "http://www.omdbapi.com/?apikey=" + omdbKey + "&s=titanic*";
$.ajax({
	url: testURL,
	method: "GET"
}).then(function (response) {
	console.log(response.Poster);
	console.log(response.Title);
});

// function to pull data from omdb API for searching
function searchMovieTitles(searchString) {
	const queryURL =
		"http://www.omdbapi.com/?apikey=" + omdbKey + "&s=" + searchString + "*";
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function (response) {
		const resultsArray = response.Search;
		const resultsMenu = $("#search-menu");
		resultsMenu.empty();
		if (resultsArray) {
			resultsArray.forEach((element) => {
				const movieTitle = $("<a>");
				movieTitle.text(element.Title + " (" + element.Year + ")");
				// movieTitle.attr("type", "button");
				movieTitle.addClass("dropdown-item");
				movieTitle.attr("data-movie-title", element.Title);
				movieTitle.attr("data-movie-year", element.Year);
				resultsMenu.append(movieTitle);
			});
		}
		// }).then(function (response) {
		// 	const resultsArray = response.Search;
		// 	const resultsDiv = $("#search-results");
		// 	resultsDiv.empty();
		// 	if (resultsArray) {
		// 		resultsArray.forEach((element) => {
		// 			const movieTitle = $("<button>");
		// 			movieTitle.text(element.Title + " (" + element.Year + ")");
		// 			movieTitle.attr("type", "button");
		// 			movieTitle.addClass("btn btn-secondary search-item");
		// 			movieTitle.attr("data-movie-title", element.Title);
		// 			movieTitle.attr("data-movie-year", element.Year);
		// 			resultsDiv.append(movieTitle);
		// 		});
		// 	}
	});
}

// function to pull data from omdb API for data of selected movie
function getMovieDetails(movieTitle, movieYear) {
	const queryURL =
		"http://www.omdbapi.com/?apikey=" +
		omdbKey +
		"&plot=full&t=" +
		movieTitle +
		"&y=" +
		movieYear;
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function (response) {
		console.log(response);
		console.log(response.Poster);
		console.log(response.Title);
		console.log(response.Year);
		console.log(response.Rated);
		console.log(response.Runtime);
		console.log(response.Plot);
		response.Ratings.forEach(function (rating) {
			console.log(rating.Source);
			console.log(rating.Value);
		});
		let actors = response.Actors.split(",");
		console.log(actors);
	});
}
// function to get movieDetails from data attributes and load search-result with those details
//  as parameters
function goToSearchResult(event) {
	const movieTitle = event.target.getAttribute("data-movie-title");
	const movieYear = event.target.getAttribute("data-movie-year");
	window.location.href =
		"./search-result.html?title=" + movieTitle + "&year=" + movieYear;
	// console.log(movieTitle, movieYear);
}

// function to add keyup handler once document is ready
$(function () {
	$(".movie-input").on("keyup", function (event) {
		// when key is released this function runs grabbing the text that is in the input box
		const textString = $(".movie-input").val();
		// first it checks if more than 2 characters have been typed as 2 or less gives too many results
		// error from the API

		// Sets dropdown display default as "none" to solve empty dropdown display bug while API is being called
		$("#search-menu").css("display", "none");

		if (textString.length > 2) {
			// if more than two characters then it calls the searchMovieTitles function
			searchMovieTitles(textString);

			// Solve bug: code runs before API call is completed
			setTimeout(() => {
				if ($("#search-menu").children().length == 0) {
					$("#search-menu").css("display", "none");
				} else {
					console.log("DROPDOWN TRIGGERED");
					console.log(textString);
					$("#search-menu").css("display", "block");
				}
			}, 500);
		} else {
			$("#search-menu").empty();
		}

		// Emptying field with Escape key
		if (event.keyCode == 27) {
			$(this).val("");
			$("#search-menu").empty();
			$("#search-menu").css("display", "none");
		}
	});

	$("#search-menu").on("click", goToSearchResult);
	if (window.location.search !== "") {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const movieTitle = urlParams.get("title");
		const movieYear = urlParams.get("year");
		getMovieDetails(movieTitle, movieYear);
	}
});

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
			console.log(result[0].name);
			console.log(result[0].birthday);
			console.log(result[0].net_worth);
			console.log(result[0].height);
		});
	}
	return celebNinjaInner;
}
let celebNinja = celebNinjaClosure();

// function to find actor details from wikipedia
function actorSearch(actorName) {
	$.ajax({
		method: "GET",
		url: "https://en.wikipedia.org/api/rest_v1/page/summary/" + actorName,
		contentType: "application/json"
	}).then(function (result) {
		console.log(result.title);
		console.log(result.thumbnail.source);
		console.log(result.extract);
	});
}

celebNinja();

//  not sure we need this document.ready function apart from for testing
// $(document).ready(function() {
//   var movieName = "Avatar";
//    movieSearch(movieName)
//   });

// dont think we need movieSearch2 and movieSearch3

// function movieSearch2(movieName2) {

// console.log(movieName2);

//      $.ajax({
//        method: "GET",
//        url: "https://en.wikipedia.org/api/rest_v1/page/summary/%20Pauvre_Pierrot?redirect=true" + movieName2,

//       contentType: "application/json"
//      }).then(function (result) {
//      console.log(result);
//      });
//    }
// $(document).ready(function() {
//   var movieName2 = "Pauvre Perrot";
//    movieSearch2(movieName2)
//   });

//   function movieSearch3(movieName3) {

//   console.log(movieName3);

//        $.ajax({
//          method: "GET",
//          url: "https://en.wikipedia.org/api/rest_v1/page/summary/Tintin?redirect=true" + movieName3,

//         contentType: "application/json"
//        }).then(function (result) {
//        console.log(result);
//        });
//      }
//   $(document).ready(function() {
//     var movieName3 = "Tintin";
//      movieSearch3(movieName3)
//     });
