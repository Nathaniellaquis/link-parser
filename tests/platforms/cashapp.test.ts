import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.CashApp
const mod = registry.get(id)!

describe('Cash App platform tests', () => {
    const samples = {
        profile: 'https://cash.app/$sampleuser',
        paymentPath: 'https://cash.app/$sampleuser/25',
        paymentQuery: 'https://cash.app/$sampleuser?amount=25',
    }

    describe('detection', () => {
        test('detect all valid URLs', () => {
            Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true))
        })
        test('reject non-platform URLs', () => {
            const bad = ['https://venmo.com/$user', 'https://example.com']
            bad.forEach((u) => expect(mod.detect(u)).toBe(false))
        })
    })

    describe('parsing', () => {
        test('profile', () => {
            const r = parse(samples.profile)
            expect(r.isValid).toBe(true)
            expect(r.username).toBe('sampleuser')
            expect(r.metadata.isProfile).toBe(true)
        })
        test('payment path', () => {
            const r = parse(samples.paymentPath)
            expect(r.isValid).toBe(true)
            expect(r.metadata.isPayment).toBe(true)
            expect(r.ids.amount).toBeUndefined() // path pattern doesn't capture amount detail
        })
        test('payment query', () => {
            const r = parse(samples.paymentQuery)
            expect(r.isValid).toBe(true)
            expect(r.metadata.isPayment).toBe(true)
            expect(r.ids.amount).toBe('25')
        })
        test('negative', () => {
            const bad = parse('https://cash.app/$a')
            expect(bad.isValid).toBe(false)
        })
    })

    describe('builder', () => {
        test('build profile', () => {
            const url = mod.buildProfileUrl('user')
            expect(url).toBe('https://cash.app/$user')
            expect(mod.detect(url)).toBe(true)
        })
    })
}) 