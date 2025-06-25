import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const mod = registry.get(Platforms.StockX)!

describe('StockX parser', () => {
    const good = 'https://stockx.com/nike-air-max'
    const bad = 'https://stockx.com/'

    test('detect', () => {
        expect(mod.detect(good)).toBe(true)
        expect(mod.detect(bad)).toBe(false)
    })

    test('parse slug', () => {
        const r = parse(good)
        expect(r.ids.productSlug).toBe('nike-air-max')
    })
}) 