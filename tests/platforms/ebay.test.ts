import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.EBay
const mod = registry.get(id)!

describe('eBay platform tests', () => {
    const samples = {
        item: 'https://www.ebay.com/itm/123456789012',
    }

    test('detect', () => {
        expect(mod.detect(samples.item)).toBe(true)
    })

    test('parse item', () => {
        const r = parse(samples.item)
        expect(r.ids.itemId).toBe('123456789012')
    })
}) 