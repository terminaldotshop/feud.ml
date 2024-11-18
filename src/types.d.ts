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

  type TrackingState = {
    questions?: string[]
    prompt?: {
      prompts: string[]
      sent: boolean[]
    }
    responses?: string[]
    toDax?: {
      data: ToDax
      sent: boolean
    }
  }

  type AppState = {
    tracking?: TrackingState
    running: boolean
    currentIdx: number
    questions: string[]
  }

  type SurveyOpen = {
    type: "survey.opened"
    questions: string[]
  }

  type DaxMessage = SurveyOpen
}

