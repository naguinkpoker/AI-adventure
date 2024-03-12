type StoryResponse = {
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
}

const nextRound = async (answer = ""): Promise<void> => {
  const profile = localStorage.getItem("profile")
  setLoading()

  const res = (
    answer === ""
    ? await window.API.invoke("new-story", profile)
    : await window.API.invoke("continue-story", {profile, answer})
  ) as StoryResponse

  console.log("res", res)

  if (res.code !== 200 || ("message" in res.data)) {
    console.log("error", res)
    alert("Some error happened! Can't connect to GPT model!")

    const buttons = Array.from(document.querySelectorAll("#wrapper>div:nth-child(2)>.answers>button")) as HTMLButtonElement[]

    buttons.forEach(button => {
      button.disabled = true
    })

    return
  }

  const {
    situation = "",
    environment = "",
    goal = "",
    variants: {A = "", B = "", C = ""},
    image = ""
  } = res.data

  fillScreen({
    image,
    situation,
    environment,
    goal,
    answers: {A, B, C}
  })
}
