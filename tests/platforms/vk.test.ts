import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.VKontakte
const mod = registry.get(id)!

describe('VK platform tests', () => {
    const samples = {
        usernameProfile: 'https://vk.com/sample_user',
        numericProfile: 'https://vk.com/id12345678',
        post: 'https://vk.com/wall-12345_67890',
        postQuery: 'https://vk.com/sample_user?w=wall-12345_67890'
    }

    describe('detect', () => {
        Object.values(samples).forEach(url => {
            test(`detect ${url}`, () => {
                expect(mod.detect(url)).toBe(true)
            })
        })
    })

    describe('parse', () => {
        test('username profile', () => {
            const r = parse(samples.usernameProfile)
            expect(r.isValid).toBe(true)
            expect(r.username).toBe('sample_user')
            expect(r.metadata.isProfile).toBe(true)
        })

        test('numeric profile', () => {
            const r = parse(samples.numericProfile)
            expect(r.isValid).toBe(true)
            expect(r.username).toBe('id12345678')
        })

        test('post', () => {
            const r = parse(samples.post)
            expect(r.ids.postId).toBe('wall-12345_67890')
            expect(r.metadata.isPost).toBe(true)
        })

        test('post query', () => {
            const r = parse(samples.postQuery)
            expect(r.ids.postId).toBe('wall-12345_67890')
            expect(r.metadata.isPost).toBe(true)
        })
    })

    describe('builder', () => {
        test('build profile', () => {
            const url = mod.buildProfileUrl('id999')
            expect(url).toBe('https://vk.com/id999')
        })
    })
}) 