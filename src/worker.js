var intervalIds = {}
// eslint-disable-next-line no-restricted-globals
self.onmessage = function(e) {
    // eslint-disable-next-line default-case
    switch (e.data.command) {
        case 'interval:start':
            var intvalId = setInterval(function() {
                postMessage({
                    message: 'interval:tick',
                    id: e.data.id
                })
            }, e.data.interval)
            postMessage({
                message: 'interval:started',
                id: e.data.id
            })
            intervalIds[e.data.id] = intvalId
            break
        case 'interval:clear':
            clearInterval(intervalIds[e.data.id])
            postMessage({
                message: 'interval:cleared',
                id: e.data.id
            })
            delete intervalIds[e.data.id]
            break
    }
}

var worker = new Worker('timer-worker.js')
export const workerTimer = {
    id: 0,
    callbacks: {},
    setInterval: function(cb, interval, context) {
        this.id++
        var id = this.id
        this.callbacks[id] = { fn: cb, context: context }
        worker.postMessage({
            command: 'interval:start',
            interval: interval,
            id: id
        })
        return id
    },
    onMessage: function(e) {
        // eslint-disable-next-line default-case
        switch (e.data.message) {
            case 'interval:tick':
                var callback = this.callbacks[e.data.id]
                if (callback && callback.fn) callback.fn.apply(callback.context)
                break
            case 'interval:cleared':
                delete this.callbacks[e.data.id]
                break
        }
    },
    clearInterval: function(id) {
        worker.postMessage({ command: 'interval:clear', id: id })
    }
}
worker.onmessage = workerTimer.onMessage.bind(workerTimer)