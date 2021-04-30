"use strict";

//-------------------------------- HANDLE BUILDING DATA --------------------------------//

let getBuildingNameBox = document.getElementById('BuildNameBox');
let getBuildingCodeBox = document.getElementById('BuildCodeBox');
let getBuildingLatitudeBox = document.getElementById('BLatBox');
let getBuildingLongitudeBox = document.getElementById('BLngBox');
let addBuildingButton = document.getElementById('addBldBtn');
let retrieveBuildingButton = document.getElementById('retrieveBldBtn');
let updateBuildingButton = document.getElementById('updateBldBtn');
let deleteBuildingButton = document.getElementById('deleteBldBtn');
let resetBuildingValueButton = document.getElementById('resetBValueBtn');

let oneBuilding = {
    BuildingName: '',
    BuildingCode: '',
    Latitude: Number,
    Longitude: Number,
}
getBuildingCodeBox.oninput = function () {
    updateBuildingBox();
}
getBuildingCodeBox.oninput = function () {
    updateBuildingBox();
}
getBuildingLatitudeBox.oninput = function () {
    updateBuildingBox();
}
getBuildingLongitudeBox.oninput = function () {
    updateBuildingBox();
}

addBuildingButton.onclick = async function () {
    if (!validateBuildingCode(oneBuilding.BuildingCode)) return;
    try {
        updateBuildingBox();
        await addBuildingWithID(oneBuilding);
        alert("Successfully added building, ID " + oneBuilding.BuildingCode);
        resetBuildingValue();
    } catch (e) {
        alert("Adding error: " + e);
    }
}
retrieveBuildingButton.onclick = async function () {
    if (!validateBuildingCode(oneBuilding.BuildingCode)) return;
    try {
        var getBuildingData = await retrieveBuilding(oneBuilding.BuildingCode);
        getBuildingNameBox.value = getBuildingData.BuildingName;
        getBuildingLatitudeBox.value = getBuildingData.Latitude;
        getBuildingLongitudeBox.value = getBuildingData.Longitude;
    } catch (e) {
        alert("Retrieving error: " + e);
    }
}

updateBuildingButton.onclick = async function () {
    if (!validateBuildingCode(oneBuilding.BuildingCode)) return;
    try {
        updateBuildingBox();
        await updateBuildingOfDoc(oneBuilding);
        alert("Successfully updated building, ID " + oneBuilding.BuildingCode);
    } catch (e) {
        alert("Updating error: " + e);
    }
}
deleteBuildingButton.onclick = async function () {
    if (!validateBuildingCode(oneBuilding.BuildingCode)) return;
    try {
        await deleteBuilding(oneBuilding.BuildingCode);
        alert("Deleted building, ID " + oneBuilding.BuildingCode);
        resetBuildingValue();
    } catch (e) {
        alert("Deleting error: " + e);
    }

}

resetBuildingValueButton.onclick = function () {
    resetBuildingValue();
}

//-------------------------------- HANDLE DOOR DATA --------------------------------//

let getBuildingCodeOfDoorBox = document.getElementById('DBldCodeBox');
let getDoorLatitudeBox = document.getElementById('DLatBox');
let getDoorLongitudeBox = document.getElementById('DLngBox');
let addDoorButton = document.getElementById('addDoorBtn');
let resetDoorValueButton = document.getElementById('resetDValueBtn');

let oneDoor = {
    BuildingCode: '',
    Latitude: Number,
    Longitude: Number,
}
getBuildingCodeOfDoorBox.oninput = function () {
    updateDoorBox();
}
getDoorLatitudeBox.oninput = function () {
    updateDoorBox();
}
getDoorLongitudeBox.oninput = function () {
    updateDoorBox();
}

addDoorButton.onclick = async function () {
    if (!validateBuildingCode(oneDoor.BuildingCode)) return;
    try {
        updateDoorBox();
        await addDoorWithAutoID(oneDoor);
        alert("Successfully added one door, ID " + oneDoor.BuildingCode);
        resetDoorValue();
    } catch (e) {
        alert("Adding door error: " + e);
    }
}

resetDoorValueButton.onclick = function () {
    resetDoorValue();
}

//-------------------------------- HANDLE STAIRS DATA ------------------------------//

let getStairsLatitudeBox = document.getElementById('SLatBox');
let getStairsLongitudeBox = document.getElementById('SLngBox');
let addStairsButton = document.getElementById('addStairsBtn');
let resetStairsValueButton = document.getElementById('resetSValueBtn');

let stairsLocation = {
    Latitude: Number,
    Longitude: Number,
}
getStairsLatitudeBox.oninput = function () {
    updateStairsBox();
}
getStairsLongitudeBox.oninput = function () {
    updateStairsBox();
}

addStairsButton.onclick = async function () {
    if (getStairsLatitudeBox.value == '' || getStairsLongitudeBox == '') {
        alert("Enter both latitude and longitude of the stairs");
        return;
    }
    try {
        updateStairsBox();
        await addStairs(stairsLocation);
        alert("Successfully added stairs location!");
        resetStairsValue();
    } catch (e) {
        alert("Stairs location adding error: " + e);
    }
}

resetStairsValueButton.onclick = function () {
    resetStairsValue();
}


// -------------------------------- Functions -------------------------------------- //
function updateBuildingBox() {
    oneBuilding.BuildingName = String(getBuildingNameBox.value);
    oneBuilding.BuildingCode = String(getBuildingCodeBox.value);
    oneBuilding.Latitude = Number(getBuildingLatitudeBox.value);
    oneBuilding.Longitude = Number(getBuildingLongitudeBox.value);
}


function updateDoorBox() {
    oneDoor.BuildingCode = String(getBuildingCodeOfDoorBox.value);
    oneDoor.Latitude = Number(getDoorLatitudeBox.value);
    oneDoor.Longitude = Number(getDoorLongitudeBox.value);
}

function updateStairsBox() {
    stairsLocation.Latitude = Number(getStairsLatitudeBox.value);
    stairsLocation.Longitude = Number(getStairsLongitudeBox.value);
}

function resetBuildingValue() {
    getBuildingNameBox.value = '';
    getBuildingCodeBox.value = '';
    getBuildingLatitudeBox.value = '';
    getBuildingLongitudeBox.value = '';
    updateBuildingBox();
}

function resetDoorValue() {
    getBuildingCodeOfDoorBox.value = '';
    getDoorLatitudeBox.value = '';
    getDoorLongitudeBox.value = '';
    updateDoorBox();
}

function resetStairsValue() {
    getStairsLatitudeBox.value = '';
    getStairsLongitudeBox.value = '';
    updateStairsBox();
}

function validateBuildingCode(value) {
    if (value.length == 3) {
        return true;
    } else {
        alert("Enter building code");
        return false;
    }
}