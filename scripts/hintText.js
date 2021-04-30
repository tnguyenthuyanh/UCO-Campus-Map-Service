/* *********************************************************************************************** */
/* ********************************** HINT TEXT FOR START SEARCH ********************************* */
/* *********************************************************************************************** */
var searchInpStart = document.querySelector('.search-marker-start');
var suggestPanelStart = document.querySelector('.suggestions-start');
var tempSuggestPanelStart;
var bodyOutOfFocus;

searchInpStart.addEventListener('keyup', function () {
    const INPUT = searchInpStart.value.toLowerCase();

    suggestPanelStart.innerHTML = '';

    const SUGGESTIONS = hintBuildings.filter(function (building) {
        return building.toLowerCase().startsWith(INPUT);
    });

    SUGGESTIONS.forEach(function (suggested) {
        var div = document.createElement('div');
        div.innerHTML = suggested;
        div.setAttribute('class', 'suggestion-start');
        suggestPanelStart.appendChild(div);
    });

    if (INPUT == '') {
        suggestPanelStart.innerHTML = '';
    }

    tempSuggestPanelStart = suggestPanelStart;
});

function searchStartOnFocus() {
    const INPUT = searchInpStart.value.toLowerCase();
    // if we left the body focus and are returning, do not add suggestions again
    if (INPUT != '' && bodyOutOfFocus) {
        bodyOutOfFocus = false;
        return;
    }
    const SUGGESTIONS = hintBuildings.filter(function (building) {
        return building.toLowerCase().startsWith(INPUT);
    });

    SUGGESTIONS.forEach(function (suggested) {
        var div = document.createElement('div');
        div.innerHTML = suggested;
        div.setAttribute('class', 'suggestion-start');
        suggestPanelStart.appendChild(div);
    });

    if (INPUT == '') {
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
    const INPUT = searchInpEnd.value.toLowerCase();

    suggestPanelEnd.innerHTML = '';

    const SUGGESTIONS = hintBuildings.filter(function (building) {
        return building.toLowerCase().startsWith(INPUT);
    });

    var count = 0;
    SUGGESTIONS.forEach(function (suggested) {
        var div = document.createElement('div');
        div.innerHTML = suggested;
        div.setAttribute('class', 'suggestion-end');
        suggestPanelEnd.appendChild(div);
    });

    if (INPUT == '') {
        suggestPanelEnd.innerHTML = '';
    }
});

document.addEventListener('click', function (e) {
    if (e.target.className === 'search-marker-start') {
        suggestPanelEnd.innerHTML = '';
        return;
    } else if (e.target.className === 'search-marker-end') {
        suggestPanelStart.innerHTML = '';
        return;
    } else if (e.target.className === 'suggestion-start') {
        searchInpStart.value = e.target.innerHTML;
        suggestPanelStart.innerHTML = '';
    } else if (e.target.className === 'suggestion-end') {
        searchInpEnd.value = e.target.innerHTML;
        suggestPanelEnd.innerHTML = '';
    } else {
        suggestPanelStart.innerHTML = '';
        suggestPanelEnd.innerHTML = '';
    }
});

function searchEndOnFocus() {
    const INPUT = searchInpEnd.value.toLowerCase();
    // if we left the body focus and are returning, do not add suggestions again
    if (INPUT != '' && bodyOutOfFocus) {
        bodyOutOfFocus = false;
        return;
    }
    const SUGGESTIONS = hintBuildings.filter(function (building) {
        return building.toLowerCase().startsWith(INPUT);
    });

    SUGGESTIONS.forEach(function (suggested) {
        var div = document.createElement('div');
        div.innerHTML = suggested;
        div.setAttribute('class', 'suggestion-end');
        suggestPanelEnd.appendChild(div);
    });

    if (INPUT == '') {
        suggestPanelEnd.innerHTML = '';
    }
}
/* *********************************************************************************************** */

function bodyOnFocus() {
    bodyOutOfFocus = true;
}