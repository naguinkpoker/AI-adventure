const buildContinueQueryFromTemplate = (
  {template = "", lastAssistantAnswer = "", userAnswer = ""}:
  {template: string, lastAssistantAnswer: string, userAnswer: string}
): string => {

  const output = template
    .replace("PREVIOUS_OUTPUT", lastAssistantAnswer)
    .replace("USER_ANSWER", userAnswer) ?? ""

  return output.trim()
}

export default buildContinueQueryFromTemplate
