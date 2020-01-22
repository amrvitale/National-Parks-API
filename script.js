'use strict';
const apiKey ='6bSvG3mwPeQibtn0ralAKEARh44SZUhyFwXJgA1V';
const searchURL = 'https://developer.nps.gov/api/v1/parks/';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }
  
function displayResults(responseJson) {
    console.log(responseJson);
    $('#searchResults').empty();

    for (let i = 0; i < responseJson.data.length; i++) {
        $('#searchResults').append(
          `<li><h3>${responseJson.data[i].fullName}</h3>
          <p>${responseJson.data[i].description}</p>
          <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
          </li>`
        )}
    
    $('#results').removeClass('hidden');
};

//call the API
function listParks(query,maxResults=10) {
    const params = {
        api_key: apiKey,
        stateCode: query,
        limit: maxResults,     
    };

  const queryString = formatQueryParams(params)
  const srchUrl = searchURL + '?' + queryString;
  
  console.log(srchUrl);
  
  var url = `https://api.nps.gov/api/v1/parks?stateCode=${query}&limit=${maxResults}&api_key=${apiKey}`
  
    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      if (responseJson.total =="0") {
         $('#js-error-message').text(`Sorry, parks not found. Please try searching again.`);
      }
        else {displayResults(responseJson)};
        })

    .catch(err => {
      $('#js-error-message').text(`Something went wrong. Please try again. ${err.message}`);
    });
}


function watchSubmitForm() {
    $('form').submit(event => {
        event.preventDefault();
        let userState = $('#stateSearch').val();
        let numResults = $('#maxResults').val();
        listParks(userState, numResults);
    });
}

$(watchSubmitForm);