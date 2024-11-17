export { };

declare global {
  type DaxAnswer = {
    values: string[]
    text: string
  }
  type ToDax = {
    type: "survey.closed"
    answers: DaxAnswer[][]
  }

  type GPTGroup = {
      category: string
      raw: string[]
    }
  type FromGPT = {
    values: GPTGroup[]
  }
}

