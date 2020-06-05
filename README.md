# hypercore-extension-rpc

Simple extension message to implement a custom duplex RPC protocol

```
npm install hypercore-extension-rpc
```

## Usage

``` js
const Service = require('hypercore-extension-rpc')

const service = new Service('my-service', feedOrStream, {
  // called when the other side sends a request
  onrequest (command, value, from, reply) {
    console.log('got', command, value, 'from', from.remotePublicKey)
    reply(null, Buffer.from('reply payload'))
  }
})

service.request('test', Buffer.from('request payload'), function (err, replyPayload) {
  // called when the other side replys
})
```

## License

MIT
