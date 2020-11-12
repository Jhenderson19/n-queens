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
  if (n === 2 || n === 3) {
    return new Board({ n: n }).rows();
  }

  var columnsIndexes = new Array(n).fill(0);
  var board = new Board({ n: n });
  var conflict;

  for (let row = 0; row < n; row++) {
    while (columnsIndexes[row] < n) {
      board.togglePiece(row, columnsIndexes[row]);
      conflict = board.hasAnyQueensConflicts();
      columnsIndexes[row]++;
      if (conflict) {
        board.togglePiece(row, (columnsIndexes[row] - 1));
      } else {
        break;
      }
    }

    if (columnsIndexes[row] === n && conflict) {
      columnsIndexes[row] = 0;
      board.togglePiece(row - 1, columnsIndexes[row - 1] - 1);
      row -= 2;
    }
  }

  // [1,4,2,4]
  //
  // [x, , , ]
  // [ , , ,x]
  // [ , , , ]
  // [ , , , ]

  var solution = board.rows();

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other


window.countNQueensSolutions = function (n) {

  if (n < 2) {
    return 1;
  }

  var solutionCount = 0;
  var digits = [];
  var depth = 0;

  var nextPromisingNumber = function (minimum, digits, depth) {
    if (minimum === undefined) {
      minimum = 0;
    }

    var digitsPlusDepth = digits.map(e => e + depth);
    var digitsMinusDepth = digits.map(e => e - depth);

    var promising = minimum;
    do {
      promising++;
    } while (digits.includes(promising) || digitsPlusDepth.includes(promising) || digitsMinusDepth.includes(promising));

    if (promising < n) {
      return promising;
    }
    return undefined;
  };

  var getNextPiece = function (digits, depth) {
    if (depth === n) {
      console.log('Solution!: ' + digits);
      solutionCount++;
      return;
    }

    digits[depth] = -1;
    while (digits[depth] !== undefined && digits[depth] < n) {
      digits[depth] = nextPromisingNumber(digits[depth], _.clone(digits), depth);
      if (digits[depth] !== undefined && digits[depth] < n) {
        getNextPiece(_.clone(digits), depth + 1);
      }
    }
  };
  getNextPiece(digits, 0);
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
