/* *********************************************************************************************** */
/* ********************************** HINT TEXT FOR START SEARCH ********************************* */
/* *********************************************************************************************** */
var searchInpStart = document.querySelector('.search-marker-start');
var suggestPanelStart = document.querySelector('.suggestions-start');
var tempSuggestPanelStart;


searchInpStart.addEventListener('keyup', function () {
    const input = searchInpStart.value.toLowerCase();

    suggestPanelStart.innerHTML = '';

    const suggestions = hintBuildings.filter(function (building) {
        return building.toLowerCase().startsWith(input);
    });

    console.log('suggetions', suggestions);

    suggestions.forEach(function (suggested) {
        var div = document.createElement('div');
        div.innerHTML = suggested;
        suggestPanelStart.appendChild(div);
    });

    if (input == '') {
        suggestPanelStart.innerHTML = '';
    }

    tempSuggestPanelStart = suggestPanelStart;
});

function searchStartOnFocusOut() {
    suggestPanelStart.innerHTML = '';
}

function searchStartOnFocus() {
    const input = searchInpStart.value.toLowerCase();
    const suggestions = hintBuildings.filter(function (building) {
        return building.toLowerCase().startsWith(input);
    });

    suggestions.forEach(function (suggested) {
        var div = document.createElement('div');
        div.innerHTML = suggested;
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

    console.log('suggetions', suggestions);

    suggestions.forEach(function (suggested) {
        var div = document.createElement('div');
        div.innerHTML = suggested;
        suggestPanelEnd.appendChild(div);
    });

    if (input == '') {
        suggestPanelEnd.innerHTML = '';
    }
});

function searchEndOnFocusOut() {
    suggestPanelEnd.innerHTML = '';
}

function searchEndOnFocus() {
    const input = searchInpEnd.value.toLowerCase();
    const suggestions = hintBuildings.filter(function (building) {
        return building.toLowerCase().startsWith(input);
    });

    suggestions.forEach(function (suggested) {
        var div = document.createElement('div');
        div.innerHTML = suggested;
        suggestPanelEnd.appendChild(div);
    });

    if (input == '') {
        suggestPanelEnd.innerHTML = '';
    }
}
/* *********************************************************************************************** */

