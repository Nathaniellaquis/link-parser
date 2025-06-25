import { parse } from '../../src/utils/parse'
import { registry } from '../../src/utils/parse/platforms'
import { Platforms } from '../../src/utils/parse/core/types'

const id = Platforms.StackOverflow
const mod = registry.get(id)!

describe('StackOverflow platform tests', () => {
    const samples = {
        profile: 'https://stackoverflow.com/users/1234567/john-doe',
        profileNoSlug: 'https://stackoverflow.com/users/1234567',
        question: 'https://stackoverflow.com/questions/7654321/how-to-test',
        shortQuestion: 'https://stackoverflow.com/q/7654321'
    }

    describe('detect', () => {
        Object.values(samples).forEach(url => {
            test(url, () => {
                expect(mod.detect(url)).toBe(true)
            })
        })
    })

    describe('parse', () => {
        test('profile with slug', () => {
            const r = parse(samples.profile)
            expect(r.userId).toBe('1234567')
            expect(r.username).toBe('john-doe')
            expect(r.metadata.isProfile).toBe(true)
        })
        test('profile no slug', () => {
            const r = parse(samples.profileNoSlug)
            expect(r.userId).toBe('1234567')
            expect(r.username).toBeUndefined()
        })
        test('question', () => {
            const r = parse(samples.question)
            expect(r.ids.questionId).toBe('7654321')
            expect(r.metadata.isQuestion).toBe(true)
        })
        test('short question', () => {
            const r = parse(samples.shortQuestion)
            expect(r.ids.questionId).toBe('7654321')
        })
    })

    describe('builder', () => {
        test('profile builder', () => {
            expect(mod.buildProfileUrl('999')).toBe('https://stackoverflow.com/users/999')
        })
    })
}) 