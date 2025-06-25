import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Flickr
const mod = registry.get(id)!

describe('Flickr platform tests', () => {
    const samples = {
        profile: 'https://www.flickr.com/photos/coolshooter/',
        photo: 'https://www.flickr.com/photos/coolshooter/52345678901/',
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
            expect(r.username).toBe('coolshooter')
            expect(r.metadata.isProfile).toBe(true)
        })
        test('photo', () => {
            const r = parse(samples.photo)
            expect(r.ids.photoId).toBe('52345678901')
            expect(r.metadata.isPhoto).toBe(true)
        })
    })

    describe('builders', () => {
        test('profile builder', () => {
            expect(mod.buildProfileUrl?.('snapster')).toBe('https://www.flickr.com/photos/snapster')
        })
        test('photo builder', () => {
            expect(mod.buildContentUrl?.('photo', '1357911')).toBe('https://www.flickr.com/photos/me/1357911')
        })
    })
}) 