import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.OpenSea
const mod = registry.get(id)!

describe('OpenSea tests', () => {
    const samples = {
        profile: 'https://opensea.io/artcollector',
        collection: 'https://opensea.io/collection/cool-nfts',
        asset: 'https://opensea.io/assets/ethereum/0x123abc/789',
    }
    test('detect', () => {
        Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true))
    })
    test('profile parse', () => {
        const r = parse(samples.profile)
        expect(r.username).toBe('artcollector')
        expect(r.metadata.isProfile).toBe(true)
    })
    test('collection parse', () => {
        const r = parse(samples.collection)
        expect(r.ids.collectionName).toBe('cool-nfts')
        expect(r.metadata.isCollection).toBe(true)
    })
    test('asset parse', () => {
        const r = parse(samples.asset)
        expect(r.ids.chain).toBe('ethereum')
        expect(r.ids.contract).toBe('0x123abc')
        expect(r.ids.tokenId).toBe('789')
        expect(r.metadata.isAsset).toBe(true)
    })
}) 