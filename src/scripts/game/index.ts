window.addEventListener("load", async () => {
  if (!localStorage.getItem("profile")) {
    localStorage.clear()
    window.API.send("change-screen", "menu")
  }

  const buttons = Array.from(document.querySelectorAll("#wrapper>div:nth-child(2)>.answers>button")) as HTMLElement[]
  buttons.forEach(button => {
    button.addEventListener("click", async () => {
      const answer = button.innerText ?? ""
      await nextRound(answer)
    })
  })

  const cleanStoryButton = document.querySelector("#clean-story-button") as HTMLButtonElement
  cleanStoryButton.addEventListener("click", async () => {
    const confirmAction = confirm("Do you really want to rewrite the story? All your progress would be lost!")

    if (confirmAction) {
      cleanStoryButton.disabled = true

      const res = await window.API.invoke("reset-story", localStorage.getItem("profile"))

      if (res?.code === 200) {
        alert("Story was cleared! Click \"Ok\" to generate new adventure...")
        cleanStoryButton.disabled = false
        await nextRound()
      }
      else {
        alert("Can't reset story now! Try do this later.")
        cleanStoryButton.disabled = false
      }
    }
  })

  if (localStorage.getItem("isNewUser") === "true") {
    // If new user generate first round of story auto
    localStorage.removeItem("isNewUser")
    await nextRound()
  }
  else {
    // If old user get last message and show it
    const lastMessageJSON = localStorage.getItem("lastMessage")

    if (lastMessageJSON) {
      try {
        const {
          image,
          situation,
          environment,
          goal,
          variants: {A = "", B = "", C = ""}
        } = JSON.parse(lastMessageJSON)

        fillScreen({
          image,
          situation,
          environment,
          goal,
          answers: {A, B, C}
        })
      }
      catch (e) {
        console.log("Can't load your previous story", e)
        localStorage.removeItem("lastMessage")
        alert("Error! We cant load your previous story... Please, reset story for more stability!")
      }
    }
  }
})
