//------------------------------------------------------------------------------------------------------------------------
// THE FOLLOWING FUNCTION APPLY TO MATRIX AND POSITION OF THE PIECES
//------------------------------------------------------------------------------------------------------------------------
definePieces();
var p2, p4, p8, p16, p32, p64, p128;
var pieceAmountCount = 0;


var matrixHTML = document.getElementById("matrix-container");
var matrixArray = [];
for (var i = 0; i < 4; i++){ //Row
    matrixArray[i] = []
    for (var j = 0; j < 4; j++){ //Column
        matrixArray[i][j] = [];
        div = document.createElement("div");
        div.setAttribute("id", "pos" + i + j);
        matrixHTML.appendChild(div);
    }
}  

//called when page loads. Starts an instance of the game by creating the playing field,
// and adding 2 val2 pieces to random positions.
function createField(){
    
    // setPiece(2);
    // setPiece(2);
    setPieceDebug(0,0,2);
    // setPieceDebug(0,1,4);
    // setPieceDebug(0,2,2);
    // setPieceDebug(0,3,4);

    // setPieceDebug(1,0,2);
    // setPieceDebug(1,1,2);
    // setPieceDebug(1,2,4);
    // setPieceDebug(1,3,2);

    setPieceDebug(2,0,2);
    // setPieceDebug(2,1,4);
    // setPieceDebug(2,2,2);
    // setPieceDebug(2,3,4);

    setPieceDebug(3,0,2);
    // setPieceDebug(3,1,2);
    // setPieceDebug(3,2,4);
    // setPieceDebug(3,3,2);
}

function getRandPos(){ 
    var row = Math.floor(Math.random() * (4));
    var col = Math.floor(Math.random() * (4));
    return returnPos(row, col);
}

function setPieceDebug(pos1, pos2, val){
    var position = document.getElementById("pos" + pos1 + pos2)
    var piece = document.createElement("div");
    createPiece(piece, val);
    matrixArray[pos1][pos2] = piece;
    position.appendChild(piece);
    animate(piece);
    pieceAmountCount++;
}

function setPiece(determinedPiece){
    var unavailablePos = checkAvailable();  
    var randPos = getRandPos();

    //Checks if the random cords are already in use by a div.
    try {
        for (var i = 0; i < unavailablePos.length; i ++){ 
            var randStr = randPos.row + "," + randPos.col;
            var posStr = unavailablePos[i].row + "," + unavailablePos[i].col;
            if (randStr == posStr){
                setPiece();
                return;
            }
        }
    } catch (err){
        alert("Gameover");
        location.reload();
    }

    //Decides wether the piece will be of value 2 or 4.
    var randPieceType = Math.floor(Math.random()*2);
    if (determinedPiece !== undefined){
        var pieceType = determinedPiece;
    } else {
        if (randPieceType == 1){
            var pieceType = 2;
        } else {
            var pieceType = 4;
        }
    }

    var position = document.getElementById("pos" + randPos.row + randPos.col)
    var piece = document.createElement("div");
    createPiece(piece, pieceType);
    matrixArray[randPos.row][randPos.col] = piece;
    position.appendChild(piece);

    animate(piece);    
    pieceAmountCount++;
}

function animate(p){
    var top = 65;
    var left = 65;
    var width = 0;
    var height = 0;
    var id = setInterval(frame, 2);

    function frame(){
        if (width >= 130 && height >= 130){ //stops the animation and sets the values to a good value.
            clearInterval(id);
            p.style.fontSize = 86 + "px";
            p.style.width = 130 + "px";
            p.style.height = 130 + "px";
            p.style.top = 0 + "px";
            p.style.left = 0 + "px";
        } else {
            top -=2;
            left -=2;
            width +=4;
            height +=4;
            p.style.width = width + "px";
            p.style.height = height + "px";
            p.style.top = top + "px";
            p.style.left = left + "px";
        }
    }
}

