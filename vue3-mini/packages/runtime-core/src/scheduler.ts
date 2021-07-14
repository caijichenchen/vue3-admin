const queue = []
export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job)
    queusFinish()
  }
}

let isFinishPending = false
function queusFinish() {
  if (!isFinishPending) {
    isFinishPending = true
    Promise.resolve().then(flushJobs)
  }
}

function flushJobs() {
  isFinishPending = false
  // 需要根据父子顺序依次刷新，保证先刷新父再刷新子
  for (let i = 0; i < queue.length; i++) {
    const job = queue[i]
    job()
    console.log(job)
  }
  queue.length = 0
}
