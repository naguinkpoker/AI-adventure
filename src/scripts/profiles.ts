type ProfilesResponse = {
  [id: string]: {
    status: string
    isNewUser: string
    lastMessage: string | undefined
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const profiles = Array.from(document.querySelectorAll("#wrapper>div>.container>button")) as HTMLButtonElement[]

  const res = await window.API.invoke("get-profiles")

  console.log("res", res)

  if (res?.code !== 200) {
    alert("Can't get profiles! " + res?.message)
  }
  else {
    const data = res?.data as ProfilesResponse

    profiles.forEach(profile => {
      const profileStatus = profile.querySelector("span") as HTMLElement
      const profileId = profile.dataset.id as string

      profileStatus.innerText = `(${data[`profile_${profileId}`].status})`

      profile.addEventListener("click", () => {
        console.log("data", data[`profile_${profileId}`])

        const isNewUser = data[`profile_${profileId}`].isNewUser
        const lastMessage = data[`profile_${profileId}`].lastMessage

        localStorage.setItem("profile", profileId)
        localStorage.setItem("isNewUser", isNewUser)

        if (lastMessage) localStorage.setItem("lastMessage", lastMessage)
        window.API.send('change-screen', 'game')
      })
    })
  }

})
