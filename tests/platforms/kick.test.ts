import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Kick
const mod = registry.get(id)!

describe('Kick platform tests', () => {
    const samples = {
        profile: 'https://kick.com/gamer123',
        video: 'https://kick.com/video/123456',
    }

    describe('detect', () => {
        Object.values(samples).forEach(url => {
            test(url, () => {
                expect(mod.detect(url)).toBe(true)
            })
        })
    })

    describe('parse', () => {
        test('profile', () => {
            const r = parse(samples.profile)
            expect(r.username).toBe('gamer123')
            expect(r.metadata.isProfile).toBe(true)
        })
        test('video', () => {
            const r = parse(samples.video)
            expect(r.ids.videoId).toBe('123456')
            expect(r.metadata.isVideo).toBe(true)
        })
    })

    describe('builders', () => {
        test('profile builder', () => {
            expect(mod.buildProfileUrl?.('streamer')).toBe('https://kick.com/streamer')
        })
        test('video builder', () => {
            expect(mod.buildContentUrl?.('video', '654321')).toBe('https://kick.com/video/654321')
        })
    })
}) 