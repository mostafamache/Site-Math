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

 function createMatrix() {
  const n = parseInt(document.getElementById("size").value);
  if (n <= 0) {
    alert("Veuillez entrer un entier positif");
    return;
  }

  const container = document.getElementById("matrix");
  container.innerHTML = "";

  const table = document.createElement("table");

  for (let i = 0; i < n; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < n; j++) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.step = "any";
      cell.appendChild(input);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  container.appendChild(table);
 }

// Calcul du déterminant par élimination de Gauss
 function determinant(A) {
  const n = A.length;
  let det = 1;

  // Copie de la matrice
  let M = A.map(row => row.slice());

  for (let i = 0; i < n; i++) {
    // Recherche pivot
    let pivot = i;
    while (pivot < n && M[pivot][i] === 0) pivot++;

    if (pivot === n) return 0;

    if (pivot !== i) {
      [M[i], M[pivot]] = [M[pivot], M[i]];
      det *= -1;
    }

    det *= M[i][i];

    for (let j = i + 1; j < n; j++) {
      let factor = M[j][i] / M[i][i];
      for (let k = i; k < n; k++) {
        M[j][k] -= factor * M[i][k];
      }
    }
  }

  return det;
 }
 function computeDeterminant() {
  const table = document.querySelector("#matrix table");
  if (!table) return;

  const n = table.rows.length;
  let matrix = [];

  try {
    for (let i = 0; i < n; i++) {
      matrix[i] = [];
      for (let j = 0; j < n; j++) {
        const value = table.rows[i].cells[j].firstChild.value;
        if (value === "") throw "Toutes les cases doivent être remplies";
        matrix[i][j] = parseFloat(value);
      }
    }

    const det = determinant(matrix);
    document.getElementById("result").textContent =
      "Résultat : det(A) = " + det.toPrecision(2);

  } catch (e) {
    alert("Erreur : " + e);
  }
 }
 
