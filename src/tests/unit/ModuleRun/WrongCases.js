/* global test, describe, expect, jest */

export default (run, externalModule) => {
  describe('run - Wrong use cases\n  Run:', () => {
    describe('Logs an error when', () => {
      describe('work is', () => {
        test('a string', () => {
          const error = new TypeError(`You should provide a function\n\nReceived: "Run with string"`)
          const spy = console.error = jest.fn()
          run('Run with string').catch(err => {
            expect(err).toBe('parameter error')
            expect(spy).toHaveBeenCalledWith(error)
            expect(spy).toHaveBeenCalledTimes(1)
            spy.mockRestore()
          })
        })
        test('an object', () => {
          const error = new TypeError(`You should provide a function\n\nReceived: {"work":"Run with object"}`)
          const spy = console.error = jest.fn()
          run({work: 'Run with object'}).catch(err => {
            expect(err).toBe('parameter error')
            expect(spy).toHaveBeenCalledWith(error)
            expect(spy).toHaveBeenCalledTimes(1)
            spy.mockRestore()
          })
          // expect(spy).toHaveBeenCalledWith(error)
          // expect(spy).toHaveBeenCalledTimes(1)
          // return spy.mockRestore()
        })
        test('undefined', () => {
          const error = new TypeError(`You should provide a function\n\nReceived: null`)
          const spy = console.error = jest.fn()
          run().catch(err => {
            expect(err).toBe('parameter error')
            expect(spy).toHaveBeenCalledWith(error)
            expect(spy).toHaveBeenCalledTimes(1)
            spy.mockRestore()
          })
        })
        test('null', () => {
          const error = new TypeError(`You should provide a function\n\nReceived: null`)
          const spy = console.error = jest.fn()
          run(null).catch(err => {
            expect(err).toBe('parameter error')
            expect(spy).toHaveBeenCalledWith(error)
            expect(spy).toHaveBeenCalledTimes(1)
            spy.mockRestore()
          })
        })
      })

      describe('args is', () => {
        test('a string', () => {
          const error = new TypeError(`You should provide an array\n\nReceived: "undefined"`)
          const spy = console.error = jest.fn()
          run((arg1) => `Run with ${arg1}`, 'undefined').catch(err => {
            expect(err).toBe('parameter error')
            expect(spy).toHaveBeenCalledWith(error)
            expect(spy).toHaveBeenCalledTimes(1)
            spy.mockRestore()
          })
        })
        test('an object', () => {
          const error = new TypeError(`You should provide an array\n\nReceived: {"arg1":"undefined"}`)
          const spy = console.error = jest.fn()
          run((arg1) => `Run with ${arg1}`, {arg1: 'undefined'}).catch(err => {
            expect(err).toBe('parameter error')
            expect(spy).toHaveBeenCalledWith(error)
            expect(spy).toHaveBeenCalledTimes(1)
            spy.mockRestore()
          })
        })
        test('null', () => {
          const error = new TypeError(`You should provide an array\n\nReceived: null`)
          const spy = console.error = jest.fn()
          run((arg1) => `Run with ${arg1}`, null).catch(err => {
            expect(err).toBe('parameter error')
            expect(spy).toHaveBeenCalledWith(error)
            expect(spy).toHaveBeenCalledTimes(1)
            spy.mockRestore()
          })
        })
      })
    })

    describe('Doesn\'t calls `createDisposableWorker` when', () => {
      describe('work is', () => {
        test('a string', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

        test('an object', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

        test('undefined', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

        test('null', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())
      })

      describe('args is', () => {
        test('a string', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

        test('an object', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())

        test('null', () =>
          expect(externalModule.createDisposableWorker).not.toHaveBeenCalled())
      })
    })
  })
}
