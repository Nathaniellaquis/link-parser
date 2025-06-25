import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Beatport
const mod = registry.get(id)!

describe('Beatport platform tests', () => {
    const samples = {
        profile: 'https://www.beatport.com/artist/awesome-dj/12345',
        track: 'https://www.beatport.com/track/epic-bass/987654',
        release: 'https://www.beatport.com/release/cool-ep/654321',
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
            expect(r.username).toBe('awesome-dj')
            expect(r.userId).toBe('12345')
            expect(r.metadata.isProfile).toBe(true)
        })
        test('track', () => {
            const r = parse(samples.track)
            expect(r.ids.trackId).toBe('987654')
            expect(r.metadata.contentType).toBe('track')
        })
        test('release', () => {
            const r = parse(samples.release)
            expect(r.ids.releaseId).toBe('654321')
            expect(r.metadata.contentType).toBe('release')
        })
    })

    describe('builders', () => {
        test('profile builder', () => {
            expect(mod.buildProfileUrl?.('cool-artist')).toBe('https://www.beatport.com/artist/cool-artist')
        })
    })
}) 