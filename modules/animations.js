export function fadeInText() {
  document.addEventListener("DOMContentLoaded", function () {
    const textContainers = document.querySelectorAll(
      ".title-info .fade-in-text span"
    )

    textContainers.forEach((span) => {
      const words = span.textContent.trim().split(" ") // Split text content into words

      span.innerHTML = "" // Clear original content
      for (let i = 0; i < words.length; i++) {
        const wordSpan = document.createElement("span")
        wordSpan.textContent = words[i] + " " // Add space after each word
        wordSpan.style.opacity = 0 // Set initial opacity to 0
        span.appendChild(wordSpan)
      }
    })

    const textSpans = document.querySelectorAll(
      ".title-info .fade-in-text span span"
    )
    let delay = 0 // Set initial delay time (in milliseconds) before the animation starts

    textSpans.forEach((span) => {
      setTimeout(() => {
        span.style.opacity = 1 // Fade in the span
      }, delay)
      delay += 25 // Adjust the delay time between each word
    })
  })
}
