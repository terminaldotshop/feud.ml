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
    messages: {
      twitch: number,
      audience: number,
    },
    state?: "open" | "closed"
    questions?: string[]
    prompt?: {
      prompts: string[]
      sent: boolean[]
    }
    responses?: (FromGPT | null)[]
    toDax?: {
      data: ToDax | null
      sent: boolean
      failReason: string
    }
  }

  type PromptedTrackingState = TrackingState & {
    prompt: {
      prompts: string[]
      sent: boolean[]
    }
  }

  type ResponsedTrackingState = TrackingState & {
    responses: (FromGPT | null)[]
  }

  type PartialAppState = {
    running: boolean
    currentIdx: number
    questions: string[]
  }

  type AppState = {
    tracking: TrackingState
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

