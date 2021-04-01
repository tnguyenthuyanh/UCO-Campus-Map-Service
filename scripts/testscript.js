
function revealMessage() {
    document.getElementById("hiddenmessage").style.display = 'block'; // reveals hidden text
}

function countUp() {
    var counter = parseInt(document.getElementById("countupbutton").innerHTML);
    if (counter % 10 == 0)
        counter = 0;
    document.getElementById("countupbutton").innerHTML = ++counter;
}