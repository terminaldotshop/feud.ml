export async function processResponse(promptResponse) {
  const msg = parse(promptResponse)
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
    return JSON.parse("{\"" + msg)
  } catch (e) {
    try {
      const parts = msg.split("\n")
      return JSON.parse(parts.slice(1, parts.length - 1).join("\n"))
    } catch (e) {
      return null
    }
  }
}


