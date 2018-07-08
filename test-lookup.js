var FlockChannel = require('./index.js')
var bufferFrom = require('buffer-from')

var channel = FlockChannel({
  dns: {
    servers: [
      'revelation1.dwebs.io:6620',
      'revelation2.dwebs.io:6620'
    ]
  }
})

var hash = bufferFrom('deadbeefbeefbeefbeefdeadbeefbeefbeefbeef', 'hex')

channel.join(hash)
channel.on('peer', function (hash, peer, type) {
  console.log('found peer: ' + peer.host + ':' + peer.port + ' using ' + type + (peer.local ? ' (local)' : ''))
})
