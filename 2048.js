/*TODO :
    Make it so setPiece(); doesnt overwrite the pieces made in a move.
*/

//------------------------------------------------------------------------------------------------------------------------
// THE FOLLOWING FUNCTION APPLY TO MATRIX AND POSITION OF THE PIECES
//------------------------------------------------------------------------------------------------------------------------
var piece2Count = 0;
var piece4Count = 0;
var piece8Count = 0;

var matrixHTML = document.getElementById("matrix-container");
var matrixArray = [];
for (var i = 0; i < 4; i++){ //Row
    matrixArray[i] = []
    for (var j = 0; j < 4; j++){ //Column
        matrixArray[i][j] = [];
        div = document.createElement("div");
        div.setAttribute("id", "pos" + i + j);
        matrixHTML.appendChild(div);
        //document.getElementById("pos" + i + j).innerHTML = matrixArray[i][j];
    }
}  

//called when page loads. Starts an instance of the game by creating the playing field, and adding 2 val2 pieces to random positions.
function createField(){
      
    // setPiece(2);
    // setPiece(2);
    setPieceDebug(2,2);
    setPieceDebug(3,2);
}

function getRandPos(){ 
    var row = Math.floor(Math.random() * (4));
    var col = Math.floor(Math.random() * (4));
    return returnPos(row, col);
}

function setPieceDebug(pos1, pos2){

    var position = document.getElementById("pos" + pos1 + pos2)
    var piece = document.createElement("div");
    createPiece(piece, 2);
    matrixArray[pos1][pos2] = piece;
    position.appendChild(piece);
}

function setPiece(determinedPiece){
    var unvailablePos = checkAvailable();  
    var randPos = getRandPos();

    console.log("Unavailable: " + unvailablePos);
    //Checks if the random cords are already in use by a div.
    for (var i = 0; i < unvailablePos.length; i ++){ 
        var randStr = randPos.row + "," + randPos.col;
        var u = unvailablePos.toString().split("",i,i+2);
        // console.log(randStr + " == " + u);
        if (randStr == u){
            setPiece();
            return;
        }
    }
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
    // console.log("Set piece: " + randPos.row + randPos.col);

    var position = document.getElementById("pos" + randPos.row + randPos.col)
    var piece = document.createElement("div");
    createPiece(piece, pieceType);
    matrixArray[randPos.row][randPos.col] = piece;
    position.appendChild(piece);
}

function checkAvailable(){
    var unavailablePosArr = [];
    var matrix = [];
    for (var i = 0; i < 4; i++){ //Rows
          matrix[i] = [];
        for (var j = 0; j < 4; j++){ //Colls
            // console.log(document.getElementById("pos" + i + j).childElementCount);
            if (document.getElementById("pos" + i + j).childElementCount >= 1){
                matrix[i][j] = returnPos(i, j);
                unavailablePosArr.push(i,j);
            }
        }
    }
    // console.log(unavailablePosArr.indexOf(0));
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
        var newPiece = piece;
    } else if (piece == 16){
        var newPiece = piece;
    }
    div.setAttribute("id", newPiece.id());
    div.setAttribute("class", newPiece.class);
    div.setAttribute("value", newPiece.val);
    div.style.background = newPiece.background;
    div.innerText = newPiece.text
};

var piece2 = {
    class: "two", //set back to "two" and 4 to "four" to make css work.
    val: 2,
    background: "#eee4da",
    text: "2",
    id: function(){
        piece2Count++;
        return piece2Count;
    },
};
var piece4 = {
    class: "four",
    val: 4,
    background: "#ede0c8",
    text: "4",
    id: function(){
        piece4Count++;
        return piece4Count;
    }
};
var piece8 = {
    class: "8",
    val: 8,
    background: "#ede0c8",
    text: "8",
    id: function(){
        piece4Count++;
        return piece8Count;
    }
};
//------------------------------------------------------------------------------------------------------------------------
// THE FOLLOWING FUNCTION APPLY TO THE MOVEMENT OF THE PIECES
//------------------------------------------------------------------------------------------------------------------------

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
    }
    setPiece();
}

