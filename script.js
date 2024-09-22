console.log("Welcome to Tic Tac Toe :");
console.warn("Developed by Harsh Yadav");

const ting = new Audio('ting.mp3');
ting.preload = 'auto';

let turn = 'X';
let gameOver = false;

// const onClick = ()=>{
//     document.getElementsByClassName("box").querySelector(".boxtext").innerText="";
// }
// to change the win
const changeTurn = () => {
    return turn === 'X' ? '0' : 'X';
}
const player1 = prompt("Player 1 enter your name : ");
const choice_player1 = confirm(`${player1} play with X`)
const player2 = prompt("Player 2 enter your name : ");
const choice_player2 = confirm(`${player2} play with 0`)
// to check the winner
const checkWin = () => {
    let boxtexts = document.getElementsByClassName('boxtext');
    let wins = [
        [0, 1, 2, 1.5, 5, 0],
        [3, 4, 5, 1.5, 15, 0],
        [6, 7, 8, 1.5, 25, 0],
        [0, 3, 6, -8.5, 15, 90],
        [1, 4, 7, 1.5, 15, 90],
        [2, 5, 8, 11.5, 15, 90],
        [0, 4, 8, 1.5, 15, 45],
        [2, 4, 6,1.5,15,135],
    ]
    wins.forEach(e => {
        if ((boxtexts[e[0]].innerText === boxtexts[e[1]].innerText) && (boxtexts[e[2]].innerText === boxtexts[e[1]].innerText) && (boxtexts[e[0]].innerText !== "")) {
            let win = document.querySelector('.info').innerText;
            document.getElementsByClassName('info')[0].innerText = boxtexts[e[0]].innerText + " WON";
            gameOver = true;
            document.querySelector('.imgbox').getElementsByTagName("img")[0].style.width = "150px";
            document.querySelector(".line").style.width = '27vw';
            document.querySelector('.line').style.transform = `translate(${e[3]}vw,${e[4]}vw) rotate(${e[5]}deg)`;
            console.log(boxtexts[e[0]].innerText + " Won the match");

            // alert(boxtexts[e[0]].innerText + " won the match");
            // alert("Before playing reset the previous game.");
            if(boxtexts[e[0]].innerText == 'X'){
                alert(`${player1} won the match`);
            }else{
                alert(`${player2} won the match`);
            }
            return true;
        }
    })
    return false;
}

// Game Logic

let boxes = document.getElementsByClassName('box');
Array.from(boxes).forEach(element => {
    let boxtext = element.querySelector('.boxtext');
    element.addEventListener('click', (e) => {
        ting.currentTime = 0;
        ting.play();
        if (boxtext.innerText === '') {
            boxtext.innerText = turn;
            turn = changeTurn();
            // checkWin();
            checkWin();
            if (!gameOver) {
            document.getElementsByClassName('info')[0].innerText = `Turn for ${turn}`;
            }
        }
    })
})

// for reset button

reset.addEventListener('click', () => {
    let boxtexts = document.querySelectorAll(".boxtext");
    Array.from(boxtexts).forEach(element => {
        element.innerText = ""
    });
    gameOver = false;
    document.querySelector(".line").style.width = '0';
    document.getElementsByClassName("info")[0].innerText = "Turn for X";
    document.querySelector('.imgbox').getElementsByTagName("img")[0].style.width = '0px';
})