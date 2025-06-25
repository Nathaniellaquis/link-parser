import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.BitChute
const mod = registry.get(id)!

describe('BitChute platform tests', () => {
    const samples = {
        profile: 'https://www.bitchute.com/channel/NewsChannel/',
        video: 'https://www.bitchute.com/video/AbCdEfGhIJk/',
        embed: 'https://www.bitchute.com/embed/AbCdEfGhIJk/'
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
            expect(r.username).toBe('NewsChannel')
            expect(r.metadata.isProfile).toBe(true)
        })
        test('video', () => {
            const r = parse(samples.video)
            expect(r.ids.videoId).toBe('AbCdEfGhIJk')
            expect(r.metadata.isVideo).toBe(true)
        })
        test('embed', () => {
            const r = parse(samples.embed)
            expect(r.ids.videoId).toBe('AbCdEfGhIJk')
        })
    })

    describe('builders', () => {
        test('profile builder', () => {
            expect(mod.buildProfileUrl?.('AnotherChan')).toBe('https://www.bitchute.com/channel/AnotherChan')
        })
        test('video builder', () => {
            expect(mod.buildContentUrl?.('video', 'XYZ123')).toBe('https://www.bitchute.com/video/XYZ123')
        })
    })
}) 