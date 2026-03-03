const field=document.getElementById("field");
const players=[
  document.getElementById("player1"),
  document.getElementById("player2"),
  document.getElementById("player3")
];
const ais=[
  document.getElementById("ai1"),
  document.getElementById("ai2"),
  document.getElementById("ai3")
];
const ball=document.getElementById("ball");
const playerScoreEl=document.getElementById("playerScore");
const aiScoreEl=document.getElementById("aiScore");
const timerEl=document.getElementById("timer");

let playerScore=0,aiScore=0,time=240,timerInterval;
let ballPos={x: field.clientWidth/2, y: field.clientHeight/2};
let ballSpeed={x:3,y:2};

// أسماء اللاعبين على الملعب
players.forEach(p=>{p.innerText=p.dataset.name;});
ais.forEach(a=>{a.innerText=a.dataset.name;});

// بدء الماتش
function startMatch(){
    clearInterval(timerInterval);
    time=240;
    timerInterval=setInterval(()=>{
        if(time>0){
            time--;
            let m=Math.floor(time/60);
            let s=time%60;
            timerEl.innerText=`${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
        }else{
            clearInterval(timerInterval);
            alert(`انتهى الوقت! النتيجة: 🔴 ${playerScore} - 🔵 ${aiScore}`);
        }
    },1000);
    requestAnimationFrame(update);
}

// تحديث اللعبة
function update(){
    ballPos.x+=ballSpeed.x;
    ballPos.y+=ballSpeed.y;
    if(ballPos.y<=0||ballPos.y>=field.clientHeight-ball.offsetHeight) ballSpeed.y*=-1;

    let ballRect=ball.getBoundingClientRect();

    players.forEach(p=>{if(checkCollision(ballRect,p.getBoundingClientRect())) ballSpeed.x=Math.abs(ballSpeed.x);});
    ais.forEach(a=>{if(checkCollision(ballRect,a.getBoundingClientRect())) ballSpeed.x=-Math.abs(ballSpeed.x);});

    ais.forEach(ai=>{
        let aiC=ai.offsetTop+ai.offsetHeight/2;
        let ballC=ballPos.y+ball.offsetHeight/2;
        if(aiC<ballC) ai.style.top=Math.min(ai.offsetTop+2,field.clientHeight-ai.offsetHeight)+"px";
        else ai.style.top=Math.max(ai.offsetTop-2,0)+"px";
    });

    ball.style.left=ballPos.x+"px";
    ball.style.top=ballPos.y+"px";

    if(ballPos.x<=0){playerScore++;playerScoreEl.innerText=playerScore;resetBall();}
    if(ballPos.x>=field.clientWidth-ball.offsetWidth){aiScore++;aiScoreEl.innerText=aiScore;resetBall();}

    requestAnimationFrame(update);
}

// إعادة الكرة
function resetBall(){
    ballPos.x=field.clientWidth/2;
    ballPos.y=field.clientHeight/2;
    ballSpeed.x*=-1;
    ballSpeed.y=2*(Math.random()>0.5?1:-1);
}

// تصادم
function checkCollision(a,b){
    return !(a.right<b.left||a.left>b.right||a.bottom<b.top||a.top>b.bottom);
}

// تحريك اللاعب الأول بالكمبيوتر
let keys={};
document.addEventListener("keydown",(e)=>{keys[e.key]=true; movePlayer();});
document.addEventListener("keyup",(e)=>{keys[e.key]=false;});
function movePlayer(){
    let x=players[0].offsetLeft,y=players[0].offsetTop;
    if(keys["ArrowUp"]) y=Math.max(y-5,0);
    if(keys["ArrowDown"]) y=Math.min(y+5,field.clientHeight-players[0].offsetHeight);
    if(keys["ArrowLeft"]) x=Math.max(x-5,0);
    if(keys["ArrowRight"]) x=Math.min(x+5,field.clientWidth/2-players[0].offsetWidth);
    players[0].style.left=x+"px";
    players[0].style.top=y+"px";
}

// تحريك اللاعب الأول باللمس
let touchStart={x:0,y:0};
players[0].addEventListener("touchstart",(e)=>{touchStart.x=e.touches[0].clientX; touchStart.y=e.touches[0].clientY;});
players[0].addEventListener("touchmove",(e)=>{
    e.preventDefault();
    let dx=e.touches[0].clientX-touchStart.x;
    let dy=e.touches[0].clientY-touchStart.y;
    let newX=Math.min(Math.max(players[0].offsetLeft+dx,0),field.clientWidth/2-players[0].offsetWidth);
    let newY=Math.min(Math.max(players[0].offsetTop+dy,0),field.clientHeight-players[0].offsetHeight);
    players[0].style.left=newX+"px";
    players[0].style.top=newY+"px";
    touchStart.x=e.touches[0].clientX;
    touchStart.y=e.touches[0].clientY;
});

// إعادة كل شيء
function resetGame(){
    playerScore=0;aiScore=0;
    playerScoreEl.innerText=playerScore;
    aiScoreEl.innerText=aiScore;
    resetBall();
    players[0].style.left="50px"; players[0].style.top="50px";
    players[1].style.left="120px"; players[1].style.top="50px";
    players[2].style.left="50px"; players[2].style.top="120px";
    ais[0].style.left=(field.clientWidth-90)+"px"; ais[0].style.top="50px";
    ais[1].style.left=(field.clientWidth-150)+"px"; ais[1].style.top="50px";
    ais[2].style.left=(field.clientWidth-90)+"px"; ais[2].style.top="120px";
}
