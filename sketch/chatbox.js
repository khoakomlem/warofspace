
    var hide=false;
  document.getElementById('showHideChat')
        .addEventListener('click', function(event) {
            if (hide==false) {
                hide=true;
                showChat(false);

            } else {
                hide=false;
                showChat(true);
            }
        });
    // $('body').keypress(function(event){
    //     if (hide==false) {
    //         hide=true;
    //         showChat(false);
    //     } else {
    //         hide=false;
    //         showChat(true);
    //     }
    // })

    document.getElementById('inputMes')
        .addEventListener('change', function(){
            // addMessage($('#name').val()+": "+this.value);
            socket.emit('mess', ($('#name').val() || "[NONAME]")+": "+this.value);
            $('#inputMes').val('');
        })



      function addMessage(mes, from, withTime) {
    var newMes = document.createElement('p');
 
    if (withTime) {
        var timeNode = document.createElement('span');
        timeNode.textContent = (withTime ? (prettyTime(mil / 1000) + "  ") : "");
        newMes.appendChild(timeNode);
    }
 
    if (from) {
        var fromNode = document.createElement('span');
        fromNode.style.fontWeight = 'bold';
        fromNode.textContent = (from ? (from + ": ") : "");
        newMes.appendChild(fromNode);
    }
 
    if (mes) {
        var mesNode = document.createTextNode(mes);
        newMes.appendChild(mesNode);
    }
 
    document.getElementById('conversation').appendChild(newMes);
    newMes.scrollIntoView();
}

function isTyping() {
    return (document.getElementById('inputMes') === document.activeElement);
}
 
function help() {
    addMessage(" - - - - - WAR OF SPACE - - - - - ", '', false)
    addMessage("Run And Fight to Survive", '', false);
    addMessage("A: Shoot / ArrowKey: Move.");
    // addMessage("LEFT-Mouse : Shoot.");
    // addMessage("SCROLL-Mouse, 1->9 : Change weapon.");
    // addMessage("R : Reload.");
    // addMessage("F : Pickup weapon.");
    // addMessage("E : Shield (can't shoot).");
    // addMessage("Q (Hold): look around (minimap).");
    // addMessage("M: Open/close minimap.");
    // addMessage("N: Change music.");
    addMessage("ENTER : Deploy your chat words.");
    // addMessage("C : Show/Hide Chat box.");
    // addMessage("V : FreeCam Mode (on/off).");
    // addMessage("Type '/help' for more option", '', false);
    addMessage("--------------------------------");
}
 
function clearChat(){
    var myNode = document.getElementById('conversation');
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}
 
function showChat(show) {
    if (show) {
        document.getElementById('showHideChat').value = 'Hide';
        document.getElementById('conversation').style.width = "100%";
        document.getElementById('chatBox').style.left = "0px";
    } else {
        document.getElementById('showHideChat').value = 'Show';
        document.getElementById('conversation').style.width = "25%";
        document.getElementById('chatBox').style.left = "-240px";
    }
}
help();
socket.on('message', data=>{
    addMessage(data);
})