function moveUp(){
    console.log("moveup");
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

        lowestCol = colEmpty.slice(0,1);
        console.log("colTaken: " + colTaken);
        console.log("colEmpty: " + colEmpty);
        if (colTaken.length != 0){
            for (var x = 0; x <= colTaken.length; x++){ //For each piece in a colomn, move it to it's last available position.
                // console.log("BEFORE : " + colTaken + " -- " + colEmpty);
                // movePiece(colTaken.shift(), i, colEmpty.pop());
                if (colTaken.length >= 2){
                    var colTemp1 = document.getElementById("pos" + colTaken.slice(-1) + i);
                    var colTempVal1 = parseInt(colTemp1.childNodes.item(0).getAttribute("value")); //returns either two or four, for now.

                    var colTemp2 = document.getElementById("pos" + 0 + i);
                    var colTempVal2 = parseInt(colTemp2.childNodes.item(0).getAttribute("value")); //returns either two or four, for now.
                    if (colTempVal1 == colTempVal2){
                        console.log("sameVal");
                        collide(colTempVal2, colTemp2);
                        colTemp1.childNodes.item(0).remove();
                        break;
                    }
                    // collide

                    //  if (colTemp1)
                }
                if(colTaken >= colEmpty.shift()){
                    console.log("The heighest point in col " + i + " is empty.");
                    movePiece(colTaken.shift(), i, colEmpty.shift());
                }  
                // console.log("AFTER : " + colTaken + " -- " + colEmpty);
            }
        }
        
    }
}
//var test = setInterval(frame, 5);
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

        lowestCol = colEmpty.slice(-1);
        // console.log(lowestCol);
        if (colTaken.length != 0){
            for (var x = 0; x <= colTaken.length; x++){ //For each piece in a colomn, move it to it's last available position.
                console.log("BEFORE : " + colTaken.length + " -- " + colEmpty);
                // movePiece(colTaken.shift(), i, colEmpty.pop());
                if (colTaken.length >= 3){
                    var colTemp1 = document.getElementById("pos" + colTaken.slice(0,1) + i);
                    var colTempVal1 = parseInt(colTemp1.childNodes.item(0).getAttribute("value")); //returns either two or four, for now.

                    var colTemp2 = document.getElementById("pos" + 3 + i);
                    var colTempVal2 = parseInt(colTemp2.childNodes.item(0).getAttribute("value")); //returns either two or four, for now.
                    if (colTempVal1 == colTempVal2){
                        console.log("sameVal");
                        collide(colTempVal1, colTemp2);
                        colTemp1.childNodes.item(0).remove();
                        break;
                    }
                    // collide

                    //  if (colTemp1)
                }
                if(colTaken <= colEmpty.slice(-1)){
                    movePiece(colTaken.shift(), i, colEmpty.slice(-1));
                }  
                // console.log("AFTER : " + colTaken + " -- " + colEmpty);
            }
        }
        
    }
}

//initial row, col -> New Row, Col.
function movePiece(iniX, iniY, nPos){
    // console.log("I would move the piece from row/col " + iniX.toString() +","+ iniY.toString() + " To the position of row/col" + nPos.toString()+","+ iniY.toString());
    console.log(iniX.toString() + ", " + iniY.toString() + " => " + nPos.toString());
    var pieceOldPos = document.getElementById("pos" + iniX.toString() + iniY.toString());
    var pieceNewPos;
    
    // pieceOldPos.childNodes.item(0).style.background = "red";

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
            possiblePos.childNodes.item(0).remove();
            pieceOldPos.childNodes.item(0).remove();
            
        } else {
            console.log("Not same type");
        }
    } else {
       pieceNewPos = document.getElementById("pos" + nPos.toString() + iniY.toString()).appendChild(pieceOldPos.childNodes.item(0));
    }
    matrixArray[iniX.toString()][iniY.toString()] = [];
    matrixArray[nPos.toString()][iniY.toString()] = pieceNewPos;
}

function collide(val, pos){
    console.log("val: " + val + " pos: " + pos.id);
    var collisionResult = document.createElement("div");
    createPiece(collisionResult, 4);
    document.getElementById(pos.id).appendChild(collisionResult);
    document.getElementById(pos.id).childNodes.item(0).remove();
}