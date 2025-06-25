import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Matterport
const mod = registry.get(id)!

describe('Matterport tests', () => {
    const space = 'https://matterport.com/show/?m=ABC123'
    const user = 'https://matterport.com/users/999'
    test('detect', () => { expect(mod.detect(space)).toBe(true); expect(mod.detect(user)).toBe(true) })
    test('parse space', () => {
        const r = parse(space)
        expect(r.ids.modelId).toBe('ABC123')
        expect(r.metadata.isSpace).toBe(true)
    })
    test('parse user', () => {
        const r = parse(user)
        expect(r.ids.userId).toBe('999')
        expect(r.metadata.isUser).toBe(true)
    })
}) 