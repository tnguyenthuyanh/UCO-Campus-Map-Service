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
    _updateBuildingBox();
}
getBuildingCodeBox.oninput = function () {
    _updateBuildingBox();
}
getBuildingLatitudeBox.oninput = function () {
    _updateBuildingBox();
}
getBuildingLongitudeBox.oninput = function () {
    _updateBuildingBox();
}
addBuildingButton.onclick = function () {
    _updateBuildingBox();
    _addBuilding(oneBuilding);
}
retrieveBuildingButton.onclick = function () {
    _updateBuildingBox();
    _retrieveBuilding(oneBuilding);
}
updateBuildingButton.onclick = function () {
    _updateBuildingBox();
    _updateBuilding(oneBuilding);
}
deleteBuildingButton.onclick = function () {
    _updateBuildingBox();
    _deleteBuilding(oneBuilding);
}
resetBuildingValueButton.onclick = function () {
    _resetBuildingValue();
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
    _updateDoorBox();
}
getDoorLatitudeBox.oninput = function () {
    _updateDoorBox();
}
getDoorLongitudeBox.oninput = function () {
    _updateDoorBox();
}

addDoorButton.onclick = function () {
    _updateDoorBox();
    _addDoor(oneDoor);
}

resetDoorValueButton.onclick = function () {
    _resetDoorValue();
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
    _updateStairsBox();
}
getStairsLongitudeBox.oninput = function () {
    _updateStairsBox();
}

addStairsButton.onclick = function () {
    _updateStairsBox();
    _addStairs(stairsLocation);
}

resetStairsValueButton.onclick = function () {
    _resetStairsValue();
}


// -------------------------------- Functions -------------------------------------- //

async function _addBuilding(building) {
    if (!validateBuildingCode(building.BuildingCode)) return;
    try {
        await addBuildingWithID(oneBuilding);
        alert("Successfully added building, ID " + building.BuildingCode);
        _resetBuildingValue();
    } catch (e) {
        alert("Adding error: " + e);
    }
}

async function _retrieveBuilding(building) {
    if (!validateBuildingCode(building.BuildingCode)) return;
    try {
        var getBuildingData = await retrieveBuilding(building.BuildingCode);
        getBuildingNameBox.value = getBuildingData.BuildingName;
        getBuildingLatitudeBox.value = getBuildingData.Latitude;
        getBuildingLongitudeBox.value = getBuildingData.Longitude;
    } catch (e) {
        alert("Retrieving error: " + e);
    }
}

async function _updateBuilding(building) {
    if (!validateBuildingCode(building.BuildingCode)) return;
    try {

        await updateBuildingOfDoc(building);
        alert("Successfully updated building, ID " + building.BuildingCode);
    } catch (e) {
        alert("Updating error: " + e);
    }
}
async function _deleteBuilding(building) {
    if (!validateBuildingCode(building.BuildingCode)) return;
    try {
        await deleteBuilding(building.BuildingCode);
        alert("Deleted building, ID " + building.BuildingCode);
        _resetBuildingValue();
    } catch (e) {
        alert("Deleting error: " + e);
    }
}

function _updateBuildingBox() {
    oneBuilding.BuildingName = String(getBuildingNameBox.value);
    oneBuilding.BuildingCode = String(getBuildingCodeBox.value);
    oneBuilding.Latitude = Number(getBuildingLatitudeBox.value);
    oneBuilding.Longitude = Number(getBuildingLongitudeBox.value);
}

function _resetBuildingValue() {
    getBuildingNameBox.value = '';
    getBuildingCodeBox.value = '';
    getBuildingLatitudeBox.value = '';
    getBuildingLongitudeBox.value = '';
    _updateBuildingBox();
}

async function _addDoor(door) {
    if (!validateBuildingCode(door.BuildingCode)) return;
    try {
        await addDoorWithAutoID(door);
        alert("Successfully added one door, ID " + door.BuildingCode);
        _resetDoorValue();
    } catch (e) {
        alert("Adding door error: " + e);
    }
}

function _updateDoorBox() {
    oneDoor.BuildingCode = String(getBuildingCodeOfDoorBox.value);
    oneDoor.Latitude = Number(getDoorLatitudeBox.value);
    oneDoor.Longitude = Number(getDoorLongitudeBox.value);
}

function _resetDoorValue() {
    getBuildingCodeOfDoorBox.value = '';
    getDoorLatitudeBox.value = '';
    getDoorLongitudeBox.value = '';
    _updateDoorBox();
}

async function _addStairs(stairs) {
    if (getStairsLatitudeBox.value == '' || getStairsLongitudeBox == '') {
        alert("Enter both latitude and longitude of the stairs");
        return;
    }
    try {
        await addStairs(stairs);
        alert("Successfully added stairs location!");
        _resetStairsValue();
    } catch (e) {
        alert("Stairs location adding error: " + e);
    }
}

function _updateStairsBox() {
    stairsLocation.Latitude = Number(getStairsLatitudeBox.value);
    stairsLocation.Longitude = Number(getStairsLongitudeBox.value);
}

function _resetStairsValue() {
    getStairsLatitudeBox.value = '';
    getStairsLongitudeBox.value = '';
    _updateStairsBox();
}

function validateBuildingCode(value) {
    if (value.length == 3) {
        return true;
    } else {
        alert("Enter building code");
        return false;
    }
}