import {
  isObject,
  isPlainObject,
  isEmptyObject,
  isOnlyOneTruthy,
  urlEncode,
  uuid4
} from '../src/helper'

test('isObject', () => {
  expect(isObject(null)).toEqual(false)
  expect(isObject(null)).toEqual(false)
})

test('isPlainObject', () => {
  expect(isPlainObject({})).toEqual(true)
  expect(isPlainObject({ a: '1' })).toEqual(true)
  expect(isPlainObject(null)).toEqual(false)
})

test('isEmptyObject', () => {
  expect(isEmptyObject(null)).toEqual(false)
  expect(isEmptyObject({})).toEqual(true)
  expect(isEmptyObject({ a: 1 })).toEqual(false)
})

test('isOnlyOneTruthy', () => {
  expect(isOnlyOneTruthy(true, true)).toEqual(false)
  expect(isOnlyOneTruthy(true, false)).toEqual(true)
  expect(isOnlyOneTruthy(false, false)).toEqual(false)
})

test('urlEncode', () => {
  expect(urlEncode({
    a: 1,
    b: 2
  })).toEqual('a=1&b=2')

  const d1 = {
    a: { name: 'mike' },
    b: [1, 3, 4]
  }
  const result = 'a=%5Bobject%20Object%5D&b=1%2C3%2C4'
  expect(urlEncode(d1)).toEqual(result)
})

test('uuid', () => {
  console.log(uuid4())
})
