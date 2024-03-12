import Database, {SettingsType} from "./modules/Database"

type DefaultResponse = { message?: string, data?: any, code: number }

export const updateSettings = (settings: SettingsType): DefaultResponse => {
  try {
    Database.updateSettings(settings)
    return {message: "Successfully updated settings!", code: 200}
  }
  catch (error: any) {
    console.log("Error in update settings", error?.message)
    return {message: error?.message ?? "", code: 500}
  }
}

export const getSettings = (): DefaultResponse => {
  try {
    const data = Database.getSettings()
    return {data, code: 200}
  }
  catch (error: any) {
    console.log("Error in get settings", error?.message)
    return {message: error?.message ?? "", code: 500}
  }
}
