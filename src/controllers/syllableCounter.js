export function countSyllables(sentence) {
    // Convert the sentence to lowercase for consistent handling
    sentence = sentence.toLowerCase();

    // Remove punctuation and whitespace
    sentence = sentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, '');

    // Define vowels and combinations of letters that can form syllables
    const vowels = 'aeiouáéíóú';
    const vowelCombinations = ['ai', 'ei', 'oi', 'au', 'eu', 'ou', 'ia', 'ie', 'io', 'iu', 'ua', 'ue', 'uo'];

    // Syllable counter
    let syllableCount = 0;

    // Check each letter in the sentence
    for (let i = 0; i < sentence.length; i++) {
        const currentLetter = sentence[i];
        const nextLetter = sentence[i + 1];

        // If the current letter is a vowel
        if (vowels.includes(currentLetter)) {
            syllableCount++;

            // If the next letter is also a vowel, subtract 1 to avoid counting twice
            if (vowels.includes(nextLetter)) {
                syllableCount--;
            }

            // If the next letter forms a combination of vowels, subtract 1
            if (vowelCombinations.includes(currentLetter + nextLetter)) {
                syllableCount--;
            }
        }
    }

    // Ensure that the count is not negative
    if (syllableCount < 0) {
        syllableCount = 0;
    }

    return syllableCount;
}
