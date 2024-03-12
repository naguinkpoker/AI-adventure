window.addEventListener("load", async () => {
  const applySettingsButton = document.querySelector("#apply-settings") as HTMLButtonElement
  const languagesSelect = document.querySelector("#languages") as HTMLSelectElement

  const settingsResponse = await window.API.invoke("get-settings")

  if (settingsResponse.code === 200) {
    languagesSelect.value = settingsResponse.data.language
  }
  else console.log(settingsResponse)

  applySettingsButton.addEventListener("click", async () => {
    const language = languagesSelect.value

    const result = await window.API.invoke("set-settings", {language})

    if (result.code !== 200) {
      alert("Not saved!")
      console.log(result);
    }
    else alert("Saved!")
  })
})
