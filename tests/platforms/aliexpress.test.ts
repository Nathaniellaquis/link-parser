import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const mod = registry.get(Platforms.AliExpress)!

describe('AliExpress parser', () => {
    const good = 'https://www.aliexpress.com/item/1005003390123456.html'
    const good2 = 'https://www.aliexpress.com/i/1005003390123456'
    const badDomain = 'https://example.com/item/1005003390123456.html'
    const badFormat = 'https://www.aliexpress.com/item/abc.html'

    test('detect success', () => {
        expect(mod.detect(good)).toBe(true)
        expect(mod.detect(good2)).toBe(true)
    })

    test('detect failure', () => {
        expect(mod.detect(badDomain)).toBe(false)
        expect(mod.detect(badFormat)).toBe(false)
    })

    test('parse product id', () => {
        const r = parse(good)
        expect(r.ids.productId).toBe('1005003390123456')
        expect(r.metadata.contentType).toBe('product')
    })
}) 