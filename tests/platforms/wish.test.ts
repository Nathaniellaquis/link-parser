import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const mod = registry.get(Platforms.Wish)!

describe('Wish product links', () => {
    const good = 'https://www.wish.com/product/5e2f7ec4eb8ac75bf1533e4a'
    const notProduct = 'https://www.wish.com/c/5e2f7ec4eb8ac75bf1533e4a'
    const badId = 'https://www.wish.com/product/notanid'

    test('detect', () => {
        expect(mod.detect(good)).toBe(true)
        expect(mod.detect(notProduct)).toBe(false)
        expect(mod.detect(badId)).toBe(false)
    })

    test('parse productId', () => {
        const r = parse(good)
        expect(r.ids.productId).toBe('5e2f7ec4eb8ac75bf1533e4a')
    })
}) 