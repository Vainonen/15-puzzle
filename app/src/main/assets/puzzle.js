$(document).ready(function(){
    var startTime = new Date().getTime();
    var clock = setInterval(function(){ countTime() }, 1000);
    var moves = 0;
    var puzzleLength = 4;
    var puzzle = shuffle(puzzleLength, puzzleLength);
    var table = document.getElementById("puzzle");
    var puzzleSize;
    var ww = $(window).width();
    if ($(window).width() < $(window).height()) puzzleSize = $(window).width();
    else puzzleSize = $(window).height();
    $('#puzzle').width(puzzleSize - puzzleSize/50);
    $('#puzzle').height(puzzleSize - puzzleSize/50);
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
            /* first tile of first row red, first tile of second row white
            and every following tile in row with different color than its predecessor */
            if ((piece.id % puzzleLength) % 2 !== (Math.floor((piece.id - 1)/ puzzleLength)) % 2) color = "red";
            else color = "white";
            piece.style.backgroundColor = color;
            piece.style.border="2px solid darken(background, 20)";
        }
        cell.className = "cell";
        cell.appendChild(piece);
    }
}

     function countTime() {
        var now = new Date().getTime();
        var distance =  now - startTime;
        var days = Math.floor(distance /  (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 *  60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance  % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance  % (1000 * 60)) / 1000);
        document.getElementById("clock").innerHTML = "";
        if (days > 0) document.getElementById("clock").innerHTML += days + ":";
        if (hours > 0) document.getElementById("clock").innerHTML += hours + ":";
        if (minutes < 9) document.getElementById("clock").innerHTML += "0" + minutes + ":";
        else document.getElementById("clock").innerHTML += minutes + ":";
        if (seconds < 9) document.getElementById("clock").innerHTML += "0" + seconds;
        else document.getElementById("clock").innerHTML += seconds;
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
                moves++;
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
                   //position: 'absolute',
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