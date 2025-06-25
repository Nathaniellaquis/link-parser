import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Tidal
const mod = registry.get(id)!

describe('Tidal platform tests', () => {
    const samples = {
        artist: 'https://tidal.com/browse/artist/3221266',
        album: 'https://www.tidal.com/browse/album/137074121',
        track: 'https://tidal.com/browse/track/137074122',
        playlist: 'https://tidal.com/browse/playlist/5d4fbbaa-38bf-4c02-a3e8-7a30f4cf8aa5',
    }

    const invalid = [
        'https://tidal.com/browse/artist/',
        'https://tidal.com/artist/3221266',
        'https://example.com/browse/artist/322',
    ]

    test('detect positive', () => {
        Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true))
    })

    test('detect negatives', () => {
        invalid.forEach((u) => expect(mod.detect(u)).toBe(false))
    })

    test('parse artist', () => {
        const r = parse(samples.artist)
        expect(r.isValid).toBe(true)
        expect(r.ids.artistId).toBe('3221266')
        expect(r.metadata.isProfile).toBe(true)
    })

    test('parse album', () => {
        const r = parse(samples.album)
        expect(r.ids.albumId).toBe('137074121')
        expect(r.metadata.isAlbum).toBe(true)
    })

    test('parse track', () => {
        const r = parse(samples.track)
        expect(r.ids.trackId).toBe('137074122')
        expect(r.metadata.isSingle).toBe(true)
    })

    test('parse playlist', () => {
        const r = parse(samples.playlist)
        expect(r.ids.playlistId).toBe('5d4fbbaa-38bf-4c02-a3e8-7a30f4cf8aa5')
        expect(r.metadata.isPlaylist).toBe(true)
    })

    test('builder', () => {
        const url = mod.buildProfileUrl('999')
        expect(url).toBe('https://tidal.com/browse/artist/999')
    })
}) 