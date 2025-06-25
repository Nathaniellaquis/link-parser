import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Venmo
const mod = registry.get(id)!

describe('Venmo platform tests', () => {
    const samples = {
        profile: 'https://venmo.com/sampleuser',
        payment: 'https://venmo.com/sampleuser?txn=pay',
        qr: 'https://venmo.com/code?user_id=123456789',
    }

    describe('detection', () => {
        test('should detect all Venmo URLs', () => {
            Object.values(samples).forEach((url) => {
                expect(mod.detect(url)).toBe(true)
            })
        })

        test('should not detect non-Venmo URLs', () => {
            const non = ['https://example.com', 'https://paypal.me/test', 'not-a-url']
            non.forEach((url) => expect(mod.detect(url)).toBe(false))
        })
    })

    describe('parsing', () => {
        test('should parse profile URL', () => {
            const r = parse(samples.profile)
            expect(r.isValid).toBe(true)
            expect(r.platform).toBe(id)
            expect(r.username).toBe('sampleuser')
            expect(r.metadata.isProfile).toBe(true)
        })

        test('should parse payment URL', () => {
            const r = parse(samples.payment)
            expect(r.isValid).toBe(true)
            expect(r.platform).toBe(id)
            expect(r.username).toBe('sampleuser')
            expect(r.metadata.isPayment).toBe(true)
        })

        test('should parse QR code URL', () => {
            const r = parse(samples.qr)
            expect(r.isValid).toBe(true)
            expect(r.platform).toBe(id)
            expect(r.ids.qrUserId).toBe('123456789')
            expect(r.metadata.isQr).toBe(true)
        })

        test('negative cases', () => {
            const bad = parse('https://venmo.com/ab') // too short
            expect(bad.isValid).toBe(false)
            expect(bad.username).toBeUndefined()
        })
    })

    describe('builder', () => {
        test('should build profile URL', () => {
            const url = mod.buildProfileUrl('testuser')
            expect(url).toBe('https://venmo.com/testuser')
            expect(mod.detect(url)).toBe(true)
        })
    })

    describe('normalization', () => {
        Object.values(samples).forEach((url) => {
            test(`normalize ${url}`, () => {
                const n = mod.normalizeUrl(url)
                expect(n.startsWith('https://')).toBe(true)
            })
        })
    })
}) 