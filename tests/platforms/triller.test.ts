import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Triller
const mod = registry.get(id)!

describe('Triller platform tests', () => {
    const samples = {
        profile: 'https://triller.co/@cooluser',
        video: 'https://triller.co/watch?v=abcDEF1234',
    }

    describe('detection', () => {
        test('detect valid URLs', () => {
            Object.values(samples).forEach((url) => expect(mod.detect(url)).toBe(true))
        })
        test('reject invalid', () => {
            const bad = ['https://example.com', 'https://triller.co/user']
            bad.forEach((u) => expect(mod.detect(u)).toBe(false))
        })
    })

    describe('parsing', () => {
        test('profile', () => {
            const r = parse(samples.profile)
            expect(r.isValid).toBe(true)
            expect(r.platform).toBe(id)
            expect(r.username).toBe('cooluser')
            expect(r.metadata.isProfile).toBe(true)
        })
        test('video', () => {
            const r = parse(samples.video)
            expect(r.isValid).toBe(true)
            expect(r.platform).toBe(id)
            expect(r.ids.videoId).toBe('abcDEF1234')
            expect(r.metadata.isVideo).toBe(true)
        })
    })

    describe('builder', () => {
        test('build profile', () => {
            const url = mod.buildProfileUrl('myuser')
            expect(url).toBe('https://triller.co/@myuser')
            expect(mod.detect(url)).toBe(true)
        })
        test('build video', () => {
            const url = mod.buildContentUrl!('video', 'xyz987')
            expect(url).toBe('https://triller.co/watch?v=xyz987')
        })
    })
}) 