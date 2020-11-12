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

window.permute = function (permutation) {
  var length = permutation.length;
  var result = [permutation.slice()];
  var c = new Array(length).fill(0);
  var i = 1;
  var k, p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
};

window.countNQueensSolutions = function (n) {
  if (n < 2) {
    return 1;
  }
  var permutations = permute(_.range(n));
  var allSolutions = [];

  //p[i] != (p[j] - (i-j)) and p[i] != (p[j] - (j-i)
  for (let k = 0; k < permutations.length; k++) {
    if (_.every(permutations[k], function (val, i) {
      for (let j = (i + 1); j < n; j++) {
        if (val === (permutations[k][j] - (i - j)) || val === (permutations[k][j] - (j - i))) {
          return false;
        }
      }
      return true;
    })) {
      allSolutions.push(permutations[k]);
    }
  }
  solutionCount = allSolutions.length;

  //len([p for p in permutations(range(n)) if all([p[i] != (p[j] - (i-j)) and p[i] != (p[j] - (j-i)) for i in range(n) for j in range(i+1,n)])])
  //[p for p in permutations(range(n)) if all([p[i] != (p[j] - (i-j)) and p[i] != (p[j] - (j-i)) for i in range(n) for j in range(i+1,n)])]

  // n = 8
  // [p for p in permutations(range(n))
  // if all(
  // [p[i] != (p[j] - (i-j)) and p[i] != (p[j] - (j-i)) for i in range(n) for j in range(n) if i != j])]

  //[p for p in permutations(range(4))]
  // [(0, 1, 2, 3), (0, 1, 3, 2), (0, 2, 1, 3), (0, 2, 3, 1), (0, 3, 1, 2), (0, 3, 2, 1), (1, 0, 2, 3), (1, 0, 3, 2), (1, 2, 0, 3), (1, 2, 3, 0), (1, 3, 0, 2), (1, 3, 2, 0), (2, 0, 1, 3), (2, 0, 3, 1), (2, 1, 0, 3), (2, 1, 3, 0), (2, 3, 0, 1), (2, 3, 1, 0), (3, 0, 1, 2), (3, 0, 2, 1), (3, 1, 0, 2), (3, 1, 2, 0), (3, 2, 0, 1), (3, 2, 1, 0)]
  // permute([0,1,2,3])
  //object with digits and their distance to current stack
  // [0, 1, 2, 3]
  // 1: (4) [1, 0, 2, 3]
  // 2: (4) [2, 0, 1, 3]
  // 3: (4) [0, 2, 1, 3]
  // 4: (4) [1, 2, 0, 3]
  // 5: (4) [2, 1, 0, 3]
  // 6: (4) [3, 1, 0, 2]
  // 7: (4) [1, 3, 0, 2]
  // 8: (4) [0, 3, 1, 2]
  // 9: (4) [3, 0, 1, 2]
  // 10: (4) [1, 0, 3, 2]
  // 11: (4) [0, 1, 3, 2]
  // 12: (4) [0, 2, 3, 1]
  // 13: (4) [2, 0, 3, 1]
  // 14: (4) [3, 0, 2, 1]
  // 15: (4) [0, 3, 2, 1]
  // 16: (4) [2, 3, 0, 1]
  // 17: (4) [3, 2, 0, 1]
  // 18: (4) [3, 2, 1, 0]
  // 19: (4) [2, 3, 1, 0]
  // 20: (4) [1, 3, 2, 0]
  // 21: (4) [3, 1, 2, 0]
  // 22: (4) [2, 1, 3, 0]
  // 23: (4) [1, 2, 3, 0]

  //while we have unused digits
  //add lowest unused digit less than n and greater than digit we're replacing
  //recurse

  //if no unused digits
  //if digits.length === n
  //if valid solution
  //increment solution
  // return




  /*
  var solutionCount = 0;
  var columnIndexes = new BaseNNumber(n);
  columnIndexes.setLength(n);
  var row = 0;
  // [0, 3, 5, 3, 2, 1]
  // [0,0,0,1]
  // [x, , , ]
  // [ , , ,x]
  // [ , ,x, ]
  // [ ,x, , ]

  while (columnIndexes.getLength() === n) {
    columnIndexes.increment();
    var counts = {};
    var conflict = false;

    for (var i = 0; i < columnIndexes.digits.length; i++) {
      if (columnIndexes.digits[i] in counts) {
        conflict = true;
        break;
      } else {
        counts[columnIndexes.digits[i]] = 1;
      }
    }

    if (conflict) {
      continue;
    }

    for (var i = 0; i < columnIndexes.digits.length; i++) {
      for (var j = i + 1; j < columnIndexes.digits.length; j++) {
        // [1,3,0,2]
        // i = 0, j = 1 diff 1 or -1
        // 1, 3 diff = 2
        // let currNum = columnIndexes.digits[i];
        // let numCheck = columnIndexes.digits[j];
        // let minusDistance = (columnIndexes.digits[j] - (j - i));
        // let plusDistance = (columnIndexes.digits[j] - (i - j));
        // n;
        // debugger;

        if (columnIndexes.digits[i] === (columnIndexes.digits[j] - (j - i)) ||
          columnIndexes.digits[i] === (columnIndexes.digits[j] - (i - j))) {
          conflict = true;
          break;
        }
      }

      if (conflict) {
        break;
      }
    }

    if (!conflict) {
      solutionCount++;
    }
  }
  */
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};


class BaseNNumber {
  constructor(n) {
    this.digits = [0];
    this.base = n;
  }

  getStrValue() {
    var outStr = '';
    for (var i = 0; i < this.digits.length; i++) {
      outStr += this.digits[i];
    }
    return outStr;
  }

  increment() {
    this.digits[this.digits.length - 1]++;
    this.carry();
  }

  carry() {
    for (var i = this.digits.length - 1; i >= 0; i--) {
      if (this.digits[i] > (this.base - 1)) {
        if (i > 0) {
          this.digits[i - 1]++;
        } else {
          this.digits = [1].concat(this.digits);
          i++;
        }
        this.digits[i] = 0;
      }
    }
  }


  getLength() {
    return this.digits.length;
  }
  setLength(newLength) {
    var curLength = this.digits.length;

    if (curLength > newLength) {
      this.digits = this.digits.slice(curLength - newLength);
    }
    if (curLength < newLength) {
      var arr = [];
      for (var i = 0; i < newLength - curLength; i++) {
        arr.push(0);
      }
      this.digits = arr.concat(this.digits);
    }
  }
}
