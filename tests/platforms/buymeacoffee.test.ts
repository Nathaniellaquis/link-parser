import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.BuyMeACoffee
const mod = registry.get(id)!

describe('BuyMeACoffee tests', () => {
    const profile = 'https://buymeacoffee.com/janeartist'
    const post = 'https://buymeacoffee.com/p/support-my-art'
    test('detect', () => {
        expect(mod.detect(profile)).toBe(true)
        expect(mod.detect(post)).toBe(true)
    })
    test('parse profile', () => {
        const r = parse(profile)
        expect(r.username).toBe('janeartist')
    })
    test('parse post', () => {
        const r = parse(post)
        expect(r.ids.postSlug).toBe('support-my-art')
    })
}) 