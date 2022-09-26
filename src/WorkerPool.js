import { TaskPool } from './TaskPool'
import { argumentError, isValid, extend } from './utils'

const defaultOptions = {
  maxWorkers: 3
}

function deferPromise () {
  const resolver = {}
  resolver.promise = new Promise(function (resolve, reject) {
    resolver.resolve = resolve
    resolver.reject = reject
  })

  return resolver
}

export function WorkerPool (options) {
  if (!options) options = {}
  extend(options, defaultOptions)
  this._taskPool = new TaskPool({
    maxTaskNum: options.maxWorkers
  })
  this._workers = []
}

WorkerPool.prototype.addWorker = function (workers) {
  if (!Array.isArray(workers)) workers = [workers]
  // console.log({isValid, extend})
  if (!isValid(workers)('actionsArray')) {
    throw argumentError({
      expected: 'an array of objects',
      received: workers,
      extraInfo: 'Every action should be an object containing two fields:\n* message\n* func'
    })
  }
  for (let i = 0; i < workers.length; i++) {
    // const worker
    this._workers.push(workers[i])
  }
}

WorkerPool.prototype.removeWorker = function (name) {
  const validMessage = isValid(name)('string')
  if (!validMessage) return
  const index = this._workers.findIndex(w => w.message === name)
  if (index > -1) {
    this._workers.splice(index, 1)
  }
}

WorkerPool.prototype.run = function (msg, args) {
  const validMessage = isValid(msg)('string')
  const validArgs = isValid(args)(['array', 'undefined'])
  const resolver = deferPromise()
  if (validMessage && validArgs) {
    const work = this._workers
      .filter(({ message }) => JSON.stringify(message) === JSON.stringify(msg))
      .map(action => action.func)
      .pop()

    if (!work) {
      resolver.reject(`${msg} is not a registered action for this worker`)
    } else {
      this._taskPool.addTask(work, args, resolver)
      // 触发运行
      this._taskPool.next()
    }
  }

  if (!validMessage) resolver.reject(argumentError({ expected: 'a string', received: msg }))
  if (!validArgs) resolver.reject(argumentError({ expected: 'an array', received: args }))
  return resolver.promise
}
