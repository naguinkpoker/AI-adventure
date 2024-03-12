const fillScreen = (
  {
    image = "",
    situation = "",
    environment = "",
    goal = "",
    answers = {A: "", B: "", C: ""}
  } :
  {
    image:string,
    situation: string,
    environment: string,
    goal: string,
    answers: {[key: string]: string}
  }
): void => {
  // Set image
  const illustration = document.querySelector("#wrapper>div:nth-child(2)>.illustration>img") as HTMLImageElement
  const illustrationLoader = document.querySelector("#wrapper>div:nth-child(2)>.illustration>.loader") as HTMLImageElement

  if (image !== "") {
    illustrationLoader.style.display = "none"
    illustration.src = image
  }
  else {
    illustrationLoader.style.display = "flex"
  }

  // Set story text
  const storyParagraphLoaders = Array.from(document.querySelectorAll("#paragraph>div>.loader")) as HTMLImageElement[]
  const situationParagraph = document.querySelector("#paragraph>div:nth-child(1)>p") as HTMLElement
  const environmentParagraph = document.querySelector("#paragraph>div:nth-child(2)>p") as HTMLElement
  const goalParagraph = document.querySelector("#paragraph>div:nth-child(3)>p") as HTMLElement

  if (situation !== "" && environment !== "" && goal !== "") {
    storyParagraphLoaders.forEach(loader => loader.style.display = "none")

    situationParagraph.innerText = situation
    environmentParagraph.innerText = environment
    goalParagraph.innerText = goal
  }
  else {
    storyParagraphLoaders.forEach(loader => loader.style.display = "flex")
    situationParagraph.innerText = ""
    environmentParagraph.innerText = ""
    goalParagraph.innerText = ""
  }

  const buttons = Array.from(document.querySelectorAll("#wrapper>div:nth-child(2)>.answers>button")) as HTMLButtonElement[]

  buttons.forEach(button => {
    const buttonSymbol = button.dataset.symbol as string

    const buttonText = button.querySelector("span") as HTMLElement
    const buttonLoader = button.querySelector(".loader") as HTMLElement

    if (answers[buttonSymbol] !== "") {
      buttonText.innerText = answers[buttonSymbol]
      button.disabled = false
      buttonLoader.style.display = "none"
    }
    else {
      button.disabled = true
      buttonLoader.style.display = "flex"
    }
  })
}

const setLoading = (): void => {
  fillScreen({
    image: "",
    situation: "",
    environment: "",
    goal: "",
    answers: {A: "", B: "", C: ""}
  })
}
