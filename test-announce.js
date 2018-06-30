var FlockChannel = require('./index.js')
var bufferFrom = require('buffer-from')

var fchannel = FlockChannel({
  dns: {
    servers: [
      'revelation1.dwebs.io',
      'revelation2.dwebs.io',
      'revelation3.dwebs.io',
      'revelation4.dwebs.io',
      'revelation5.dwebs.io',
      'revelation6.dwebs.io',
      'revelation7.dwebs.io'
    ]
  }
})

var hash = bufferFrom('deadbeefbeefbeefbeefdeadbeefbeefbeefbeef', 'hex')

fchannel.on('whoami', function (me) {
  console.log('I am ' + me.host + (me.port ? ':' + me.port : '') + ' on the internet')
})

fchannel.join(hash, Number(process.argv[2] || 1337))
