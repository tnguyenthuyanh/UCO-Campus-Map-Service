/* *********************************************************************************************** */
/* ********************************** HINT TEXT FOR START SEARCH ********************************* */
/* *********************************************************************************************** */
var searchInpStart = document.querySelector('.search-marker-start');
var suggestPanelStart = document.querySelector('.suggestions-start');
var tempSuggestPanelStart;
var bodyOutOfFocus;


searchInpStart.addEventListener('keyup', function () {
    const input = searchInpStart.value.toLowerCase();

    suggestPanelStart.innerHTML = '';

    const suggestions = hintBuildings.filter(function (building) {
        return building.toLowerCase().startsWith(input);
    });

    suggestions.forEach(function (suggested) {
        var div = document.createElement('div');
        div.innerHTML = suggested;
        div.setAttribute('class', 'suggestion-start');
        suggestPanelStart.appendChild(div);
    });

    if (input == '') {
        suggestPanelStart.innerHTML = '';
    }

    tempSuggestPanelStart = suggestPanelStart;
});

function searchStartOnFocus() {
    const input = searchInpStart.value.toLowerCase();
    // if we left the body focus and are returning, do not add suggestions again
    if (input != '' && bodyOutOfFocus){
        bodyOutOfFocus = false;
        return;
    }
    const suggestions = hintBuildings.filter(function (building) {
        return building.toLowerCase().startsWith(input);
    });

    suggestions.forEach(function (suggested) {
        var div = document.createElement('div');
        div.innerHTML = suggested;
        div.setAttribute('class', 'suggestion-start');
        suggestPanelStart.appendChild(div);
    });

    if (input == '') {
        suggestPanelStart.innerHTML = '';
    }
}


/* *********************************************************************************************** */

/* *********************************************************************************************** */
/* ********************************** HINT TEXT FOR END SEARCH ********************************* */
/* *********************************************************************************************** */
var searchInpEnd = document.querySelector('.search-marker-end');
var suggestPanelEnd = document.querySelector('.suggestions-end');


searchInpEnd.addEventListener('keyup', function () {
    const input = searchInpEnd.value.toLowerCase();

    suggestPanelEnd.innerHTML = '';

    const suggestions = hintBuildings.filter(function (building) {
        return building.toLowerCase().startsWith(input);
    });

    var count = 0;
    suggestions.forEach(function (suggested) {
        var div = document.createElement('div');
        div.innerHTML = suggested;
        div.setAttribute('class', 'suggestion-end');
        suggestPanelEnd.appendChild(div);
    });

    if (input == '') {
        suggestPanelEnd.innerHTML = '';
    }
});

document.addEventListener('click', function (e) {
    if (e.target.className === 'search-marker-start') {
        suggestPanelEnd.innerHTML = '';
        return;
    }
    else if (e.target.className === 'search-marker-end') {
        suggestPanelStart.innerHTML = '';
        return;
    }
    else if (e.target.className === 'suggestion-start') {
        console.log(e.target.innerHTML);
        searchInpStart.value = e.target.innerHTML;
        suggestPanelStart.innerHTML = '';
    }
    else if (e.target.className === 'suggestion-end') {
        console.log(e.target.innerHTML);
        searchInpEnd.value = e.target.innerHTML;
        suggestPanelEnd.innerHTML = '';
    }
    else {
        suggestPanelStart.innerHTML = '';
        suggestPanelEnd.innerHTML = '';
    }
});

// function searchEndOnFocusOut() {
//     suggestPanelEnd.innerHTML = '';
// }

function searchEndOnFocus() {
    const input = searchInpEnd.value.toLowerCase();
    // if we left the body focus and are returning, do not add suggestions again
    if (input != '' && bodyOutOfFocus){
        bodyOutOfFocus = false;
        return;
    }
    const suggestions = hintBuildings.filter(function (building) {
        return building.toLowerCase().startsWith(input);
    });

    suggestions.forEach(function (suggested) {
        var div = document.createElement('div');
        div.innerHTML = suggested;
        div.setAttribute('class', 'suggestion-end');
        suggestPanelEnd.appendChild(div);
    });

    if (input == '') {
        suggestPanelEnd.innerHTML = '';
    }
}
/* *********************************************************************************************** */

function bodyOnFocus() {
    bodyOutOfFocus = true;
}