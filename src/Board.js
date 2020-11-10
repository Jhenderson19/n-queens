// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function () {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function () {
      return _(_.range(this.get('n'))).map(function (rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function (rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function () {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function (rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function () {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function (rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
             _             _     _
         ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
        / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
        \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
        |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

     */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function (rowIndex) {
      // array of arrays
      var matrix = this.rows();
      var thingsInRow = 0;

      /*
      [0, 0, 0, 0] // no row conflict
      [0, 0, 0, 1] // no row conflict
      [0, 0, 1, 1] // row conflict
      */

      for (let j = 0; j < matrix[rowIndex].length; j++) {
        if (matrix[rowIndex][j]) {
          thingsInRow++;
        }
      }

      return thingsInRow > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function () {
      // n is the number of rows.
      var hasHadConflict = false;
      var n = this.get('n');

      for (var i = 0; i < n; i++) {
        hasHadConflict = this.hasRowConflictAt(i) || hasHadConflict;
      }

      return hasHadConflict;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function (colIndex) {
      var matrix = this.rows();
      var thingsInCol = 0;

      for (var i = 0; i < matrix.length; i++) {
        if (matrix[i][colIndex]) {
          thingsInCol++;
        }
      }

      return thingsInCol > 1; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function () {
      var hasHadConflict = false;
      var n = this.get('n');

      for (var i = 0; i < n; i++) {
        hasHadConflict = hasHadConflict || this.hasColConflictAt(i);
      }

      return hasHadConflict; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function (majorDiagonalColumnIndexAtFirstRow) {
      // index:  0 -1 -2  -3
      //        [c0,c1,c2,c3]
      //      1 [r1,c0,c1,c2]
      //      2 [r2,r1,c0,c1]
      //      3 [r3,r2,r1,c0]
      // columns 0 to n-2
      // rows 1 to n-2
      var matrix = this.rows();
      var thingsInMajorDiagonal = 0;

      for (var i = 0; i < matrix.length; i++) {
        if (matrix[i + majorDiagonalColumnIndexAtFirstRow] && matrix[i + majorDiagonalColumnIndexAtFirstRow][i]) {
          thingsInMajorDiagonal++;
        }
      }

      return thingsInMajorDiagonal > 1; // fixme


    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function () {
      var hasHadConflict = false;
      var n = this.get('n');

      for (var i = -(n - 1); i < n; i++) {
        hasHadConflict = this.hasMajorDiagonalConflictAt(i) || hasHadConflict;
      }

      return hasHadConflict;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function (minorDiagonalColumnIndexAtFirstRow) {
      var matrix = this.rows();
      var thingsInMinorDiagonal = 0;

      for (var i = 0; i < matrix.length; i++) {
        if (matrix[i + minorDiagonalColumnIndexAtFirstRow] && matrix[i + minorDiagonalColumnIndexAtFirstRow][matrix.length - 1 - i]) {
          thingsInMinorDiagonal++;
        }
      }

      return thingsInMinorDiagonal > 1; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function () {
      var hasHadConflict = false;
      var n = this.get('n');

      for (var i = -(n - 1); i < n; i++) {
        hasHadConflict = this.hasMinorDiagonalConflictAt(i) || hasHadConflict;
      }

      return hasHadConflict;

    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function (n) {
    return _(_.range(n)).map(function () {
      return _(_.range(n)).map(function () {
        return 0;
      });
    });
  };

}());
