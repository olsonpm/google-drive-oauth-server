export default something => {
  return typeof something === 'string'
    ? something
    : '' + JSON.stringify(something, createReplacer(), 2)
}

function createReplacer() {
  const duplicateObjects = new Map()

  return (key, value) => {
    if (value && typeof value === 'object') {
      if (duplicateObjects.has(value)) {
        return `<duplicate of '${duplicateObjects.get(value)}'>`
      } else {
        duplicateObjects.set(value, key)
        return value
      }
    }
    return typeof value === 'function' ? '<function>' : value
  }
}
