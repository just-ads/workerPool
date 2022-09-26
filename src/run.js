import { argumentError, isValid, makeResponse } from './utils'
import { createDisposableWorker } from './createDisposableWorker'

export const run = (work = null, args, resolver) => {
  const validWork = isValid(work)('function')
  const validArgs = isValid(args)(['array', 'undefined'])
  return new Promise((resolve, reject) => {
    if (validWork && validArgs) {
      const worker = createDisposableWorker(makeResponse(work))
      if (resolver) {
        resolver.promise.cancel = function () {
          worker.cancel()
          // eslint-disable-next-line
          reject('cancelled')
        }
      }
      // cancel func need so
      worker.post({ args }).then(r => {
        resolve(r)
      }).catch(err => {
        reject(err)
      })
    } else {
      if (!validWork) console.error(argumentError({ expected: 'a function', received: work }))
      if (!validArgs) console.error(argumentError({ expected: 'an array', received: args }))
      // eslint-disable-next-line
      reject('parameter error')
    }
  })
}
