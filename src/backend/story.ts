import path from "path"
import * as fs from "fs"

import {parsePromptResponse} from "../utils/prompt-parser"
import buildContinueQueryFromTemplate from "../utils/build-continue-query"

import AI from "./modules/AI"
import Database, {MessageType} from "./modules/Database"
import translate from "../utils/translate"

export type StoryResponse = Promise<{
  data: (
    {
      image: string
      situation: string
      environment: string
      goal: string
      variants: {
        [key: string]: string
      }
    } |
    {
      message: string
    }
    )
  code: number
}>

export const startNewStory = async (profile: string): StoryResponse => {
  try {
    const queryPath = path.join(__dirname, "../assets/queries", "start.txt")
    const startQuery = fs.readFileSync(queryPath, {encoding: "utf8", flag: "r"})

    const messages: MessageType[] = [
      {
        role: "user",
        content: startQuery
      }
    ]

    const {language} = Database.getSettings()
    const promptResponseText = await AI.getCompletion(messages)
    const parsedPrompt = parsePromptResponse(promptResponseText)
    const result = await translate(parsedPrompt, language)
    const image = await AI.generateImage(parsedPrompt.environment)

    messages.push({
      role: "assistant",
      content: promptResponseText,

      // Additional info
      image,
      parsedMessage: JSON.stringify({...result, image})
    })

    Database.addStoryMessages(profile, messages)
    return {data: {...result, image}, code: 200}
  }
  catch (error: any) {
    console.log("Error in new story", error?.message)

    return startNewStory(profile)
    // return {data: {message: error?.message ?? ""}, code: 500}
  }
}

export const continueStory = async ({profile, answer}: { profile: string, answer: string }): StoryResponse => {
  try {
    const queryPath = path.join(__dirname, "../assets/queries", "continue.txt")
    const template = fs.readFileSync(queryPath, {encoding: "utf8", flag: "r"})

    const userMessages = Database.getUserStoryMessages(profile)
    if (userMessages.length === 0) {
      console.log(JSON.stringify(userMessages))
      return {data: {message: "Can't get previous story!"}, code: 500}
    }

    const lastMessage = userMessages.at(-1) as MessageType

    const continueQuery = buildContinueQueryFromTemplate({
      template,
      lastAssistantAnswer: lastMessage?.content ?? "",
      userAnswer: answer
    })

    const messages: MessageType[] = [
      {
        role: "user",
        content: continueQuery
      }
    ]

    const mappedMessages = [lastMessage, ...messages].map(el => ({role: el.role, content: el.content}))

    const {language} = Database.getSettings()
    const promptResponseText = await AI.getCompletion(mappedMessages)
    const parsedPrompt = parsePromptResponse(promptResponseText)
    const result = await translate(parsedPrompt, language)
    const image = await AI.generateImage(parsedPrompt.environment)

    messages.push({
      role: "assistant",
      content: promptResponseText,

      // Additional info
      image,
      parsedMessage: JSON.stringify({...result, image})
    })

    Database.addStoryMessages(profile, messages)
    return {data: {...result, image}, code: 200}
  }
  catch (error: any) {
    console.log("Error in continue story", error?.message)

    return continueStory({profile, answer})
    // return {data: {message: error?.message ?? ""}, code: 500}
  }
}

export const resetStory = async (profile: string): Promise<{ message: string, code: number }> => {
  try {
    Database.resetStory(profile)
    return {code: 200, message: "Story was reset!"}
  }
  catch (error: any) {
    console.log("Error in reset story", error?.message)
    return {code: 500, message: error?.message ?? "Can't reset story!"}
  }
}
