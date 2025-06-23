import { registry } from '../../src/utils/parse/platforms'
import { ParsedUrl } from '../../src/utils/parse/core/types'

interface Sample {
  url: string
  expected: (result: ParsedUrl) => void
}

const samples: Record<string, Sample> = {
  instagram: {
    url: 'https://instagram.com/johndoe',
    expected: r => {
      expect(r.username).toBe('johndoe')
      expect(r.metadata.isProfile).toBe(true)
    },
  },
  youtube: {
    url: 'https://youtu.be/dQw4w9WgXcQ',
    expected: r => {
      expect(r.ids.videoId).toBe('dQw4w9WgXcQ')
      expect(r.metadata.isVideo).toBe(true)
    },
  },
  tiktok: {
    url: 'https://www.tiktok.com/@scout2015/video/6718335390845095173',
    expected: r => {
      expect(r.ids.videoId).toBe('6718335390845095173')
      expect(r.metadata.isVideo).toBe(true)
    },
  },
  twitter: {
    url: 'https://twitter.com/jack/status/20',
    expected: r => {
      expect(r.ids.postId).toBe('20')
      expect(r.metadata.isPost).toBe(true)
    },
  },
  facebook: {
    url: 'https://www.facebook.com/zuck/posts/10102577175875681',
    expected: r => {
      expect(r.ids.postId).toBe('10102577175875681')
      expect(r.metadata.isPost).toBe(true)
    },
  },
  spotify: {
    url: 'https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P',
    expected: r => {
      expect(r.ids.trackId).toBe('7ouMYWpwJ422jRcDASZB7P')
    },
  },
  reddit: {
    url: 'https://redd.it/kv7qaj',
    expected: r => {
      expect(r.ids.postId).toBe('kv7qaj')
      expect(r.metadata.isPost).toBe(true)
    },
  },
}

describe('Platform modules unit tests', () => {
  for (const [platformId, sample] of Object.entries(samples)) {
    const module = registry.get(platformId)!
    test(`${platformId} detect() recognises sample url`, () => {
      expect(module.detect(sample.url)).toBe(true)
    })

    test(`${platformId} extract() populates result correctly`, () => {
      const result = {
        isValid: false,
        originalUrl: sample.url,
        normalizedUrl: sample.url,
        platform: null,
        ids: {},
        metadata: {},
      } as ParsedUrl

      module.extract(sample.url, result)
      sample.expected(result)
    })
  }
})