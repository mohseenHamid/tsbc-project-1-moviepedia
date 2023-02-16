// OMDB API Key
const omdbKey = "e2bf0e18";

// Ftn to populate the movie search menu dropdown using data retrieved from OMDB API
// Called in the movie search callback ftn "returnSearchResults"
function searchMovieTitles(searchString) {
	const queryURL =
		"https://www.omdbapi.com/?apikey=" + omdbKey + "&s=" + searchString + "*";
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
		"https://www.omdbapi.com/?apikey=" +
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

		// Set movie modal attributes to be used later for localStorage
		$("#movie-search-modal").attr("data-movie-title", movieTitle);
		$("#movie-search-modal").attr("data-movie-year", movieYear);
		$("#movie-search-modal").attr("data-movie-img", posterURL);
		$("#movie-search-modal").attr("data-movie-actors", response.Actors);
	});

	// Allows the content to update before opening
	setTimeout(() => {
		// Display movie modal upon completion
		$("#movie-search-modal").modal("show");
	}, 800);

	// // Reopens the movie modal if actor modal is closed
	// $(".actor-search-modal").on("hide.bs.modal", function () {
	// 	$("#movie-search-modal").modal("show");
	// });
	// Reopens the movie modal if actor modal is closed
	$(".actor-search-modal").on("hide.bs.modal", function () {
		$("#movie-search-modal").modal("show");
	});
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
		headers: { "X-Api-Key": "ONBqt7wwcm4Bk28sesSoWjNz95nU0s6bqNFeoP7v" },
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
		let actorName = result.title;
		let actorBio = result.extract;

		$(".actor-modal-img").attr("src", actorImg);
		$(".name").text(actorName);
		$(".more-info").text(actorBio);

		// Set actor modal attributes to be used later for localStorage
		$("#actor-modal").attr("data-actor-name", actorName);
		$("#actor-modal").attr("data-actor-img", actorImg);
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

	setTimeout(() => {
		$(".card").css("cursor", "pointer");
	}, 1200);
}

function renderFavMovies() {
	// Avoid duplication
	$("#movie-favourites").empty();

	// Initialise array to store movie objects (properties = title, year, img) which will be pushed to localStorage)
	let savedMoviesArray = [];

	// Checking if localStorage is populated and retrieve data if so
	if (localStorage.getItem("savedMovies") !== null) {
		savedMoviesArray = JSON.parse(localStorage.getItem("savedMovies"));
	}

	savedMoviesArray.forEach((movie) => {
		const titleHead = $("<figcaption>");
		titleHead.text(`${movie.title} (${movie.year})`);
		titleHead.addClass("fav-movie-title");

		const imgTag = $("<img>");
		imgTag.attr("src", movie.img);
		imgTag.addClass("favImg");
		imgTag.css("cursor", "pointer");
		const imgDiv = $("<div>");
		imgDiv.append(imgTag);

		const movieDiv = $("<figure>");
		movieDiv.addClass("favourites-tile");
		movieDiv.attr("data-movie-title", movie.title);
		movieDiv.attr("data-movie-year", movie.year);
		movieDiv.attr("data-movie-img", movie.img);
		movieDiv.append(titleHead);
		// movieDiv.prepend(imgTag);
		movieDiv.prepend(imgDiv);
		movieDiv.on("click", ".favImg", function () {
			getMovieDetails(movie.title, movie.year);
		});

		$("#movie-favourites").append(movieDiv);
	});
}
renderFavMovies();

// Callback ftn for save movie btn in movie modal
// Saves movie to favourites carousel
function saveMovie(e) {
	e.preventDefault();

	// --- Step 1: Save favourite movie data to localStorage ---
	// Extract movie data from the movie-search-modal attributes for storage
	const movieTitle = $("#movie-search-modal").attr("data-movie-title");
	const movieYear = $("#movie-search-modal").attr("data-movie-year");
	const movieImg = $("#movie-search-modal").attr("data-movie-img");

	// Initialise array to store movie objects (properties = title, year, img) which will be pushed to localStorage)
	let savedMoviesArray = [];

	// Checking if localStorage is populated and retrieve data if so
	if (localStorage.getItem("savedMovies") !== null) {
		savedMoviesArray = JSON.parse(localStorage.getItem("savedMovies"));
	}

	// Assign movie data to object
	let favMovie = {
		title: movieTitle,
		year: movieYear,
		img: movieImg
	};

	// Push movie object to savedMoviesArray only if it doesn't exist
	let searchTest = savedMoviesArray.find((movie) => movie.title == movieTitle);

	if (!searchTest) {
		savedMoviesArray.push(favMovie);

		// Store updated savedMoviesArray as string
		localStorage.setItem("savedMovies", JSON.stringify(savedMoviesArray));
	} else {
		return;
	}

	// --- Step 2: Render favourite movies section with localStorage data ---
	renderFavMovies();
}

