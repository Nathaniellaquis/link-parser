import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.VSCO
const mod = registry.get(id)!

describe('VSCO platform tests', () => {
    const samples = {
        profile: 'https://vsco.co/photog123',
        image: 'https://vsco.co/photog123/media/654321',
    }

    describe('detection', () => {
        test('detect', () => {
            Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true))
        })
        test('reject invalid', () => {
            const bad = ['https://example.com', 'https://vsco.co/media/123']
            bad.forEach((u) => expect(mod.detect(u)).toBe(false))
        })
    })

    describe('parsing', () => {
        test('profile', () => {
            const r = parse(samples.profile)
            expect(r.isValid).toBe(true)
            expect(r.username).toBe('photog123')
            expect(r.metadata.isProfile).toBe(true)
        })
        test('image', () => {
            const r = parse(samples.image)
            expect(r.isValid).toBe(true)
            expect(r.ids.imageId).toBe('654321')
            expect(r.metadata.isImage).toBe(true)
        })
    })

    describe('builder', () => {
        test('profile builder', () => {
            const url = mod.buildProfileUrl('snap')
            expect(url).toBe('https://vsco.co/snap')
            expect(mod.detect(url)).toBe(true)
        })
    })
}) 