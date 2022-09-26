# SimpleWebWorkerPool
> This repository is a fork of [simple-web-worker](https://github.com/israelss/simple-web-worker). 
> An utility to simplify the use of web workers

Then:

```javascript
import SWorker from 'workerPool'
```
Obviously, you don't have to call it `SWorker`. You are free to use the name you want!

## API

### SWorker.run(_func, [args]?_)

> Where:
>* _func_ is the function to be runned in worker
>* _[args]_ is an optional array of arguments that will be used by _func_

>This method creates a disposable web worker, runs and returns the result of given function and closes the worker.
<br>
<br>This method works like Promise.resolve(), but in another thread.

E.g.:
```javascript
SWorker.run(() => 'SWorker run 1: Function in other thread')
  .then(console.log) // logs 'SWorker run 1: Function in other thread'
  .catch(console.error) // logs any possible error

SWorker.run((arg1, arg2) => `SWorker run 2: ${arg1} ${arg2}`, ['Another', 'function in other thread'])
    .then(console.log) // logs 'SWorker run 2: Another function in other thread'
    .catch(console.error) // logs any possible error
```

### SWorker.WorkerPool(_[options]?_)
options properties:

| property   | values | defaults |
|------------|--------|:--------:|
| maxWorkers | number |    3     |

E.g.:
```javascript
const workerPool = new WorkerPool({
  maxWorkers: 5
})
```

### <workerPool\>.addWorker({message, func}|Array.{message, func})
E.g.:
```javascript
const workerPool = new WorkerPool()
const workers = [
  { message: 'func1', func: () => `Worker 1: Working on func1` },
  { message: 'func2', func: arg => `Worker 2: ${arg}` },
  { message: 'func3', func: arg => `Worker 3: ${arg}` },
  { message: 'func4', func: (arg = 'Working on func4') => `Worker 4: ${arg}` }
]

workerPool.addWorker(workers)
```

### <workerPool\>.run(message, [args]?)
```javascript
const workerPool = new WorkerPool()
const workers = [
  { message: 'func1', func: () => `Worker 1: Working on func1` },
  { message: 'func2', func: arg => `Worker 2: ${arg}` },
  { message: 'func3', func: arg => `Worker 3: ${arg}` },
  { message: 'func4', func: (arg = 'Working on func4') => `Worker 4: ${arg}` }
]

workerPool.addWorker(workers)
workerPool.run('func1').then(res => {
  
}).catch(err => {
  
})

workerPool.run('func2', ['Working on func2']).then(res => {
  //logs 'Worker 2: Working on func2'
}).catch(err => {

})

// 取消运行的worker
const promise = workerPool.run('func3');
// 取消
promise.cancel()

```
### <workerPool\>.removeWorker(name)
