export function displayErrorNotification(title: string, message: string) {
  const existing = document.getElementById("flow-error-notification")
  if (existing) {
    existing.remove()
  }

  const container = document.createElement("div")
  container.id = "flow-error-notification"

  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches

  const backgroundColor = isDarkMode ? "#2c2c2c" : "#ffffff"
  const textColor = isDarkMode ? "#f0f0f0" : "#333333"
  const borderColor = isDarkMode ? "#444444" : "#e0e0e0"

  Object.assign(container.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: backgroundColor,
    color: textColor,
    padding: "16px 24px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    fontFamily: "Arial, sans-serif",
    zIndex: 1000,
    maxWidth: "320px",
    overflow: "hidden",
    border: `1px solid ${borderColor}`,
    opacity: "0",
    transform: "translateY(20px)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
  })

  const titleElem = document.createElement("div")
  titleElem.innerText = title
  Object.assign(titleElem.style, {
    fontWeight: "bold",
    marginBottom: "8px",
    fontSize: "16px",
  })

  const messageElem = document.createElement("div")
  messageElem.innerText = message
  Object.assign(messageElem.style, {
    fontSize: "14px",
    lineHeight: "1.4",
  })

  container.appendChild(titleElem)
  container.appendChild(messageElem)

  document.body.appendChild(container)

  // Trigger the fade-in effect
  requestAnimationFrame(() => {
    container.style.opacity = "1"
    container.style.transform = "translateY(0)"
  })

  setTimeout(() => {
    container.style.opacity = "0"
    container.style.transform = "translateY(20px)"
    container.addEventListener("transitionend", () => container.remove())
  }, 5000)
}
