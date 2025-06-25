import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Bandcamp
const mod = registry.get(id)!

describe('Bandcamp platform tests', () => {
    const samples = {
        profile: 'https://artistname.bandcamp.com',
        album: 'https://artistname.bandcamp.com/album/great-album',
        track: 'https://artistname.bandcamp.com/track/cool-track',
    }

    const invalid = [
        'https://bandcamp.com/artistname',
        'https://artistname.bandcamp.com/notreal/slug',
        'https://example.com/artistname.bandcamp.com',
    ]

    test('detect positives', () => {
        Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true))
    })

    test('detect negatives', () => {
        invalid.forEach((u) => expect(mod.detect(u)).toBe(false))
    })

    test('parse profile', () => {
        const r = parse(samples.profile)
        expect(r.isValid).toBe(true)
        expect(r.username).toBe('artistname')
        expect(r.metadata.isProfile).toBe(true)
    })

    test('parse album', () => {
        const r = parse(samples.album)
        expect(r.ids.albumSlug).toBe('great-album')
        expect(r.metadata.isAlbum).toBe(true)
    })

    test('parse track', () => {
        const r = parse(samples.track)
        expect(r.ids.trackSlug).toBe('cool-track')
        expect(r.metadata.isSingle).toBe(true)
    })

    test('builder', () => {
        const url = mod.buildProfileUrl('newartist')
        expect(url).toBe('https://newartist.bandcamp.com')
    })
}) 