import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.AppleMusic
const mod = registry.get(id)!

describe('Apple Music platform tests', () => {
    const samples = {
        artist: 'https://music.apple.com/us/artist/taylor-swift/159260351',
        album: 'https://music.apple.com/us/album/1989/1440913819',
        playlist: 'https://music.apple.com/us/playlist/office-hits/pl.u-12345',
    }

    test('detect', () => {
        Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true))
        expect(mod.detect('https://google.com')).toBe(false)
    })

    test('parse artist', () => {
        const r = parse(samples.artist)
        expect(r.isValid).toBe(true)
        expect(r.ids.artistId).toBe('159260351')
        expect(r.metadata.contentType).toBe('artist')
    })

    test('parse album', () => {
        const r = parse(samples.album)
        expect(r.isValid).toBe(true)
        expect(r.ids.albumId).toBe('1440913819')
        expect(r.metadata.isAlbum).toBe(true)
    })

    test('parse playlist', () => {
        const r = parse(samples.playlist)
        expect(r.isValid).toBe(true)
        expect(r.ids.playlistId).toContain('pl.')
        expect(r.metadata.isPlaylist).toBe(true)
    })

    test('builder', () => {
        const url = mod.buildProfileUrl('123456')
        expect(url).toBe('https://music.apple.com/us/artist/id123456')
    })
}) 