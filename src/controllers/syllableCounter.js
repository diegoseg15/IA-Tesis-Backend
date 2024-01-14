// Función para contar las sílabas en una oración
export function countSyllables(sentence) {
  // Convertir la oración a minúsculas para un manejo consistente
  sentence = sentence.toLowerCase();

  // Eliminar puntuación y espacios en blanco
  sentence = sentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, "");

  // Definir vocales y combinaciones de letras que pueden formar sílabas
  const vowels = "aeiouáéíóú";
  const vowelCombinations = [
    "ai",
    "ei",
    "oi",
    "au",
    "eu",
    "ou",
    "ia",
    "ie",
    "io",
    "iu",
    "ua",
    "ue",
    "uo",
  ];

  // Contador de sílabas
  let syllableCount = 0;

  // Verificar cada letra en la oración
  for (let i = 0; i < sentence.length; i++) {
    const currentLetter = sentence[i];
    const nextLetter = sentence[i + 1];

    // Si la letra actual es una vocal
    if (vowels.includes(currentLetter)) {
      syllableCount++;

      // Si la siguiente letra también es una vocal, restar 1 para evitar contar dos veces
      if (vowels.includes(nextLetter)) {
        syllableCount--;
      }

      // Si la siguiente letra forma una combinación de vocales, restar 1
      if (vowelCombinations.includes(currentLetter + nextLetter)) {
        syllableCount--;
      }
    }
  }

  // Asegurarse de que el conteo no sea negativo
  if (syllableCount < 0) {
    syllableCount = 0;
  }

  // Devolver el conteo de sílabas
  return syllableCount;
}
