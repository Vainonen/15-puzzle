$(document).ready(function(){
    var puzzleLength = 4;
    var puzzle = shuffle(puzzleLength, puzzleLength);
    var table = document.getElementById("puzzle");
    for (var i = 0; i < puzzleLength; i++) {
    var row = table.insertRow(i);
    for (var j = 0; j < puzzleLength; j++) {
        var cell = row.insertCell(j);
        var cellId = "cell" + (i * puzzleLength + j);
        cell.id = cellId;
        var piece = document.createElement('div');
        if (i == puzzleLength - 1 && j == puzzleLength - 1) piece.innerHTML = "";
        else {
            cell.content = puzzle[j][i];
            piece.id = puzzle[j][i];
            piece.x = j;
            piece.y = i;
            piece.innerHTML = piece.id;
            piece.className = "piece";
            piece.style.border = "thick solid #0000FF";
        }
        cell.className = "cell";
        cell.appendChild(piece);
    }
}

    $(function() {
      $('.piece').swipe( {
        //move pieces using tuochSwipe plugin:
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
           var piece = document.getElementById(event.target.id);
           var $piece = $('#'+event.target.id);
           var $origin = $piece.parent();
           var columnIndex = $origin.index();
		   var rowIndex = $origin.parent('tr').index();
           alert(columnIndex+" "+rowIndex);
           if (validMove(piece, direction)){
           		switch(direction){
                	case "up":
                    	rowIndex--;
                    break;
                    case "down":
                    	rowIndex++;
                    break;
                    case "left":
                    	columnIndex--;
                    break;
                    case "right":
                    	columnIndex++;
                    break;
                }
				var $target = $('tr').eq(rowIndex).find('td').eq(columnIndex);
                var element = $piece.detach();
                $target.append(element);
               var endPosition = $target.offset();
               var startPosition = $piece.offset();
               $piece.css({
                   position: 'absolute',
                   top: startPosition.top,
                   left: startPosition.left
               });

               $piece.animate({
                   top: endPosition.top,
                   left: endPosition.left
               }, 500);
            }
            if (checkPuzzle(puzzle)) Android.showToast("You solved the puzzle!");
        },
         //threshold of swipe movement:
         threshold:0
      });
    });

    //checks if it is possible to move piece in the board
    function validMove(piece, direction) {
        var x = piece.x;
        var y = piece.y;
        switch(direction) {
            case "up":
                if (piece.y > 0) {
                    if (puzzle[x][y-1] === 0) {
                        puzzle[x][y-1] = puzzle[x][y];
                        puzzle[x][y] = 0;
                        piece.y -= 1;
                        return true;
                    }
                }
                break;
            case "down":
                if (piece.y < puzzleLength - 1) {
                    if (puzzle[x][y+1] === 0) {
                        puzzle[x][y+1] = puzzle[x][y];
                        puzzle[x][y] = 0;
                        piece.y += 1;
                        return true;
                    }
                }
                break;
            case "left":
                if (piece.x > 0) {
                    if (puzzle[x-1][y] === 0) {
                        puzzle[x-1][y] = puzzle[x][y];
                        puzzle[x][y] = 0;
                        piece.x -= 1;
                        return true;
                    }
                }
                break;
            case "right":
                if (piece.x < puzzleLength - 1) {
                    if (puzzle[x+1][y] === 0) {
                        puzzle[x+1][y] = puzzle[x][y];
                        puzzle[x][y] = 0;
                        piece.x += 1;
                        return true;
                    }
                }
                break;
        }
        return false;
    }

  function shuffle(x, y) {
   var shuffled = new Array(x * y);
    for (var i = 0; i < shuffled.length - 1; i++) {
     shuffled[i] = i + 1;
    }
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * i);
        var number = shuffled[i - 1];
        shuffled[i - 1] = shuffled[j];
        shuffled[j] = number;
    }
    shuffled[x * y - 1] = 0;
    var puzzle = [];
    var number = 0;
    for (var i = 0; i < x; i++) {
     var row = new Array(x);
     for (var j = 0; j < y; j++) {
   row[j] = shuffled[number];
            number++;
        }
        puzzle.push(row);
    }
    return puzzle;
  }

  function checkPuzzle(puzzle) {
    var correctPieces = 0;
    var puzzleLength = 4;
    var totalPieces = puzzleLength * puzzleLength - 1;
    var pointer = 1;
    for (var i = 0; i < puzzleLength; i++) {
        for (var j = 0; j < puzzleLength; j++) {
            if (puzzle[j][i] == pointer) correctPieces++;
            pointer++;
     }
    }
    if (correctPieces == totalPieces) return true;
   return false;
  }

 });