export default function fixJSON(obj) {
  const preParsedObj = JSON.parse(obj)
  const newObj = {}
  Object.keys(preParsedObj).map(key => {
    // match [] and {} Objects
    if(preParsedObj[key] && typeof preParsedObj[key] === 'string' && preParsedObj[key].match(/^(\[)/)) {
      newObj[key] = JSON.parse(preParsedObj[key].replace(/\\/g, ''))
    }
    else if(preParsedObj[key] && typeof preParsedObj[key] === 'string' && preParsedObj[key].match(/^(\{)/)) {
      newObj[key] = JSON.parse(preParsedObj[key])
    }
    // match numbers
    else if(preParsedObj[key] && typeof preParsedObj[key] === 'string' && preParsedObj[key].match(/^[\d]+/)) {
      newObj[key] = Number(JSON.parse(preParsedObj[key]))
    }
    // match null
    else if(preParsedObj[key] && typeof preParsedObj[key] === 'string' && preParsedObj[key].match(/^null$/)) {
      newObj[key] = null
    }
    // match empty string
    else if(preParsedObj[key] && typeof preParsedObj[key] === 'string' && preParsedObj[key].match(/^"(\s)?"$/)) {
      newObj[key] = ""
    }
    // match string
    else if(preParsedObj[key] && typeof preParsedObj[key] === 'string' && preParsedObj[key].match(/^"(.)+"$/)) {
      newObj[key] = String(preParsedObj[key].replace(/^"|"$/g, ''))
    }
    else { newObj[key] = preParsedObj[key] }
  })
  console.log('fixJSON returning', newObj)
  return newObj
}
