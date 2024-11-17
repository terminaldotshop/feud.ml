export async function processResponse(msg) {
  //const msg = parse(promptResponse)
  //try {
  //  console.log(JSON.parse(promptResponse))
  //} catch {
  //}

  const transformed = []
  for (const [k, v] of Object.entries(msg)) {
    transformed.push({
      text: k,
      values: v
    })
  }

  transformed.sort(function(a, b) {
    return b.values.length - a.values.length
  });

  return [transformed.slice(0, 8)];
}

function parse(msg) {
  msg = msg.replaceAll("\\", "_")
  try {
    console.log("parsing: ", "{\"" + msg)
    return JSON.parse("{\"" + msg)
  } catch (e) {
    try {
      return JSON.parse(msg)
    } catch (e) {
      console.log(e)
      try {
        const parts = msg.split("\n")
        return JSON.parse(parts.slice(1, parts.length - 1).join("\n"))
      } catch (e) {
        return null
      }
    }
  }
}


