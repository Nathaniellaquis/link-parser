import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Etsy
const mod = registry.get(id)!

describe('Etsy platform tests', () => {
    const samples = {
        shop: 'https://www.etsy.com/shop/CoolCrafts',
        listing: 'https://www.etsy.com/listing/123456789/handmade-ring',
    }

    test('detect', () => {
        expect(mod.detect(samples.shop)).toBe(true)
        expect(mod.detect(samples.listing)).toBe(true)
    })

    test('parse shop', () => {
        const r = parse(samples.shop)
        expect(r.username).toBe('CoolCrafts')
        expect(r.metadata.isProfile).toBe(true)
    })

    test('parse listing', () => {
        const r = parse(samples.listing)
        expect(r.ids.listingId).toBe('123456789')
        expect(r.metadata.contentType).toBe('listing')
    })
}) 