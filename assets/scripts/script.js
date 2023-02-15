// OMDB API Key
const omdbKey = "e2bf0e18";

// Ftn to populate the movie search menu dropdown using data retrieved from OMDB API
// Called in the movie search callback ftn "returnSearchResults"
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
	});
}

// Callback ftn for search bar typing input
function returnSearchResults(event) {
	// Grabs the input field text and stores in variable
	const textString = $(".movie-input").val();

	// Sets dropdown display default as "none" to avoid displaying an empty dropdown display while API is running
	$("#search-menu").css("display", "none");

	// Prevents response results for <2 characters as <2 gives too many results
	if (textString.length > 2 && event.keyCode !== 27) {
		// If >2 characters are typed, the OMDB API "searchMovieTitles" ftn is called to populate the search menu
		searchMovieTitles(textString);

		// Only displays the search menu once API returns data
		// Solves bug: empty dropdown list is shown while API runs
		setTimeout(() => {
			if ($("#search-menu").children().length == 0) {
				$("#search-menu").css("display", "none");
			} else {
				$("#search-menu").css("display", "block");
			}
		}, 500);
	} else if (textString.length < 3) {
		$("#search-menu").empty();
	}
	// Enables the escape key to clear the input field
	else if (event.keyCode == 27) {
		$(this).val("");
		$("#search-menu").empty();
	}
}

// Function to populate actors' cards on movie modal (click on actor card)
function actorSearch(actor, cardNum) {
	$.ajax({
		method: "GET",
		url: "https://en.wikipedia.org/api/rest_v1/page/summary/" + actor,
		contentType: "application/json"
	}).then(function (result) {
		actorResult = {
			actorName: result.title,
			thumbnail: result.thumbnail.source,
			bio: result.extract
		};

		// Extracting card label
		let card = `.card-${cardNum}`;
		let cardTitle = `.card-title-${cardNum}`;
		let cardImg = `.card-img-${cardNum}`;

		// Assign card properties
		$(cardImg).attr("src", actorResult.thumbnail);
		$(cardTitle).text(actorResult.actorName);

		// Assign data attribute of actor name to the card to use later for actor modal
		$(card).attr("data-actor-name", actorResult.actorName);
	});
}

// Ftn called in the movie selection callback to pull selected movie's data from the OMDB API to populate modal
function getMovieDetails(movieTitle, movieYear) {
	const movieURL =
		"http://www.omdbapi.com/?apikey=" +
		omdbKey +
		"&plot=full&t=" +
		movieTitle +
		"&y=" +
		movieYear;
	$.ajax({
		url: movieURL,
		method: "GET"
	}).then(function (response) {
		// Assign response data to variables
		let posterURL = response.Poster;
		let movieTitle = response.Title;
		let movieYear = response.Year;
		let runtime = response.Runtime;
		let moviePlot = response.Plot;
		let movieRatedTag = response.Rated;
		let movieRatings = response.Ratings;
		// Fed into the Wiki API response ftn "actorSearch"
		let actors = response.Actors.split(",");

		// Populate movie modal movie details with OMDB API data
		$("#modal-movie-poster").attr("src", posterURL);
		$(".c2-r1-c1").text(`${movieTitle} (${movieYear})`);
		$(".c2-r1-c2").text(`Rated: ${movieRatedTag}`);
		$(".c2-r1-c3").text(`Runtime: ${runtime}`);
		$(".plot-content").text(`${moviePlot}`);

		let ratingsArrayLength = movieRatings.length;
		for (let i = 1; i < ratingsArrayLength + 1; i++) {
			// Extracting column label
			let column = `.c2-r4-c${i}`;

			// assign column text
			$(column).text(
				`${movieRatings[i - 1].Source}: ${movieRatings[i - 1].Value}`
			);
		}

		// Populate the modal's actor cards using Wiki API
		for (let i = 1; i < 4; i++) {
			actorSearch(actors[i - 1], i);
		}
	});

	// Allows the content to update before opening
	setTimeout(() => {
		// Display movie modal upon completion
		$("#movie-search-modal").modal("show");
	}, 800);
}

// Callback ftn for movie selection via search menu (calls the OMDB API ftn "getMovieDetails")
// Extracts HTML data attributes from target and feeds them into the OMDB API ftn as parameters
function goToSearchResult(event) {
	$(".movie-input").val("");
	$("#search-menu").css("display", "none");

	const movieTitle = event.target.getAttribute("data-movie-title");
	const movieYear = event.target.getAttribute("data-movie-year");

	// OMDB API ftn to retrieve required movie data for the movie modal
	getMovieDetails(movieTitle, movieYear);
}

// Callback ftn to populate actor modal with CelebNinja API data
function celebNinja(celebName) {
	$.ajax({
		method: "GET",
		url: "https://api.celebrityninjas.com/v1/search?name=" + celebName,
		headers: { "X-Api-Key": "+qZ8SEACFRjRVK2XZ9RpgQ==urpaH1jT1cOiYaJ6" },
		contentType: "application/json"
	}).then((result) => {
		$(".birthday").text("Birthday: " + result[0].birthday);
		$(".height").text("Height: " + result[0].height + "m");
		$(".net-worth").text("Net Worth: $" + result[0].net_worth);
	});
}

// Callback ftn (for actors' card selection in movie modal) which extracts Wiki API data to populate the actor modal
function actorModalSearch(actor) {
	$.ajax({
		method: "GET",
		url: "https://en.wikipedia.org/api/rest_v1/page/summary/" + actor,
		contentType: "application/json"
	}).then(function (result) {
		let actorImg = result.thumbnail.source;

		$(".actor-modal-img").attr("src", actorImg);
		$(".name").text(result.title);
		$(".more-info").text(result.extract);
	});
}

// Click event handler for movie modal cards
function actorModalOpen(event) {
	event.preventDefault();

	// Retrieve the actor name using the data attribute assigned to the card earlier
	const actorName = $(this).attr("data-actor-name");

	// Call the wiki API and celebNinja API ftns to populate actor modal
	actorModalSearch(actorName);
	celebNinja(actorName);

	// Allows the content to update before opening
	setTimeout(() => {
		// Display the actor modal and hide the movie modal
		$("#actor-modal").modal("show");
		$("#movie-search-modal").modal("hide");
	}, 1200);

	// Change cursor to progress to indicate the time delay
	$(".card").css("cursor", "progress");

	// Reopens the movie modal if actor modal is closed
	$("#actor-modal").on("hide.bs.modal", function () {
		$(".card").css("cursor", "pointer");
		$("#movie-search-modal").modal("show");
	});
}

// --- TO BE COMPLETED ---
// Callback ftn for save movie btn in movie modal
// Saves movie to favourites carousel
function saveMovie(e) {
	console.log(e.parent());
}

// Document Ready Event Handlers
$(function () {
	// Keyup event listener for movie search input field
	$(".movie-input").on("keyup", returnSearchResults);

	// Click event listener for movie search menu dropdown item selection
	$("#search-menu").on("click", goToSearchResult);

	// Click event listener for actor modal (selection via movie modal actor cards)
	$(".card").on("click", actorModalOpen);

	// Click event listener for save movie btn in btn modal
	$("#movie-fav-save-btn").on("click", saveMovie);
});

/* 
--- BUGS ---
1) Dropdown menu toggles while typing
2) Favourites navigation dropdown item BG fixes on focus
3) Movie modal displays cards when data is not successfully retrieved e.g. Attack on Titan 
 */
