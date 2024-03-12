import {MessageType} from "./Database"

type OpenAITextResponse = {
  "id": string
  "object": string
  "created": number
  "choices": Array<{
    "index": number
    "message": {
      "role": string
      "content": string
    },
    "finish_reason": string
  }>
  "usage": {
    "prompt_tokens": number
    "completion_tokens": number
    "total_tokens": number
  }
}

type OpenAIImageResponse = {
  "created": number
  "data": Array<{
    "b64_json": string
  }>
}

export default class AI {
  private static token = ""

  public static setToken(token: string): void {
    this.token = token
  }

  public static async getCompletion(messages: MessageType[]): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 2097,
        frequency_penalty: 2,
        temperature: 0.2
      })
    })

    const jsonData = (await response.json()) as OpenAITextResponse
    console.log("text", jsonData)
    return jsonData.choices[0].message.content.trim() ?? ""
  }

  public static async generateImage(prompt: string): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "512x512",
        response_format: "b64_json"
      })
    })

    const jsonData = (await response.json()) as OpenAIImageResponse
    console.log("image", jsonData)
    return jsonData.data.length > 0 ? `data:image/png;base64,${jsonData.data[0].b64_json}` : ""
  }
}
