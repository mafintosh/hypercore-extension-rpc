const RPC = require('./rpc')

module.exports = class Service {
  constructor (name, target, opts = {}) {
    const rpc = this.rpc = new RPC(opts)

    this.target = target
    this.name = name

    this.outbox = this.target.registerExtension(name + '/outbox', {
      onmessage (buf) {
        rpc.onresponsebuffer(buf)
      }
    })

    const reply = this.outbox.send.bind(this.outbox)
    this.inbox = this.target.registerExtension(name + '/inbox', {
      onmessage (buf, from) {
        rpc.onrequestbuffer(buf, from || target, reply)
      }
    })
  }

  request (command, value, cb) {
    this.inbox.send(this.rpc.request(command, value, cb || undefined))
  }
}
