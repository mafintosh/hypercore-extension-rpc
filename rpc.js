const { Request, Response } = require('./messages')

module.exports = class RPC {
  constructor (opts) {
    if (!opts) opts = {}

    this.inflight = []
    this.onrequest = (opts.onrequest || noop)
  }

  onrequestbuffer (buf, from, send) {
    let req

    try {
      req = Request.decode(buf)
    } catch (err) {
      return false
    }

    this.onrequest(req.command, req.value, from, respond)
    return true

    function respond (err, value) {
      if (!req.id) return

      const res = {
        id: req.id,
        error: err ? err.message : null,
        value
      }

      send(Response.encode(res), from)
    }
  }

  onresponsebuffer (buf) {
    let res

    try {
      res = Response.decode(buf)
    } catch (err) {
      return false
    }

    const req = this.inflight[res.id]
    if (!req) return false

    this.inflight[res.id - 1] = null

    const error = res.error ? new Error(res.error) : null
    const value = res.value

    req.callback(error, value, req)
    return true
  }

  request (command, value, callback = noop) {
    let id = this.inflight.indexOf(null)
    if (id === -1) id = this.inflight.push(null) - 1

    id++

    const req = {
      id,
      command,
      value,
      callback
    }

    this.inflight.push(req)
    return Request.encode(req)
  }
}

function noop () {}
