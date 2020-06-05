const Service = require('./')
const Protocol = require('hypercore-protocol')

const p1 = new Protocol(true)

const a = new Service('peer-service', p1, {
  onrequest (command, value, from, reply) {
    console.log('got', command, value, 'from', from.remotePublicKey)
    reply(null, Buffer.from('ok'))
  }
})

const p2 = new Protocol(false)

const b = new Service('peer-service', p2, {
  onrequest (command, value, from, reply) {
    console.log('got', command, value, 'from', from.remotePublicKey)
    reply(null, Buffer.from('ok'))
  }
})

p1.pipe(p2).pipe(p1)

b.request('hello', Buffer.from('world'), function (err, reply) {
  console.log(err, reply)
})

a.request('hello', Buffer.from('world'), function (err, reply) {
  console.log(err, reply)
})
