import { parse, Platforms } from '../../src/utils/parse'

describe('Parser integration', () => {
  const cases: Array<[string, Platforms]> = [
    ['https://instagram.com/johndoe', Platforms.Instagram],
    ['https://youtu.be/dQw4w9WgXcQ', Platforms.YouTube],
    ['https://www.tiktok.com/@scout2015/video/6718335390845095173', Platforms.TikTok],
    ['https://twitter.com/jack/status/20', Platforms.Twitter],
    ['https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P', Platforms.Spotify],
  ]

  test.each(cases)('parse(%s) identifies platform %s', (url, platform) => {
    const result = parse(url)
    expect(result.isValid).toBe(true)
    expect(result.platform).toBe(platform)
  })
})