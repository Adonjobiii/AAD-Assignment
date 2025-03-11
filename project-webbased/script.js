class MatrixChainCalculator {
    constructor() {
        this.dimensions = [
            { rows: 2, cols: 3 },
            { rows: 3, cols: 4 },
            { rows: 4, cols: 2 }
        ];
        
        this.initializeElements();
        this.setupEventListeners();
        this.renderMatrices();
    }

    initializeElements() {
        this.matricesContainer = document.getElementById('matrices-container');
        this.addMatrixButton = document.getElementById('add-matrix');
        this.calculateButton = document.getElementById('calculate');
        this.resultDiv = document.getElementById('result');
        this.sequenceElement = document.getElementById('sequence');
        this.operationsElement = document.getElementById('operations');
    }

    setupEventListeners() {
        this.addMatrixButton.addEventListener('click', () => this.addMatrix());
        this.calculateButton.addEventListener('click', () => this.calculate());
    }

    createMatrixRow(matrix, index) {
        const row = document.createElement('div');
        row.className = 'matrix-row';
        
        const label = document.createElement('span');
        label.className = 'matrix-label';
        label.textContent = `M${index + 1}`;
        
        const inputs = document.createElement('div');
        inputs.className = 'dimension-inputs';
        
        const rowsInput = document.createElement('input');
        rowsInput.type = 'number';
        rowsInput.value = matrix.rows;
        rowsInput.disabled = index > 0;
        rowsInput.addEventListener('change', (e) => this.updateDimension(index, 'rows', parseInt(e.target.value)));
        
        const separator = document.createElement('span');
        separator.textContent = '×';
        
        const colsInput = document.createElement('input');
        colsInput.type = 'number';
        colsInput.value = matrix.cols;
        colsInput.addEventListener('change', (e) => this.updateDimension(index, 'cols', parseInt(e.target.value)));
        
        inputs.appendChild(rowsInput);
        inputs.appendChild(separator);
        inputs.appendChild(colsInput);
        
        row.appendChild(label);
        row.appendChild(inputs);
        
        if (this.dimensions.length > 2) {
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-matrix';
            removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
            removeButton.addEventListener('click', () => this.removeMatrix(index));
            row.appendChild(removeButton);
        }
        
        return row;
    }

    renderMatrices() {
        this.matricesContainer.innerHTML = '';
        this.dimensions.forEach((matrix, index) => {
            this.matricesContainer.appendChild(this.createMatrixRow(matrix, index));
        });
    }

    addMatrix() {
        const lastMatrix = this.dimensions[this.dimensions.length - 1];
        this.dimensions.push({ rows: lastMatrix.cols, cols: 2 });
        this.renderMatrices();
    }

    removeMatrix(index) {
        if (this.dimensions.length > 2) {
            this.dimensions.splice(index, 1);
            if (index < this.dimensions.length) {
                this.dimensions[index].rows = this.dimensions[index - 1].cols;
            }
            this.renderMatrices();
        }
    }

    updateDimension(index, type, value) {
        this.dimensions[index][type] = value;
        if (type === 'cols' && index < this.dimensions.length - 1) {
            this.dimensions[index + 1].rows = value;
            this.renderMatrices();
        }
    }

    calculate() {
        const n = this.dimensions.length;
        const m = Array(n).fill(0).map(() => Array(n).fill(0));
        const s = Array(n).fill(0).map(() => Array(n).fill(0));
        const p = this.dimensions.map((d, i) => i === 0 ? d.rows : d.cols);

        for (let l = 2; l <= n; l++) {
            for (let i = 0; i < n - l + 1; i++) {
                const j = i + l - 1;
                m[i][j] = Infinity;
                for (let k = i; k < j; k++) {
                    const q = m[i][k] + m[k + 1][j] + p[i] * p[k + 1] * p[j + 1];
                    if (q < m[i][j]) {
                        m[i][j] = q;
                        s[i][j] = k;
                    }
                }
            }
        }

        const printOptimal = (i, j) => {
            if (i === j) {
                return `M${i + 1}`;
            }
            return `(${printOptimal(i, s[i][j])} × ${printOptimal(s[i][j] + 1, j)})`;
        };

        this.resultDiv.classList.remove('hidden');
        this.sequenceElement.textContent = printOptimal(0, n - 1);
        this.operationsElement.textContent = m[0][n - 1];
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MatrixChainCalculator();
});