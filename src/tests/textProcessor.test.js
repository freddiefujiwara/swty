import { describe, it, expect } from 'vitest';
import { cleanText, parseCSV } from '../utils/textProcessor';

describe('textProcessor', () => {
  describe('cleanText', () => {
    it('converts to lowercase', () => {
      expect(cleanText('HELLO')).toBe('hello');
    });

    it('removes numbers and symbols', () => {
      expect(cleanText('Hello, World! 123')).toBe('hello world ');
    });

    it('keeps spaces', () => {
      expect(cleanText('a b  c')).toBe('a b  c');
    });

    it('handles empty input', () => {
      expect(cleanText('')).toBe('');
      expect(cleanText(null)).toBe('');
      expect(cleanText(undefined)).toBe('');
    });
  });

  describe('parseCSV', () => {
    it('splits by comma', () => {
      const input = 'Hello World,This is a test';
      const expected = ['hello world', 'this is a test'];
      expect(parseCSV(input)).toEqual(expected);
    });

    it('splits by newline', () => {
      const input = 'Hello World\nThis is a test';
      const expected = ['hello world', 'this is a test'];
      expect(parseCSV(input)).toEqual(expected);
    });

    it('cleans each sentence and collapses spaces', () => {
      const input = 'Hello  World! 123, 456 Test...';
      const expected = ['hello world', 'test'];
      expect(parseCSV(input)).toEqual(expected);
    });

    it('filters out empty sentences', () => {
      const input = 'Hello World,, , \n,,,Test';
      const expected = ['hello world', 'test'];
      expect(parseCSV(input)).toEqual(expected);
    });

    it('handles multiple spaces by collapsing them', () => {
      const input = 'Hello   World';
      expect(parseCSV(input)).toEqual(['hello world']);
    });

    it('handles null/undefined/empty input', () => {
      expect(parseCSV(null)).toEqual([]);
      expect(parseCSV(undefined)).toEqual([]);
      expect(parseCSV('')).toEqual([]);
    });
  });
});
