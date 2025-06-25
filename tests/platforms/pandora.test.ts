import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Pandora
const mod = registry.get(id)!

describe('Pandora platform tests', () => {
    const samples = {
        artist: 'https://pandora.com/artist/the-beatles',
        podcast: 'https://pandora.com/podcast/my-awesome-podcast',
        station: 'https://pandora.com/station/play/123456',
    }

    describe('detection', () => {
        test('should detect valid Pandora URLs', () => {
            Object.values(samples).forEach((url) => expect(mod.detect(url)).toBe(true))
        })

        test('should not detect invalid URLs', () => {
            const bad = ['https://example.com', 'https://spotify.com/artist/abc']
            bad.forEach((url) => expect(mod.detect(url)).toBe(false))
        })
    })

    describe('parsing', () => {
        test('parse artist URL', () => {
            const r = parse(samples.artist)
            expect(r.isValid).toBe(true)
            expect(r.platform).toBe(id)
            expect(r.username).toBe('the-beatles')
            expect(r.metadata.isArtist).toBe(true)
        })

        test('parse podcast URL', () => {
            const r = parse(samples.podcast)
            expect(r.isValid).toBe(true)
            expect(r.platform).toBe(id)
            expect(r.username).toBe('my-awesome-podcast')
            expect(r.metadata.isPodcast).toBe(true)
        })

        test('parse station URL', () => {
            const r = parse(samples.station)
            expect(r.isValid).toBe(true)
            expect(r.platform).toBe(id)
            expect(r.ids.stationId).toBe('123456')
            expect(r.metadata.isStation).toBe(true)
        })
    })

    describe('builder', () => {
        test('build profile URL', () => {
            const url = mod.buildProfileUrl('cool-band')
            expect(url).toBe('https://pandora.com/artist/cool-band')
            expect(mod.detect(url)).toBe(true)
        })
    })
}) 