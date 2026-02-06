/**
 * Determines the CSS class for a character based on user input.
 *
 * @param {number} index - Current character index
 * @param {string} userInput - What the user has typed so far
 * @param {string} targetSentence - The sentence to match against
 * @returns {string}
 */
export function getCharClass(index, userInput, targetSentence) {
  if (index >= targetSentence.length) return '';

  if (index < userInput.length) {
    return userInput[index].toLowerCase() === targetSentence[index].toLowerCase()
      ? 'char-correct'
      : 'char-incorrect';
  }
  return 'char-pending';
}

/**
 * Checks if the sentence is completed correctly.
 *
 * @param {string} userInput
 * @param {string} targetSentence
 * @returns {boolean}
 */
export function isSentenceComplete(userInput, targetSentence) {
  return userInput.toLowerCase() === targetSentence.toLowerCase() && targetSentence.length > 0;
}