function renderFavActors() {
	// Empty array first to avoid duplication in the div
	$("#actor-favourites").empty();

	// Initialise array to store actor objects (properties = title, year, img) which will be pushed to localStorage)
	let savedActorsArray = [];

	// Checking if localStorage is populated and retrieve data if so
	if (localStorage.getItem("savedActors") !== null) {
		savedActorsArray = JSON.parse(localStorage.getItem("savedActors"));
	}

	savedActorsArray.forEach((actor) => {
		const titleHead = $("<figcaption>");
		titleHead.text(`${actor.name}`);

		const imgTag = $("<img>");
		imgTag.attr("src", actor.img);
		imgTag.addClass("favImg");
		imgTag.attr("data-actor-name", actor.name);

		imgTag.css("cursor", "pointer");
		const imgDiv = $("<div>");
		imgDiv.append(imgTag);

		const actorDiv = $("<figure>");
		actorDiv.addClass("favourites-tile");
		actorDiv.attr("data-actor-name", actor.name);
		actorDiv.attr("data-actor-img", actor.img);
		actorDiv.append(titleHead);
		actorDiv.prepend(imgDiv);
		actorDiv.on("click", ".favImg", actorModalOpen);

		$("#actor-favourites").append(actorDiv);
	});
}
renderFavActors();

// Callback ftn for save actor btn in actor modal
// Saves actor to favourites carousel
function saveActor(e) {
	e.preventDefault();

	// --- Step 1: Save favourite actor data to localStorage ---
	// Extract actor data from the actor-modal attributes for storage
	const actorName = $("#actor-modal").attr("data-actor-name");
	const actorImg = $("#actor-modal").attr("data-actor-img");

	// Initialise array to store actor objects (properties = title, year, img) which will be pushed to localStorage)
	let savedActorsArray = [];

	// Checking if localStorage is populated and retrieve data if so
	if (localStorage.getItem("savedActors") !== null) {
		savedActorsArray = JSON.parse(localStorage.getItem("savedActors"));
	}

	// Assign actor data to object
	let favActor = {
		name: actorName,
		img: actorImg
	};

	// Push actor object to savedActorsArray only if it doesn't exist
	let searchTest = savedActorsArray.find((actor) => actor.name == actorName);

	if (!searchTest) {
		savedActorsArray.push(favActor);

		// Store updated savedActorsArray as string
		localStorage.setItem("savedActors", JSON.stringify(savedActorsArray));
	} else {
		return;
	}

	// --- Step 2: Render favourite actors section with localStorage data ---
	renderFavActors();
}

// Event handler for closing the actor modal
function closeActorModal(e) {
	// Extracts text from one of the movie modal elements
	let testText = $(".c2-r1-c1").text();

	// Extract the actors as a string from the movie modal data attribute
	let actorsString = $("#movie-search-modal").attr("data-movie-actors");

	// initial conditional to test if the movie modal is empty via actorsString and testText -> if not empty, then proceed
	if (testText !== "placeholder" && typeof actorsString !== undefined) {
		// Assign actorName using data attribute of actor modal
		let actorName = $(".actor-search-modal").attr("data-actor-name");

		// Conditional to check if the actor in the actor modal is present in the actor list of the movie modal
		if (actorsString.match(actorName)) {
			// If the actor in the actor modal is in the actor list of the movie modal film, then open the movie modal upon closing the actor modal
			$("#movie-search-modal").modal("show");
		}
	}
}

// Document Ready Event Handlers
$(function () {
	// Keyup event listener for movie search input field
	$(".movie-input").on("keyup", returnSearchResults);

	// Click event listener for movie search menu dropdown item selection
	$("#search-menu").on("click", goToSearchResult);

	// Click event listener for actor modal (selection via movie modal actor cards)
	$(".actor-card").on("click", actorModalOpen);

	// IS THIS EVENT DELEGATION CORRECT? I WANT THE TARGET TO BE THE MODAL
	// Click event listener for save movie btn in movie modal
	$("#movie-search-modal").on("click", "#movie-fav-save-btn", saveMovie);

	// Click event listener for save actor btn in actor modal
	$("#actor-modal").on("click", "#actor-fav-save-btn", saveActor);

	// Event listener for closing the actor modal
	$(".actor-search-modal").on("hide.bs.modal", closeActorModal);

	// --- CLEAR LOCALSTORAGE ---
	// Clear favourite movies
	$("#clear-saved-movies-btn").on("click", function (e) {
		e.preventDefault();

		localStorage.removeItem("savedMovies");

		$("#movie-favourites").empty();
	});

	// Clear favourite actors
	$("#clear-saved-actors-btn").on("click", function (e) {
		e.preventDefault();

		localStorage.removeItem("savedActors");

		$("#actor-favourites").empty();
	});
});

/* 
--- BUGS ---
1) Dropdown menu toggles while typing
2) Movie modal displays cards when data is not successfully retrieved e.g. Attack on Titan 
3) celebNinja API error
4) BG scrolls while on the movie modal
 */
