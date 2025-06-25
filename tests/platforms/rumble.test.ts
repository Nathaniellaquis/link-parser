import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.Rumble
const mod = registry.get(id)!

describe('Rumble platform tests', () => {
    const samples = {
        video: 'https://rumble.com/v2fhp2-example-video-title-x7tgczq.html',
        profileC: 'https://rumble.com/c/ChannelName',
        profileUser: 'https://rumble.com/user/ChannelName',
    }

    const invalid = [
        'https://rumble.com/',
        'https://example.com/v2fhp2-example-video.html',
    ]

    test('detect positives', () => {
        Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true))
    })

    test('detect negatives', () => {
        invalid.forEach((u) => expect(mod.detect(u)).toBe(false))
    })

    test('parse video', () => {
        const r = parse(samples.video)
        expect(r.ids.videoId).toBe('v2fhp2')
        expect(r.metadata.isVideo).toBe(true)
    })

    test('parse profile', () => {
        const r = parse(samples.profileC)
        expect(r.username).toBe('ChannelName')
        expect(r.metadata.isProfile).toBe(true)
    })

    test('builder', () => {
        const url = mod.buildProfileUrl('mychannel')
        expect(url).toBe('https://rumble.com/c/mychannel')
    })
}) 