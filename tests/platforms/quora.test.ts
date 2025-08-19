import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Quora;
const mod = registry.get(id)!;

describe('Quora platform tests', () => {
  const samples = {
    profile: 'https://www.quora.com/profile/First-Last',
    question: 'https://www.quora.com/Why-is-the-sky-blue',
    answer: 'https://www.quora.com/Why-is-the-sky-blue/answer/First-Last',
  };

  describe('detect', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });
  });

  describe('parse', () => {
    test('profile', () => {
      const r = parse(samples.profile);
      expect(r.username).toBe('First-Last');
      expect(r.metadata.isProfile).toBe(true);
    });
    test('question', () => {
      const r = parse(samples.question);
      expect(r.ids.questionSlug).toBe('Why-is-the-sky-blue');
      expect(r.metadata.isQuestion).toBe(true);
    });
    test('answer', () => {
      const r = parse(samples.answer);
      expect(r.ids.questionSlug).toBe('Why-is-the-sky-blue');
      expect(r.username).toBe('First-Last');
      expect(r.metadata.isAnswer).toBe(true);
    });
  });

  describe('builders', () => {
    test('profile builder', () => {
      expect(mod.buildProfileUrl?.('Second-User')).toBe(
        'https://www.quora.com/profile/Second-User',
      );
    });
    test('question builder', () => {
      expect(mod.buildContentUrl?.('question', 'Some-Question')).toBe(
        'https://www.quora.com/Some-Question',
      );
    });
    test('answer builder', () => {
      const built = mod.buildContentUrl?.('answer', 'Some-Question/answer/Author');
      expect(built).toBe('https://www.quora.com/Some-Question/answer/Author');
    });
  });
});
