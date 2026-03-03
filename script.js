function setPosition(btn){
    const select = btn.previousElementSibling;
    const playerName = select.dataset.player;
    const position = select.value;

    const field = document.getElementById("field");
    
    // حذف أي أيقونة قديمة
    const old = document.getElementById(playerName);
    if(old) field.removeChild(old);

    const div = document.createElement("div");
    div.className = "player-icon";
    div.id = playerName;
    div.innerText = playerName;

    // تحديد المكان بناء على المركز
    switch(position){
        case "GK": div.style.top="320px"; div.style.left="280px"; break;
        case "DF": div.style.top="220px"; div.style.left="280px"; break;
        case "MF": div.style.top="120px"; div.style.left="280px"; break;
        case "FW": div.style.top="20px"; div.style.left="280px"; break;
    }

    field.appendChild(div);
}
