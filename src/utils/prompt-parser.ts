export type PromptParsedData = {
  situation: string
  environment: string
  goal: string
  variants: {
    [el: string]: string
  }
}

const getTextBetween = (content: string, start: string, end: string) => {
  try {
    const regEx = new RegExp(`${start}[\\s\\S]*${end}`, "gim")
    const matches = content.match(regEx)

    if (!matches || matches.length === 0) return ""

    let result = matches[0].replace(end, "").trim()

    const endString = end.replace("\\", "")
    if (result.includes(endString)) result = result.replace(endString, "").trim()

    result = result.replace(/-+/g, "")

    return result
  } catch (e) {
    console.log("Can't get text", e)
    return ""
  }
}

export function parsePromptResponse(text: string): PromptParsedData {
  const situation = getTextBetween(text, "Current situation:", "Current environment:")
    .replace("Current situation:", "")
  const environment = getTextBetween(text, "Current environment:", "Current main goal of character:")
    .replace("Current environment:", "")
  const goal = getTextBetween(text, "Current main goal of character:", "A\\)")
    .replace("Current main goal of character:", "")

  const A = getTextBetween(text, "A\\)", "B\\)")
  const B = getTextBetween(text, "B\\)", "C\\)")
  const C = text.includes("C)") ? "C)" + text.split("C)")[1] : ""

  return {
    situation,
    environment,
    goal,
    variants: {
      A,
      B,
      C,
    }
  }
}
