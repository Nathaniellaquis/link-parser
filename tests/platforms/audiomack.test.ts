import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Audiomack
const mod = registry.get(id)!

describe('Audiomack platform tests', () => {
    const samples = {
        profile: 'https://audiomack.com/artist123',
        song: 'https://audiomack.com/artist123/song/my-hit-single',
        album: 'https://audiomack.com/artist123/album/best-album',
    }

    const invalid = [
        'https://audiomack.com/',
        'https://audiomack.com/artist123/random/slug',
        'https://example.com/artist123/song/my-hit-single',
    ]

    test('detect positives', () => {
        Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true))
    })

    test('detect negatives', () => {
        invalid.forEach((u) => expect(mod.detect(u)).toBe(false))
    })

    test('parse profile', () => {
        const r = parse(samples.profile)
        expect(r.username).toBe('artist123')
        expect(r.metadata.isProfile).toBe(true)
    })

    test('parse song', () => {
        const r = parse(samples.song)
        expect(r.ids.trackSlug).toBe('my-hit-single')
        expect(r.metadata.isSingle).toBe(true)
    })

    test('parse album', () => {
        const r = parse(samples.album)
        expect(r.ids.albumSlug).toBe('best-album')
        expect(r.metadata.isAlbum).toBe(true)
    })

    test('builder', () => {
        const url = mod.buildProfileUrl('newartist')
        expect(url).toBe('https://audiomack.com/newartist')
    })
}) 