import Database from "./modules/Database"

type DefaultResponse = { message?: string, data?: any, code: number }

export const getProfiles = (): DefaultResponse => {
  try {
    const data = Database.getProfiles()
    return {data, code: 200}
  }
  catch (error: any) {
    console.log("Error in get profiles", error?.message)
    return {message: error?.message ?? "", code: 500}
  }
}
