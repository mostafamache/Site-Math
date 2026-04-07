/* Place your JavaScript in this file */
/*Opérations sur les matrices*/
  function lireMatrice(texte) {
    return texte.trim().split("\n").map(ligne =>
      ligne.trim().split(/\s+/).map(Number)
    );
  }

  function dimensionsEgales(A, B) {
    return A.length === B.length &&
           A[0].length === B[0].length;
  }

  function addition(A, B) {
    return A.map((ligne, i) =>
      ligne.map((val, j) => val + B[i][j])
    );
  }

  function soustraction(A, B) {
    return A.map((ligne, i) =>
      ligne.map((val, j) => val - B[i][j])
    );
  }

  function multiplication(A, B) {
    if (A[0].length !== B.length) return null;

    const res = Array.from(
      { length: A.length },
      () => Array(B[0].length).fill(0)
    );

    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < B[0].length; j++) {
        for (let k = 0; k < B.length; k++) {
          res[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return res;
  }

  function afficherMatrice(M) {
    return M.map(ligne => ligne.join(" ")).join("\n");
  }

  function calculer(operation) {
    const output = document.getElementById("resultat");
    try {
      const A = lireMatrice(document.getElementById("matrixA").value);
      const B = lireMatrice(document.getElementById("matrixB").value);
      let resultat;

      if (operation === "add") {
        if (!dimensionsEgales(A, B))
          throw "Les matrices doivent avoir les mêmes dimensions.";
        resultat = addition(A, B);
      }

      if (operation === "sub") {
        if (!dimensionsEgales(A, B))
          throw "Les matrices doivent avoir les mêmes dimensions.";
        resultat = soustraction(A, B);
      }

      if (operation === "mul") {
        resultat = multiplication(A, B);
        if (resultat === null)
          throw "Nombre de colonnes de A ≠ nombre de lignes de B.";
      }

      output.className = "";
      output.textContent = afficherMatrice(resultat);

    } catch (err) {
      output.className = "error";
      output.textContent = "Erreur : " + err;
    }
  }

/*déterminant d'une matrice */
// Calcul du déterminant par la méthode de Gauss

function creerMatrice() {
    const n = parseInt(document.getElementById("dimension").value);
    const container = document.getElementById("matrice");
    container.innerHTML = "";

    const table = document.createElement("table");

    for (let i = 0; i < n; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < n; j++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.step = "any";
            input.value = 0;
            input.id = `a_${i}_${j}`;
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    container.appendChild(table);
}

function lireMatrice() {
    const n = parseInt(document.getElementById("dimension").value);
    const M = [];

    for (let i = 0; i < n; i++) {
        M[i] = [];
        for (let j = 0; j < n; j++) {
            const val = parseFloat(document.getElementById(`a_${i}_${j}`).value);
            M[i][j] = isNaN(val) ? 0 : val;
        }
    }
    return M;
}

function determinant(M) {
    const n = M.length;

    if (n === 1) return M[0][0];
    if (n === 2) return M[0][0]*M[1][1] - M[0][1]*M[1][0];

    let det = 0;
    for (let j = 0; j < n; j++) {
        det += ((j % 2 === 0 ? 1 : -1) * M[0][j] * determinant(mineur(M, 0, j)));
    }
    return det;
}

function mineur(M, row, col) {
    return M
        .filter((_, i) => i !== row)
        .map(r => r.filter((_, j) => j !== col));
}

function calculerDeterminant() {
    const M = lireMatrice();
    const det = determinant(M);
    document.getElementById("resultat").innerText =
        "Déterminant = " + det;
}

// création initiale
creerMatrice();



// Résolution de systèmes linéaires par la méthode de Gauss


function creerTableau() {
    let n = Number(document.getElementById("n").value);
    let html = "<h3>Coefficients</h3><table>";

    for (let i = 0; i < n; i++) {
        html += "<tr>";
        for (let j = 0; j < n; j++) {
            html += `<td><input id="a${i}${j}" type="number"></td>`;
        }
        html += `<td>= <input id="b${i}" type="number"></td>`;
        html += "</tr>";
    }

    html += "</table>";
    document.getElementById("systeme").innerHTML = html;
}

function resoudreSEL() {
    let n = Number(document.getElementById("n").value);
    let A = [];
    let B = [];

    for (let i = 0; i < n; i++) {
        A[i] = [];
        for (let j = 0; j < n; j++) {
            A[i][j] = Number(document.getElementById(`a${i}${j}`).value);
        }
        B[i] = Number(document.getElementById(`b${i}`).value);
    }

    // Méthode de Gauss
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            let facteur = A[j][i] / A[i][i];
            for (let k = 0; k < n; k++) {
                A[j][k] -= facteur * A[i][k];
            }
            B[j] -= facteur * B[i];
        }
    }

    // Remontée
    let X = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        X[i] = B[i];
        for (let j = i + 1; j < n; j++) {
            X[i] -= A[i][j] * X[j];
        }
        X[i] /= A[i][i];
    }

    let resultat = "<h3>Solution</h3>";
    for (let i = 0; i < n; i++) {
        resultat += `x${i+1} = ${X[i].toFixed(3)}<br>`;
    }

    document.getElementById("resultat").innerHTML = resultat;
}

