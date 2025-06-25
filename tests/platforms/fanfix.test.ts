import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Fanfix
const mod = registry.get(id)!

describe('Fanfix tests', () => {
    const samples = {
        profile: 'https://fanfix.io/@creator',
        post: 'https://fanfix.io/post/12345',
    }
    test('detect', () => {
        Object.values(samples).forEach(u => expect(mod.detect(u)).toBe(true))
    })
    test('profile', () => {
        const r = parse(samples.profile)
        expect(r.username).toBe('creator')
        expect(r.metadata.isProfile).toBe(true)
    })
    test('post', () => {
        const r = parse(samples.post)
        expect(r.ids.postId).toBe('12345')
        expect(r.metadata.isPost).toBe(true)
    })
}) 