import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const mod = registry.get(Platforms.StripeLink)!

describe('Stripe payment link', () => {
    const good = 'https://buy.stripe.com/abcd1234'
    const badDomain = 'https://stripe.com/pay/abcd1234'
    const badCode = 'https://buy.stripe.com/short'

    test('detect', () => {
        expect(mod.detect(good)).toBe(true)
        expect(mod.detect(badDomain)).toBe(false)
        expect(mod.detect(badCode)).toBe(false)
    })

    test('parse code', () => {
        const r = parse(good)
        expect(r.ids.code).toBe('abcd1234')
    })
}) 