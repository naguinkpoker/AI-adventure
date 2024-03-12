import {PromptParsedData} from "./prompt-parser"
import freeTranslate from "google-translate-api-x"

const translateText = async (text: string, lang: string): Promise<string> => {
  try {
    return (
      await freeTranslate(text, {
        to: lang,
        forceBatch: false,
        rejectOnPartialFail: false
      })
    ).text
  }
  catch (e) {
    console.log("Problems in translate: ", e)
    return await translateText(text, lang)
  }
}

const translate = async (parsedPrompt: PromptParsedData, lang: string) => {
  if (lang === "en") return parsedPrompt

  return {
    situation: await translateText(parsedPrompt.situation, lang),
    environment: await translateText(parsedPrompt.environment, lang),
    goal: await translateText(parsedPrompt.goal, lang),
    variants: {
      A: await translateText(parsedPrompt.variants.A, lang),
      B: await translateText(parsedPrompt.variants.B, lang),
      C: await translateText(parsedPrompt.variants.C, lang)
    }
  }
}

export default translate
