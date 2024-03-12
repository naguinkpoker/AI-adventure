import loki from "lokijs"

export type MessageType = {
  role: string
  content: string
  name?: string
  image?: string
  parsedMessage?: string
}

export type Profile = {
  id: string
  storyLine: MessageType[]
}

export type SettingsType = {
  identity: string
  language: string
}

export type ProfilesResponse = {
  [id: string]: {
    status: string
    isNewUser: string
    lastMessage: string | undefined
  }
}

export default class InMemoryDb {
  private static instance: LokiConstructor

  public static load(filePath = "./local.json"): Promise<void> {
    this.instance = new loki(filePath)

    return new Promise<void>((resolve, reject) => {
      this.instance.loadDatabase({}, err => {
        if (err) reject(err)
        else {
          this.initialize()
          resolve()
        }
      })
    })
  }

  private static initialize() {
    if (!this.instance.getCollection("profiles")) {
      this.instance.addCollection("profiles", {indices: "email"}) //TODO: rethink indices
    }

    if (!this.instance.getCollection("app-settings")) {
      this.instance.addCollection("app-settings", {indices: "identity"})
    }
  }

  // DEFAULT
  public static createDefaultSettings () {
    const appSettings = this.instance.getCollection("app-settings")
    const settings = appSettings.findOne()

    if (settings === null) {
      appSettings.insert({
        identity: "settings",
        language: "en"
      })
      this.instance.saveDatabase()
    }
  }

  public static createProfiles () {
    const profiles = this.instance.getCollection("profiles")

    for (let i = 0; i < 4; i++) {
      const profile = profiles.findOne({id: `profile_${i + 1}`})

      if (profile === null) {
        profiles.insert({
          id: `profile_${i + 1}`,
          storyLine: []
        })
      }
    }

    this.instance.saveDatabase()
  }

  // SETTINGS
  public static getSettings(): SettingsType {
    const appSettings = this.instance.getCollection("app-settings")
    return appSettings.findOne()
  }

  public static updateSettings(newSettings: SettingsType): void {
    const appSettings = this.instance.getCollection("app-settings")

    appSettings.clear()
    appSettings.insert({
      identity: "settings",
      language: newSettings.language
    })

    this.instance.saveDatabase()
  }

  // PROFILES
  public static getProfiles(): ProfilesResponse {
    const profiles = this.instance.getCollection("profiles").data as Profile[]

    const profilesResponse: ProfilesResponse = {}
    for (const profileKey in profiles) {
      const profile = profiles[profileKey]

      profilesResponse[profile.id] = {
        status: profile.storyLine.length > 0 ? "continue" : "start new story",
        isNewUser: profile.storyLine.length > 0 ? "false": "true",
        lastMessage: profile.storyLine.at(-1)?.parsedMessage
      }
    }

    return profilesResponse
  }

  // STORY
  public static addStoryMessages(id: string, stories: MessageType[]): void {
    const profiles = this.instance.getCollection("profiles")
    const profile = profiles.findOne({id: `profile_${id}`})

    console.log(`profile ${id}(addStoryMessages)`, profile)

    profile.storyLine = [...profile.storyLine, ...stories]
    profiles.update(profile)
    this.instance.saveDatabase()
  }

  public static getUserStoryMessages(id: string): MessageType[] {
    const profiles = this.instance.getCollection("profiles")
    const profile = profiles.findOne({id: `profile_${id}`})
    console.log("profile getUserStoryMessages", profile)

    return profile.storyLine
  }

  public static resetStory(id: string): void {
    const profiles = this.instance.getCollection("profiles")
    const profile = profiles.findOne({id: `profile_${id}`})
    profile.storyLine = []

    console.log("profile resetStory", profile)

    profiles.update(profile)
    this.instance.saveDatabase()
  }
}
