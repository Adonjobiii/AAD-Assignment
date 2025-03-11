document.addEventListener("DOMContentLoaded", function () {
    let dimensions = [];
    const dimensionInput = document.getElementById("dimension");
    const addMatrixBtn = document.getElementById("add-matrix");
    const calculateBtn = document.getElementById("calculate");
    const resultContainer = document.getElementById("result");
    const sequenceOutput = document.getElementById("sequence");
    const operationsOutput = document.getElementById("operations");
  
    addMatrixBtn.addEventListener("click", () => {
      const value = parseInt(dimensionInput.value);
      if (!isNaN(value) && value > 0) {
        dimensions.push(value);
        dimensionInput.value = "";
        alert(`Added: ${value}`);
      } else {
        alert("Please enter a valid positive number.");
      }
    });
  
    calculateBtn.addEventListener("click", () => {
      if (dimensions.length < 2) {
        alert("At least two dimensions are needed!");
        return;
      }
  
      const { minOperations, parenthesization } = matrixChainMultiplication(dimensions);
      sequenceOutput.textContent = parenthesization;
      operationsOutput.textContent = minOperations;
      resultContainer.classList.remove("hidden");
    });
  
    function matrixChainMultiplication(dims) {
      const n = dims.length - 1;
      const m = Array.from({ length: n }, () => Array(n).fill(0));
      const s = Array.from({ length: n }, () => Array(n).fill(0));
  
      for (let length = 2; length <= n; length++) {
        for (let i = 0; i < n - length + 1; i++) {
          let j = i + length - 1;
          m[i][j] = Infinity;
  
          for (let k = i; k < j; k++) {
            let cost = m[i][k] + m[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
            if (cost < m[i][j]) {
              m[i][j] = cost;
              s[i][j] = k;
            }
          }
        }
      }
  
      function getParenthesization(i, j) {
        if (i === j) return `M${i + 1}`;
        return `(${getParenthesization(i, s[i][j])} × ${getParenthesization(s[i][j] + 1, j)})`;
      }
  
      return {
        minOperations: m[0][n - 1],
        parenthesization: getParenthesization(0, n - 1),
      };
    }
  });
  