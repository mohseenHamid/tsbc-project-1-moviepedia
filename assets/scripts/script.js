var name = 'Eddie Murphy'

$.ajax({
    method: 'GET',
    url: 'https://api.celebrityninjas.com/v1/search?name=' + name,
    headers: { 'X-Api-Key': '+qZ8SEACFRjRVK2XZ9RpgQ==urpaH1jT1cOiYaJ6'},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});