//Méthode su simplexe pour l'optimisation linéaire
function lireVecteur(txt) {
  return txt.trim().split(/\s+/).map(Number);
}

function simplex(c, A, b) {
  const m = A.length;
  const n = c.length;
  let tableau = [];

  // Contraintes + variables d'écart
  for (let i = 0; i < m; i++) {
    tableau[i] = [...A[i]];
    for (let j = 0; j < m; j++)
      tableau[i].push(i === j ? 1 : 0);
    tableau[i].push(b[i]);
  }

  // Fonction objectif
  let Z = c.map(v => -v);
  for (let i = 0; i < m + 1; i++) Z.push(0);
  tableau.push(Z);

  // Itérations
  while (true) {
    let last = tableau[m];
    let pivotCol = last.slice(0, -1).findIndex(v => v < 0);
    if (pivotCol === -1) break;

    let ratios = tableau.slice(0, m)
      .map(row => row[pivotCol] > 0
        ? row[row.length - 1] / row[pivotCol]
        : Infinity);

    let pivotRow = ratios.indexOf(Math.min(...ratios));
    let pivot = tableau[pivotRow][pivotCol];

    tableau[pivotRow] = tableau[pivotRow].map(v => v / pivot);

    for (let i = 0; i <= m; i++) {
      if (i !== pivotRow) {
        let f = tableau[i][pivotCol];
        tableau[i] = tableau[i].map(
          (v, j) => v - f * tableau[pivotRow][j]
        );
      }
    }
  }

  // Lecture solution
  let sol = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let col = tableau.map(r => r[j]);
    if (col.filter(v => v === 1).length === 1) {
      let i = col.indexOf(1);
      sol[j] = tableau[i][tableau[i].length - 1];
    }
  }

  const valeurZ = tableau[m][tableau[0].length - 1];
  return { sol, valeurZ };
}

function resoudre() {
  const result = document.getElementById("resultat");
  try {
    const c = lireVecteur(document.getElementById("objective").value);
    const A = lireMatrice(document.getElementById("matrixA").value);
    const b = lireVecteur(document.getElementById("vectorB").value);

    if (A.length !== b.length)
      throw "Nombre de contraintes incohérent.";

    const r = simplex(c, A, b);

    let txt = "Solution optimale :\n";
    r.sol.forEach((v, i) =>
      txt += `x${i + 1} = ${v.toFixed(3)}\n`
    );
    txt += `\nValeur optimale Z = ${r.valeurZ.toFixed(3)}`;

    result.className = "";
    result.textContent = txt;
  } catch (e) {
    result.className = "error";
    result.textContent = "Erreur : " + e;
  }
}
