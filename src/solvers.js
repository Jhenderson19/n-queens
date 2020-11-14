/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function (n) {
  var solution = new Board({ n: n }); //fixme
  var columns = _.shuffle(_.range(n));
  var row = 0;

  while (columns.length > 0) {
    solution.togglePiece(row++, columns.pop());
  }

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function (n) {
  var factorial = function (number) {
    var total = 1;
    while (number > 0) {
      total *= number;
      number--;
    }

    return total;
  };

  return factorial(n);
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function (n) {
  if (n < 4) {
    var board = new Board({ n: n });

    if (n === 1) {
      board.togglePiece(0, 0);
    }

    return board.rows();
  }

  var digits = [];
  var depth = 0;
  window.finalResult = false;

  var solution = getNextPiece(digits, 0, n, digits => {
    finalResult = _.clone(digits);
    console.log('final result: ' + finalResult);
    return finalResult;
  }, finalResult);

  console.log(finalResult);

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return digitsToBoard(finalResult).rows();
};

window.digitsToBoard = function(digits) {
  console.log('digits to board: ' + digits);
  var board = new Board({ n: digits.length });

  for (let i = 0; i < digits.length; i++) {
    board.togglePiece(i, digits[i]);
  }

  return board;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other

// [1,3,0,2]
// [2,0,3,1]
// [1,3,0,2]
window.rotateBoard180 = function (digits) {
  digits.reverse();
  rotatedBoard = _.clone(digits).map(function (e) {
    return (n - 1) - e;
  });
};

window.nextPromisingNumber = function (minimum, digits, depth, n) {
  if (minimum === undefined) {
    minimum = 0;
  }

  var diagonal1 = digits.map((e, i) => e + depth - i);
  var diagonal2 = digits.map((e, i) => e - depth + i);

  var promising = minimum;
  do {
    promising++;
  } while (digits.includes(promising) || diagonal1.includes(promising) || diagonal2.includes(promising));

  if (promising < n) {
    return promising;
  }

  return undefined;
};

window.getNextPiece = function (digits, depth, n, cb, finalResult) {
  if (depth === n) {
    return cb(digits);
  }

  if (finalResult) {
    return finalResult;
  }

  if (digits[0] >= Math.ceil(n / 2)) {
    return;
  }

  digits[depth] = -1;
  while (digits[depth] !== undefined && digits[depth] < n) {
    digits[depth] = nextPromisingNumber(digits[depth], _.clone(digits.slice(0, digits.length - 1)), depth, n);
    if (digits[depth] !== undefined && digits[depth] < n) {
      getNextPiece(_.clone(digits), depth + 1, n, cb);
    }
  }
};



window.countNQueensSolutions = function (n) {
  if (n < 2) {
    return 1;
  }

  var solutionCount = 0;
  var digits = [];
  var depth = 0;
  var finalResult = false;

  getNextPiece(digits, 0, n, () => {
    solutionCount++;
    if (digits[0] < Math.floor(n / 2)) {
      solutionCount++;
    }
  }, finalResult);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
