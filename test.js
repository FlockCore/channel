var test = require('tape')
var FlockChannel = require('./index.js')
var crypto = require('crypto')

test('list', function (t) {
  var fchannel = FlockChannel({dht: false, dns: false})
  var id = crypto.randomBytes(32)

  fchannel.join(id)
  t.same(fchannel.list(), [{id: id, port: 0}])

  fchannel.leave(id)
  fchannel.join(id, 8080)
  t.same(fchannel.list(), [{id: id, port: 8080}])

  fchannel.leave(id)
  t.same(fchannel.list(), [{id: id, port: 8080}])

  fchannel.leave(id, 8080)
  t.same(fchannel.list(), [])

  fchannel.destroy()
  t.end()
})

test('find each other', function (t) {
  var id = crypto.randomBytes(32)
  var pending = 2
  t.plan(2)

  var fchannel1 = FlockChannel()
  var fchannel2 = FlockChannel()

  fchannel1.join(id, 1337)
  fchannel2.join(id, 7331)

  fchannel1.on('peer', function (hash, peer) {
    if (peer.port === 7331) {
      t.pass('found second Flock Channel')
      done()
    }
  })

  fchannel2.on('peer', function (hash, peer) {
    if (peer.port === 1337) {
      t.pass('found first Flock Channel')
      done()
    }
  })

  function done () {
    if (--pending) return
    fchannel1.destroy()
    fchannel2.destroy()
  }
})

test('join cb gets called', function (t) {
  var id = crypto.randomBytes(32)
  var fchannel1 = FlockChannel()
  fchannel1.join(id, 1337, function (err) {
    t.ifErr(err)
    t.ok('called cb')
    fchannel1.destroy()
    t.end()
  })
})
