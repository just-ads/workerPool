import { run } from './run'
import { extend } from './utils'

const runStateSet = {
  NOT_STARTED: -1,
  RUNNING: 0,
  OVER: 1
}

const resultSet = {
  REJECTED: -1,
  PENDING: 0,
  RESOLVED: 1
}

const defaultOptions = {
  maxTaskNum: 3
}

function getUuid () {
  const len = 10
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  for (let i = 0; i < len; i++) {
    uuid[i] = chars[Math.random() * 10]
  }
  return uuid.join('')
}

export function TaskPool (options) {
  if (!options) options = {}
  extend(options, defaultOptions)
  this.maxTaskNum = options.maxTaskNum
  this._tasks = []
  this._runningWorker = 0
}

TaskPool.prototype.addTask = function (method, params, resolver) {
  if (!(method instanceof Function)) throw Error('method not a function')
  const id = 'task_' + getUuid()
  const task = {
    id,
    method,
    params,
    status: {
      runStatus: runStateSet.NOT_STARTED,
      resultStatus: resultSet.PENDING,
      remove: false
    },
    resolver
  }
  this._tasks.push(task)

  function cancel (reject) {
    this._removeTask = true
    const index = this._tasks.findIndex(task => task.id === id)
    if (index > -1) {
      const t = this._tasks[index]
      this._tasks.splice(index, 1)
      t.status.remove = true
    }
    this._removeTask = false
    reject('cancelled')
  }

  resolver.promise.cancel = cancel.bind(this, resolver.reject)
}

TaskPool.prototype.next = function () {
  if (this._tasks.length) {
    if (this._removeTask || this._runningWorker >= this.maxTaskNum) {
      // 一帧判断一次
      setTimeout(() => {
        this.next()
      }, 17)
      return
    }
    const task = this._tasks.shift()
    if (task.status.remove) return
    task.status.runStatus = runStateSet.RUNNING
    this._runningWorker++
    run(task.method, task.params, task.resolver).then(res => {
      task.resolver.resolve(res)
      task.status.resultStatus = resultSet.RESOLVED
    }).catch(err => {
      task.resolver.reject(err)
      task.status.resultStatus = resultSet.REJECTED
    }).then(() => {
      task.status.runStatus = runStateSet.OVER
      this._runningWorker--
    })
    if (this._tasks.length) {
      setTimeout(() => {
        this.next()
      })
    }
  }
}
