var test = require('tape')
var FlockChannel = require('./index.js')
var crypto = require('crypto')

test('FlockCore Channel Tests: List', function (t) {
  var channel = FlockChannel({dht: false, dns: false})
  var id = crypto.randomBytes(32)

  channel.join(id)
  t.same(channel.list(), [{id: id, port: 0}])

  channel.leave(id)
  channel.join(id, 8080)
  t.same(channel.list(), [{id: id, port: 8080}])

  channel.leave(id)
  t.same(channel.list(), [{id: id, port: 8080}])

  channel.leave(id, 8080)
  t.same(channel.list(), [])

  channel.destroy()
  t.end()
})

test('FlockCore Channel Tests: Find Each Other', function (t) {
  var id = crypto.randomBytes(32)
  var pending = 2
  t.plan(2)

  var channel1 = FlockChannel()
  var channel2 = FlockChannel()

  channel1.join(id, 1337)
  channel2.join(id, 7331)

  channel1.on('peer', function (hash, peer) {
    if (peer.port === 7331) {
      t.pass('found second Flock Channel')
      done()
    }
  })

  channel2.on('peer', function (hash, peer) {
    if (peer.port === 1337) {
      t.pass('found first Flock Channel')
      done()
    }
  })

  function done () {
    if (--pending) return
    channel1.destroy()
    channel2.destroy()
  }
})

test('FlockCore Channel Tests: join cb Gets Called ', function (t) {
  var id = crypto.randomBytes(32)
  var channel1 = FlockChannel()
  channel1.join(id, 1337, function (err) {
    t.ifErr(err)
    t.ok('called cb')
    channel1.destroy()
    t.end()
  })
})
