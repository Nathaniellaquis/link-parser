import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.BiliBili
const mod = registry.get(id)!

describe('BiliBili platform tests', () => {
    const samples = {
        profile: 'https://space.bilibili.com/123456',
        videoBV: 'https://www.bilibili.com/video/BV1Ex411c7Nq',
        videoAv: 'https://m.bilibili.com/video/av170001'
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
            expect(r.userId).toBe('123456')
            expect(r.metadata.isProfile).toBe(true)
        })
        test('video BV', () => {
            const r = parse(samples.videoBV)
            expect(r.ids.videoId).toBe('BV1Ex411c7Nq')
            expect(r.metadata.isVideo).toBe(true)
        })
        test('video av', () => {
            const r = parse(samples.videoAv)
            expect(r.ids.videoId).toBe('av170001')
        })
    })

    describe('builders', () => {
        test('profile builder', () => {
            expect(mod.buildProfileUrl?.('789')).toBe('https://space.bilibili.com/789')
        })
        test('video builder BV', () => {
            expect(mod.buildContentUrl?.('video', 'BV1234567890')).toBe('https://www.bilibili.com/video/BV1234567890')
        })
    })
}) 