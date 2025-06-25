import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.MediaKits
const mod = registry.get(id)!

describe('MediaKits tests', () => {
    const url = 'https://mediakits.com/jane'
    test('detect', () => { expect(mod.detect(url)).toBe(true) })
    test('parse', () => {
        const r = parse(url)
        expect(r.username).toBe('jane')
        expect(r.metadata.isProfile).toBe(true)
    })
}) 