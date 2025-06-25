import { parse } from '../src/utils/parse'

describe('Embed Data Functionality', () => {
    describe('YouTube', () => {
        it('should extract embed data for video URLs', () => {
            const result = parse('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

            expect(result.embedData).toBeDefined()
            expect(result.embedData?.platform).toBe('youtube')
            expect(result.embedData?.type).toBe('iframe')
            expect(result.embedData?.embedUrl).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
            expect(result.embedData?.contentId).toBe('dQw4w9WgXcQ')
        })

        it('should detect already embedded URLs', () => {
            const result = parse('https://www.youtube.com/embed/dQw4w9WgXcQ')

            expect(result.metadata.isEmbed).toBe(true)
            expect(result.embedData?.embedUrl).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
        })
    })

    describe('Spotify', () => {
        it('should extract embed data for track URLs', () => {
            const result = parse('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT')

            expect(result.embedData).toBeDefined()
            expect(result.embedData?.platform).toBe('spotify')
            expect(result.embedData?.embedUrl).toBe('https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT')
        })
    })

    describe('SoundCloud', () => {
        it('should extract embed data for track URLs', () => {
            const result = parse('https://soundcloud.com/user/track-name')

            expect(result.embedData).toBeDefined()
            expect(result.embedData?.platform).toBe('soundcloud')
            expect(result.embedData?.embedUrl).toContain('w.soundcloud.com/player')
        })
    })

    describe('Twitter', () => {
        it('should extract embed data for tweet URLs', () => {
            const result = parse('https://twitter.com/user/status/1234567890')

            expect(result.embedData).toBeDefined()
            expect(result.embedData?.platform).toBe('twitter')
            expect(result.embedData?.type).toBe('iframe')
            expect(result.embedData?.embedUrl).toContain('twitframe.com/show?url=')
        })
    })

    describe('Instagram', () => {
        it('should extract embed data for post URLs', () => {
            const result = parse('https://www.instagram.com/p/ABC123/')

            expect(result.embedData).toBeDefined()
            expect(result.embedData?.platform).toBe('instagram')
            expect(result.embedData?.embedUrl).toBe('https://www.instagram.com/p/ABC123/embed/')
        })
    })

    describe('TikTok', () => {
        it('should extract embed data for video URLs', () => {
            const result = parse('https://www.tiktok.com/@username/video/1234567890')

            expect(result.embedData).toBeDefined()
            expect(result.embedData?.platform).toBe('tiktok')
            expect(result.embedData?.embedUrl).toBe('https://www.tiktok.com/embed/v2/1234567890')
        })
    })

    describe('Platforms without embed support', () => {
        it('should not have embedData for platforms that don\'t support embeds', () => {
            const githubResult = parse('https://github.com/username')
            expect(githubResult.embedData).toBeUndefined()

            const linkedinResult = parse('https://linkedin.com/in/username')
            expect(linkedinResult.embedData).toBeUndefined()
        })
    })
}) 