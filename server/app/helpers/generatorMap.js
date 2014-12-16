function * map (array, fn, context) {
  var i = 0
  var length = array.length

  for (;i < length; i++) {
    var result = yield * fn.call(context, array[i], i, array)
    array[i] = result
  }
}

module.exports = map
