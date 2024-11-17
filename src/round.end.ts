export function processResponse(msg: FromGPT[]): ToDax {

  const out: ToDax = {
    type: "survey.closed",
    answers: []
  }

  for (let i = 0; i < msg.length; ++i) {
    const gpt = msg[i];
    const round = gpt.values.map(x => ({
      text: x.category,
      values: x.raw,
    }))
    round.sort(function(a, b) {
      return b.values.length - a.values.length
    })
    out.answers.push(round)
  }

  return out
}

