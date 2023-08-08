var board = [];
var rows = 8;
var columns = 8;

var minesCount = 8;
var minesLocation = []; // "2-2", "3-4", "2-1"

var tilesClicked = 0; // goal to click all tiles except the ones containing mines
var flagEnabled = false;
var cheatEnabled = false;

var gameOver = false;

var reset = false;

window.onload = function() {
    startGame(); // this function is called on load of webpage due to window.onload.
}

function setMines() {

    let minesLeft = minesCount;

    while(minesLeft > 0) {
        let r = Math.floor(Math.random()*rows);
        let c = Math.floor(Math.random()*columns);
        let id = r.toString() + "-" + c.toString();

        if(!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft-=1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount; // changes the text in the element 'mines-count' to minesCount
    document.getElementById("flag-button").addEventListener("click", setFlag); // if the flag button is clicked, call setFlag function
    document.getElementById("reset-button").addEventListener("click", resetGame);
    document.getElementById("cheat-button").addEventListener("click", cheatButton);
    setMines();

    
    for(let r = 0; r < rows; r++) {
        let row = [];
        for(let c = 0; c < columns; c++) {
            let tile = document.createElement("div"); // literally creates a div 
            tile.id = r.toString() + "-" + c.toString(); // sets the id of the div to the string 'rowNumber-columnNumber'
            tile.addEventListener("click", clickTile); // when tile is clicked, call clickTile function
            if(!reset)
            document.getElementById("board").append(tile); // add tile to the board
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

function resetGame() {
    minesLocation = [];
    gameOver = false;
    flagEnabled = false;
    cheatEnabled = false;
    tilesClicked = 0;
    console.log("HELP");
    resetTilesAndFlags();
}

function resetTilesAndFlags() {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            board[r][c].style.backgroundColor = "lightgrey";
            while(board[r][c].classList.length > 0) {
                board[r][c].classList.remove(board[r][c].classList.item(0));
            }
            board[r][c].innerText = "";
            console.log("worked");
        }
    }
    reset = true;
    startGame();
}

function setFlag() {
    if(cheatEnabled)
    cheatEnabled = false;

    if(flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    } else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if(gameOver || this.classList.contains("tile-clicked")) {
        return;
    }
    let tile = this; // 'this' is the tile.id that was clicked and triggered this function
    if(flagEnabled) {

        if(tile.innerText == "") {
            tile.innerText = "🚩"
        } else if(tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }
    
    if(cheatEnabled) {
        if(!minesLocation.includes(tile.id))
        return;

        if(tile.innerText == "") {
            tile.innerText = "🥵"
        } else if(tile.innerText == "🥵") {
            tile.innerText = "";
        }
        console.log("returned");
        return;
    }

    if(minesLocation.includes(tile.id)) {
        // alert("GAME OVER");
        gameOver = true;
        revealMines();
        return;
    } 

    let coords = tile.id.split("-"); // "0-0" =-> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    console.log("mine checked");
    checkMine(r, c);
}

function revealMines() {
    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if(minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";

            }
        }
    }
}

function checkMine(r, c) {
    if(r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }

    if(board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    board[r][c].style.backgroundColor = "darkgrey";
    console.log("clicked tile in checkMine");
    tilesClicked += 1;
    let minesFound = 0; 
    
    // top 3
    minesFound += checkTile(r-1, c-1); // top left
    minesFound += checkTile(r-1, c); // top middle
    minesFound += checkTile(r-1, c+1); // top right

    // left and right
    minesFound += checkTile(r, c-1); // left
    minesFound += checkTile(r, c+1); // right

    // bottom 3
    minesFound += checkTile(r+1, c-1); // bottom left
    minesFound += checkTile(r+1, c); // bottom middle
    minesFound += checkTile(r+1, c+1); // bottom right

    if(minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }  else {
        // top 3
        checkMine(r-1, c-1); // top left
        checkMine(r-1, c); // top middle
        checkMine(r-1, c+1); // top right
        
        // left and right
        checkMine(r, c-1); // left
        checkMine(r, c+1); // right

        // bottom 3
        checkMine(r+1, c-1); // bottom left
        checkMine(r+1, c); // bottom middle
        checkMine(r+1, c+1); // bottom right
    }

    if(tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}

function checkTile(r, c) {
    if(r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }

    if(minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }

    return 0;
}

function cheatButton() {
    if(cheatEnabled) {
        cheatEnabled = false;
        document.getElementById("cheat-button").style.backgroundColor = "lightgray";
    }
    else {
        cheatEnabled = true;
        document.getElementById("cheat-button").style.backgroundColor = "darkgray";
    }
}