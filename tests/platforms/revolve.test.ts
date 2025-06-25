import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Revolve
const mod = registry.get(id)!

describe('Revolve tests', () => {
    const samples = {
        brand: 'https://revolve.com/brands/agolde',
        product: 'https://revolve.com/cool-dress/dp/123ABC',
    }
    test('detect', () => {
        Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true))
    })
    test('brand', () => {
        const r = parse(samples.brand)
        expect(r.username).toBe('agolde')
        expect(r.metadata.isBrand).toBe(true)
    })
    test('product', () => {
        const r = parse(samples.product)
        expect(r.ids.productCode).toBe('123ABC')
        expect(r.metadata.isProduct).toBe(true)
    })
}) 