function checkAvailable(){
    var unavailablePosArr = [];
    var matrix = [];
    for (var i = 0; i < 4; i++){ //Rows
          matrix[i] = [];
        for (var j = 0; j < 4; j++){ //Colls
            if (document.getElementById("pos" + i + j).childElementCount >= 1){
                matrix[i][j] = returnPos(i, j);
                unavailablePosArr.push(matrix[i][j]);
            }
        }
    }
    ;
    // if (unavailablePosArr.length >= 16){
    //     alert("Game over, total score: -20");
    //     return;
    // }
    return unavailablePosArr;
}

function returnPos(row, col){
    return {
        row: row,
        col: col
    };
}

//pieces
function createPiece(div, piece){
    if (piece == 2){
        var newPiece = piece2;
    } else if (piece == 4){
        var newPiece = piece4;
    } else if (piece == 8){
        var newPiece = piece8;
    } else if (piece == 16){
        var newPiece = piece16;
    } else if (piece == 32){
        var newPiece = piece32;
    } else if (piece == 64){
        var newPiece = piece64;
    } else if (piece == 128){
        var newPiece = piece128;
    }
    
    div.setAttribute("id", newPiece.id());
    div.setAttribute("class", newPiece.class);
    div.setAttribute("value", newPiece.val);
    div.style.background = newPiece.background;
    div.style.color = newPiece.color;
    div.innerText = newPiece.text
};


//------------------------------------------------------------------------------------------------------------------------
// THE FOLLOWING FUNCTION APPLY TO THE MOVEMENT OF THE PIECES
//------------------------------------------------------------------------------------------------------------------------



window.addEventListener("keydown", function(e){
    switch(e.keyCode){
        case 37: case 39: case 38: case 40: case 32: e.preventDefault(); break;
        default: break;
    }
});

function keyPressed(unicode){
    // console.log(unicode);
    //Using the arrow keys to move, therefore assining the matching unicodes to the methods.  
    switch(unicode){
        case 37: //Unicode for left arrow key
            moveLeft();
            break;
        case 39: //Unicode for right arrow key
            moveRight();
            break;
        case 38: //Unicode for up arrow key
            moveUp();
            break;
        case 40: //Unicode for down arrow key
            moveDown();
            break;
        default:
            return;
    }
    setPiece();
}


function moveDown(){
    var takenPositions = checkAvailable();
    for (var i = 0; i < 4; i++){
        var colTaken = [];
        var colEmpty = [];
        for (var j = 0; j < 4; j++){
            // console.log(matrixArray[i][j] + "[" + i + "][" + j + "]");
            if (matrixArray[j][i].childElementCount !==  undefined){
                colTaken.push(j); //pushes the row(s) at which there is a piece to the col its in.
            } else {
                colEmpty.push(j);
            }

        }
        if (colEmpty.length == 0){ //
            colEmpty.push(0);
        }
        lowestCol = colEmpty.slice(-1);
        if (colTaken.length != 0){
            colTaken = colTaken.sort().reverse();
            colEmpty = colEmpty.sort();
            for (var x = 0; x <= colTaken.length; x++){ //For each piece in a colomn, move it to it's last available position.
                if (parseInt(colTaken.slice(x,x+2)) > parseInt(colEmpty.slice(-1)) && colTaken.length -x >= 2){ //CHANGE to x,x+1
                    //Sif the highest val in colTaken > highest val in colEmpty: && and atleast 2 pieces in colTaken
                    //This method takes the lowest piece out of the colomn and if it allows for it, collides it with the next highest.

                    var colTemp1 = document.getElementById("pos" + colTaken.slice(x,x+1) + i); //The current lowest piece
                    var colTempVal1 = parseInt(colTemp1.childNodes.item(0).getAttribute("value")); 
                    //returns either two or four, for now.

                    var colTemp2 = document.getElementById("pos" + colTaken.slice(x+1,x+2) + i); //The next piece up.
                    var colTempVal2 = parseInt(colTemp2.childNodes.item(0).getAttribute("value"));
                     //returns either two or four, for now.
                    if (colTempVal1 == colTempVal2){
                        collide(colTempVal1, colTemp1);
                        document.getElementById("pos" + colTaken.slice(x+1,x+2) + i).childNodes.item(0).remove(); 
                        matrixArray[colTaken.slice(x+1,x+2)][i] = [];
                        //The position at which colTemp1 took the piece that has collided with the piece below it. 
                        colEmpty.push(parseInt(colTaken.splice(x+1,1)));
                        // colTaken.
                    }
                   
                } else if (parseInt(colTaken.slice(x,x+1)) < parseInt(colEmpty.slice(-1))){
                    movePiece(colTaken.slice(x,x+1), i, colEmpty.slice(-1));
                    colEmpty.push(parseInt(colTaken.splice(x,1)));
                    
                }
            }
        }
        
    }
}


