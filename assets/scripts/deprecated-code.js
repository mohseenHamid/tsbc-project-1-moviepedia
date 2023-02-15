// --- FUNCTION FOR CELEBNINJA API ---
// function celebNinjaClosure(celebName) {
// 	function celebNinjaInner() {
// 		$.ajax({
// 			method: "GET",
// 			url: "https://api.celebrityninjas.com/v1/search?name=" + celebName,
// 			headers: { "X-Api-Key": "+qZ8SEACFRjRVK2XZ9RpgQ==urpaH1jT1cOiYaJ6" },
// 			contentType: "application/json"
// 		}).then((result) => {
// 			console.log(result[0].name);
// 			console.log(result[0].birthday);
// 			console.log(result[0].net_worth);
// 			console.log(result[0].height);
// 		});
// 	}
// 	return celebNinjaInner;
// }
// // NEED TO SET THE VALUE OF celebNinjaClosure when assigning it
// let celebNinja = celebNinjaClosure("tom hanks");
// celebNinja();

// --- FUNCTION TO STORE API RESPONSE IN OBJECT USING Object.assign(target, source) ---
// Global variable to be updated with API response object
// let actorProfile = {};
// function actorSearch(actor, cardNum) {
// 	$.ajax({
// 		method: "GET",
// 		url: "https://en.wikipedia.org/api/rest_v1/page/summary/" + actor,
// 		contentType: "application/json"
// 	}).then(function (result) {
// 		actorResult = {
// 			actorName: result.title,
// 			thumbnail: result.thumbnail.source,
// 			bio: result.extract
// 		};
// 		Update global variable with API object
// 		Object.assign(actorProfile, actorResult);
