import { parse, Platforms } from '../src';

describe('Protocol-less URL parsing', () => {
  test('instagram.com/apple should work', () => {
    const result = parse('instagram.com/apple');
    expect(result.isValid).toBe(true);
    expect(result.platform).toBe(Platforms.Instagram);
    expect(result.username).toBe('apple');
  });

  test('youtube.com/@mkbhd should work WITHOUT www', () => {
    const result = parse('youtube.com/@mkbhd');
    expect(result.isValid).toBe(true);
    expect(result.platform).toBe(Platforms.YouTube);
    expect(result.username).toBe('mkbhd');
  });

  test('youtube.com/watch?v=dQw4w9WgXcQ should work WITHOUT www', () => {
    const result = parse('youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result.isValid).toBe(true);
    expect(result.platform).toBe(Platforms.YouTube);
    expect(result.ids.videoId).toBe('dQw4w9WgXcQ');
  });

  test('twitter.com/elonmusk should work', () => {
    const result = parse('twitter.com/elonmusk');
    expect(result.isValid).toBe(true);
    expect(result.platform).toBe(Platforms.Twitter);
    expect(result.username).toBe('elonmusk');
  });

  test('x.com/elonmusk should work', () => {
    const result = parse('x.com/elonmusk');
    expect(result.isValid).toBe(true);
    expect(result.platform).toBe(Platforms.Twitter);
    expect(result.username).toBe('elonmusk');
  });

  test('www.linkedin.com/in/johndoe should work', () => {
    const result = parse('www.linkedin.com/in/johndoe');
    expect(result.isValid).toBe(true);
    expect(result.platform).toBe(Platforms.LinkedIn);
    expect(result.username).toBe('johndoe');
  });

  test('linkedin.com/in/johndoe should work WITHOUT www', () => {
    const result = parse('linkedin.com/in/johndoe');
    expect(result.isValid).toBe(true);
    expect(result.platform).toBe(Platforms.LinkedIn);
    expect(result.username).toBe('johndoe');
  });

  test('github.com/facebook/react should work', () => {
    const result = parse('github.com/facebook/react');
    expect(result.isValid).toBe(true);
    expect(result.platform).toBe(Platforms.GitHub);
    expect(result.username).toBe('facebook');
    expect(result.ids.repoName).toBe('react');
  });

  test('tiktok.com/@charlidamelio should work WITHOUT www', () => {
    const result = parse('tiktok.com/@charlidamelio');
    expect(result.isValid).toBe(true);
    expect(result.platform).toBe(Platforms.TikTok);
    expect(result.username).toBe('charlidamelio');
  });

  test('spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh should NOT work (needs open.)', () => {
    const result = parse('spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh');
    expect(result.isValid).toBe(false);
  });

  test('open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh should work', () => {
    const result = parse('open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh');
    expect(result.isValid).toBe(true);
    expect(result.platform).toBe(Platforms.Spotify);
    expect(result.ids.trackId).toBe('4iV5W9uYEdYUVa79Axb7Rh');
  });

  test('preserves original URL in result', () => {
    const result = parse('instagram.com/nasa');
    expect(result.originalUrl).toBe('instagram.com/nasa');
    expect(result.normalizedUrl).toBe('https://instagram.com/nasa');
  });

  test('does not add protocol to email addresses', () => {
    const result = parse('user@example.com');
    expect(result.platform).toBe(Platforms.Email);
    expect(result.isValid).toBe(true);
  });

  test('does not add protocol to phone numbers', () => {
    const result = parse('+1-555-123-4567');
    expect(result.platform).toBe(Platforms.Phone);
    expect(result.isValid).toBe(true);
  });

  test('does not add protocol to already valid URLs', () => {
    const result = parse('https://instagram.com/apple');
    expect(result.originalUrl).toBe('https://instagram.com/apple');
    expect(result.normalizedUrl).toBe('https://instagram.com/apple');
  });
});
