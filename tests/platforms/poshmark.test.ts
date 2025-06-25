import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Poshmark
const mod = registry.get(id)!

describe('Poshmark platform tests', () => {
    const samples = {
        closet: 'https://poshmark.com/closet/fashionista',
        listing: 'https://poshmark.com/listing/cute-dress-123456789',
    }

    describe('detection', () => {
        test('detect', () => {
            Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true))
        })
    })

    describe('parsing', () => {
        test('closet', () => {
            const r = parse(samples.closet)
            expect(r.isValid).toBe(true)
            expect(r.username).toBe('fashionista')
            expect(r.metadata.isCloset).toBe(true)
        })
        test('listing', () => {
            const r = parse(samples.listing)
            expect(r.isValid).toBe(true)
            expect(r.ids.listingId).toBe('123456789')
            expect(r.metadata.isListing).toBe(true)
        })
    })
}) 