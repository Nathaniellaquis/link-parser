import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const mod = registry.get(Platforms.Rarible)!

describe('Rarible tests', () => {
    const token = 'https://rarible.com/token/ETHEREUM:0xabc123:12345'
    const user = 'https://rarible.com/user/0xabc123'
    test('detect', () => { expect(mod.detect(token)).toBe(true); expect(mod.detect(user)).toBe(true) })
    test('parse token', () => { const r = parse(token); expect(r.ids.contract).toBe('0xabc123'); expect(r.ids.tokenId).toBe('12345') })
}) 