function movePiece(iniX, iniY, nPos){
    var pieceOldPos = document.getElementById("pos" + iniX.toString() + iniY.toString());
    var pieceNewPos;
    
    //get child nodes of new position
    //If has child with the same value as the child trying to move there, add them up and place in new pos.
    var lowestPossible = lowestCol;
    var possiblePos = document.getElementById("pos" + (lowestPossible.toString()) + (iniY.toString()));
    // console.log(lowestPossible );//newPos.children.length); //.item("class").getAttribute("class"));
    if (possiblePos.childNodes.item(0) !== null){
        console.log("New position already has a piece")
        var oldPieceClass = pieceOldPos.childNodes.item(0).getAttribute("value");
        var newPieceClass = possiblePos.childNodes.item(0).getAttribute("value");
        if (newPieceClass == oldPieceClass) {
            console.log("same val");
            var tempDiv = document.createElement("div");
            createPiece(tempDiv, parseInt(newPieceClass) + parseInt(oldPieceClass));
            pieceNewPos = document.getElementById("pos" + nPos + iniY).appendChild(tempDiv);
            // possiblePos.childNodes.item(0).remove();
            pieceOldPos.childNodes.item(0).remove();
            
        } else {
            console.log("Not same type");
        }
    } else {
         animate(pieceNewPos = document.getElementById("pos" + nPos.toString() + iniY.toString())
         .appendChild(pieceOldPos.childNodes.item(0)));  
    }
    matrixArray[iniX.toString()][iniY.toString()] = [];
    matrixArray[nPos.toString()][iniY.toString()] = pieceNewPos;
}

function collide(val, pos){
    console.log("val: " + val + " pos: " + pos.id);
    var collisionResult = document.createElement("div");
    createPiece(collisionResult, val*2);
    document.getElementById(pos.id).appendChild(collisionResult);
    document.getElementById(pos.id).childNodes.item(0).remove();
    // matrixArray[pos.id.slice(-2,-1)][pos.id.toString().slice(-1)] = [];
    animate(collisionResult);
}

//------------------------------------
//HOLDS AND DEFINES ALL PIECES.
//------------------------------------
function definePieces(){
    piece2 = {
        class: "p2", //set back to "two" and 4 to "four" to make css work.
        val: 2,
        background: "#eee4da",
        color: "#776e65",
        text: "2",
        id: function(){
            pieceAmountCount++;
            return pieceAmountCount;
        }
    };

    piece4 = {
        class: "p4",
        val: 4,
        background: "#ede0c8",
        color: "#776e65",
        text: "4",
        id: function(){
            pieceAmountCount++;
            return pieceAmountCount;
        }
    };

    piece8 = {
        class: "p8",
        val: 8,
        background: "#f2b179",
        color: "#f9f6f2",
        text: "8",
        id: function(){
            pieceAmountCount++;
            return pieceAmountCount;
        }
    };

    piece16 = {
        class: "p16",
        val: 16,
        background: "#f59563",
        color: "#f9f6f2",
        text: "16",
        id: function(){
            pieceAmountCount++;
            return pieceAmountCount;
        }
    };

    piece32 = {
        class: "p32",
        val: 32,
        background: "#f67c5f",
        color: "#f9f6f2",
        text: "32",
        id: function(){
            pieceAmountCount++;
            return pieceAmountCount;
        }
    };

    piece64 = {
        class: "p64",
        val: 64,
        background: "#f65e3b",
        color: "#f9f6f2",
        text: "64",
        id: function(){
            pieceAmountCount++;
            return pieceAmountCount;
        }
    };

    piece128 = {
        class: "p128",
        val: 128,
        background: "#edcf72",
        color: "#f9f6f2",
        text: "128",
        id: function(){
            pieceAmountCount++;
            return pieceAmountCount;
        }
    };
}