import { describe, it, expect } from 'vitest';
import { getCharClass, isSentenceComplete } from '../utils/gameLogic';

describe('gameLogic', () => {
  describe('getCharClass', () => {
    const target = 'abc';

    it('returns char-pending for untyped chars', () => {
      expect(getCharClass(0, '', target)).toBe('char-pending');
    });

    it('returns char-correct for correctly typed chars', () => {
      expect(getCharClass(0, 'a', target)).toBe('char-correct');
    });

    it('returns char-incorrect for incorrectly typed chars', () => {
      expect(getCharClass(0, 'b', target)).toBe('char-incorrect');
    });

    it('returns empty string for index out of bounds', () => {
      expect(getCharClass(3, 'abc', target)).toBe('');
    });
  });

  describe('isSentenceComplete', () => {
    it('returns true when input matches target', () => {
      expect(isSentenceComplete('hello', 'hello')).toBe(true);
    });

    it('returns false when input does not match target', () => {
      expect(isSentenceComplete('hell', 'hello')).toBe(false);
      expect(isSentenceComplete('helloo', 'hello')).toBe(false);
    });

    it('returns false for empty target', () => {
      expect(isSentenceComplete('', '')).toBe(false);
    });
  });
});
