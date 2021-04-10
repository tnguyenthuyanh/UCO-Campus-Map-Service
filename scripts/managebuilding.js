"use strict";

//-------------------------------- HANDLE BUILDING DATA --------------------------------//

let buildingName = document.getElementById('BuildNameBox');
let buildingCode = document.getElementById('BuildCodeBox');
let b_latitude = document.getElementById('BLatBox');
let b_longitude = document.getElementById('BLngBox');

let bName = buildingName.value;
let bCode = buildingCode.value;
let bLat = b_latitude.value;
let bLng = b_longitude.value;

function UpdateB(val, type) {
    if (type == 'bname') bName = val;
    else if (type == 'bcode') bCode = val;
    else if (type == 'blat') bLat = val;
    else if (type == 'blng') bLng = val;
}

// Reset value
function Reset_Building_Value() {
    buildingName.value = '';
    buildingCode.value = '';
    b_latitude.value = '';
    b_longitude.value = '';
}

function Reset_Door_Value() {
    d_buildingCode.value = '';
    d_latitude.value = '';
    d_longitude.value = '';
}

//-------------------------------- HANDLE DOOR DATA --------------------------------//

let d_buildingCode = document.getElementById('DBldCodeBox');
let d_latitude = document.getElementById('DLatBox');
let d_longitude = document.getElementById('DLngBox');

let dBldCode = d_buildingCode.value;
let dLat = d_latitude.value;
let dLng = d_longitude.value;

function UpdateD(val, type) {
    if (type == 'dcode') dBldCode = val;
    else if (type == 'dlat') dLat = val;
    else if (type == 'dlng') dLng = val;
}

//-------- Event buttons -----------//

document.getElementById('addBldBtn').onclick = function () {
    // Add_Building_WithAutoID();
    Add_Building_WithID();
    Reset_Building_Value();
}
document.getElementById('retrieveBldBtn').onclick = function () {
    Retrieve_Building();
}
document.getElementById('updateBldBtn').onclick = function () {
    Update_Fields_inDoc();
}
document.getElementById('deleteBldBtn').onclick = function () {
    Delete_Doc();
}

document.getElementById('resetBValueBtn').onclick = function () {
    Reset_Building_Value();
}

document.getElementById('addDoorBtn').onclick = function () {
    Add_Door_WithAutoID();
    Reset_Door_Value();
}

document.getElementById('resetDValueBtn').onclick = function () {
    Reset_Door_Value();
}

