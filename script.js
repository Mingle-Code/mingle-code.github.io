const themeBtn = document.getElementById("theme-btn")
const body = document.body
const cursorDot = document.querySelector("[data-cursor-dot]")
const cursorOutline = document.querySelector("[data-cursor-outline]")

const savedTheme = localStorage.getItem("theme") || "light"
body.setAttribute("data-theme", savedTheme)
updateThemeIcon(savedTheme)

themeBtn.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  body.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon(newTheme)
})

function updateThemeIcon(theme) {
  const icon = themeBtn.querySelector("i")
  icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon"
}

if (cursorDot && cursorOutline) {
  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX
    const posY = e.clientY

    cursorDot.style.left = `${posX}px`
    cursorDot.style.top = `${posY}px`

    cursorOutline.style.left = `${posX}px`
    cursorOutline.style.top = `${posY}px`
  })

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorOutline.style.transform = "scale(1.5)"
      cursorOutline.style.background = "rgba(255, 107, 107, 0.1)"
    })

    el.addEventListener("mouseleave", () => {
      cursorOutline.style.transform = "scale(1)"
      cursorOutline.style.background = "transparent"
    })
  })
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

function animateStats() {
  const stats = document.querySelectorAll(".stat-number")

  stats.forEach((stat) => {
    const target = Number.parseInt(stat.getAttribute("data-target"))
    const increment = target / 100
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      stat.textContent = Math.floor(current)
    }, 20)
  })
}

function animateSkills() {
  const skillFills = document.querySelectorAll(".skill-fill")

  skillFills.forEach((fill) => {
    const level = fill.getAttribute("data-level")
    setTimeout(() => {
      fill.style.width = level + "%"
    }, 100)
  })
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")

      if (entry.target.classList.contains("stats-grid")) {
        animateStats()
      }

      if (entry.target.classList.contains("skills-container")) {
        animateSkills()
      }
    }
  })
}, observerOptions)

function initializeDemos() {
  document.querySelectorAll(".demo-card").forEach((card) => {
    const demoType = card.getAttribute("data-demo")

    switch (demoType) {
      case "css":
        handleCSSDemo(card)
        break
      case "js":
        handleJSDemo(card)
        break
      case "php":
        handlePHPDemo(card)
        break
      case "cpp":
        handleCPPDemo(card)
        break
      default:
        break
    }
  })
}

document.addEventListener("DOMContentLoaded", () => {
  const elementsToAnimate = [".stats-grid", ".skills-container", ".showcase-grid"]

  elementsToAnimate.forEach((selector) => {
    const elements = document.querySelectorAll(selector)
    elements.forEach((el) => {
      observer.observe(el)
    })
  })

  initializeDemos()
  initializeScrollAnimations()
})

function handleCSSDemo(card) {
  const shape = card.querySelector(".morphing-shape")
  const particles = card.querySelector(".floating-particles")
  const trigger = card.querySelector(".demo-trigger")

  if (shape && trigger) {
    const isAnimated = shape.classList.contains("animate")

    shape.classList.toggle("animate")

    if (particles) {
      particles.style.display = shape.classList.contains("animate") ? "block" : "none"
    }

    trigger.innerHTML = shape.classList.contains("animate")
      ? '<span>Reset</span><i class="fas fa-undo"></i>'
      : '<span>Run Animation</span><i class="fas fa-play"></i>'
  }
}

function handleJSDemo(card) {
  const display = card.querySelector(".calc-result")
  const buttons = card.querySelectorAll(".calc-btn")

  if (!display || !buttons.length) return

  let currentInput = "0"
  let operator = null
  let previousInput = null
  let shouldResetDisplay = false

  // Reset calculator
  display.textContent = "0"

  // Remove existing listeners and add new ones
  buttons.forEach((button) => {
    const newButton = button.cloneNode(true)
    button.parentNode.replaceChild(newButton, button)
  })

  card.querySelectorAll(".calc-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      const value = button.textContent.trim()

      // Visual feedback
      button.style.transform = "scale(0.95)"
      setTimeout(() => {
        button.style.transform = "scale(1)"
      }, 100)

      if (value === "C") {
        currentInput = "0"
        operator = null
        previousInput = null
        shouldResetDisplay = false
      } else if (["÷", "×", "-", "+", "%", "±"].includes(value)) {
        if (operator && previousInput !== null && !shouldResetDisplay) {
          currentInput = calculate(previousInput, currentInput, operator).toString()
        }
        operator = value
        previousInput = currentInput
        shouldResetDisplay = true
      } else if (value === "=") {
        if (operator && previousInput !== null) {
          currentInput = calculate(previousInput, currentInput, operator).toString()
          operator = null
          previousInput = null
          shouldResetDisplay = true
        }
      } else {
        if (shouldResetDisplay) {
          currentInput = value
          shouldResetDisplay = false
        } else {
          currentInput = currentInput === "0" ? value : currentInput + value
        }
      }

      display.textContent = currentInput.length > 8 ? currentInput.substring(0, 8) : currentInput
    })
  })
}

function calculate(a, b, op) {
  a = Number.parseFloat(a)
  b = Number.parseFloat(b)

  switch (op) {
    case "+":
      return a + b
    case "-":
      return a - b
    case "×":
      return a * b
    case "÷":
      return b !== 0 ? a / b : "Error"
    case "%":
      return a % b
    case "±":
      return -a
    default:
      return b
  }
}

function handlePHPDemo(card) {
  const formResponse = card.querySelector(".form-response")
  const submitBtn = card.querySelector(".form-submit")
  const spinner = card.querySelector(".loading-spinner")
  const nameInput = card.querySelector("#demo-name")
  const emailInput = card.querySelector("#demo-email")
  const messageInput = card.querySelector("#demo-message")

  if (!submitBtn || !formResponse) return

  // Disable button and show loading
  submitBtn.disabled = true
  if (spinner) spinner.style.opacity = "1"

  const submitText = submitBtn.querySelector("span")
  if (submitText) submitText.textContent = "Sending..."

  // Simulate processing
  setTimeout(() => {
    formResponse.classList.add("show")

    // Hide response after 3 seconds
    setTimeout(() => {
      formResponse.classList.remove("show")
      submitBtn.disabled = false
      if (spinner) spinner.style.opacity = "0"
      if (submitText) submitText.textContent = "Send Message"

      // Clear form
      if (nameInput) nameInput.value = ""
      if (emailInput) emailInput.value = ""
      if (messageInput) messageInput.value = ""
    }, 3000)
  }, 1500)
}

let sortingInterval = null

function handleCPPDemo(card) {
  const bars = card.querySelectorAll(".bar")
  const sortBtn = card.querySelector("#sort-btn")
  const resetBtn = card.querySelector("#reset-btn")

  if (!bars.length || !sortBtn) return

  // Clear any existing interval
  if (sortingInterval) {
    clearInterval(sortingInterval)
    sortingInterval = null
  }

  sortBtn.disabled = true
  sortBtn.textContent = "Sorting..."

  const values = Array.from(bars).map((bar) => Number.parseInt(bar.getAttribute("data-value")))
  let i = 0,
    j = 0

  sortingInterval = setInterval(() => {
    // Reset all bar states
    bars.forEach((bar) => {
      bar.classList.remove("comparing", "sorted")
    })

    if (i < values.length - 1) {
      if (j < values.length - i - 1) {
        // Mark comparing bars
        bars[j].classList.add("comparing")
        bars[j + 1].classList.add("comparing")

        // Swap if needed
        if (values[j] > values[j + 1]) {
          ;[values[j], values[j + 1]] = [values[j + 1], values[j]]

          // Update DOM
          bars[j].setAttribute("data-value", values[j])
          bars[j + 1].setAttribute("data-value", values[j + 1])
          bars[j].style.height = getHeightForValue(values[j])
          bars[j + 1].style.height = getHeightForValue(values[j + 1])
        }
        j++
      } else {
        bars[values.length - 1 - i].classList.add("sorted")
        i++
        j = 0
      }
    } else {
      // Sorting complete
      bars.forEach((bar) => {
        bar.classList.remove("comparing")
        bar.classList.add("sorted")
      })

      clearInterval(sortingInterval)
      sortingInterval = null
      sortBtn.disabled = false
      sortBtn.textContent = "Sort"
    }
  }, 800)

  // Reset button
  if (resetBtn) {
    resetBtn.onclick = (e) => {
      e.stopPropagation()

      if (sortingInterval) {
        clearInterval(sortingInterval)
        sortingInterval = null
      }

      const originalValues = [8, 3, 12, 6, 15, 1, 9, 4]
      bars.forEach((bar, index) => {
        bar.classList.remove("comparing", "sorted")
        bar.setAttribute("data-value", originalValues[index])
        bar.style.height = getHeightForValue(originalValues[index])
      })

      sortBtn.disabled = false
      sortBtn.textContent = "Sort"
    }
  }
}

function getHeightForValue(value) {
  const heights = {
    1: "15%",
    3: "25%",
    4: "35%",
    6: "50%",
    8: "65%",
    9: "75%",
    12: "85%",
    15: "100%",
  }
  return heights[value] || "50%"
}

function initializeScrollAnimations() {
  const demoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
          }, index * 200)
        }
      })
    },
    { threshold: 0.1 },
  )

  document.querySelectorAll(".demo-card").forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(50px)"
    card.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
    demoObserver.observe(card)
  })
}

let lastScrollTop = 0
const header = document.querySelector(".header")

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    header.style.transform = "translateY(-100%)"
  } else {
    header.style.transform = "translateY(0)"
  }

  lastScrollTop = scrollTop
})

// Title animation
const titleLines = document.querySelectorAll(".title-line")
titleLines.forEach((line, index) => {
  line.style.animationDelay = `${index * 0.2}s`
  line.style.animation = "slideUp 0.8s ease forwards"
})

const style = document.createElement("style")
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .title-line {
        transform: translateY(100%);
        opacity: 0;
    }
`
document.head.appendChild(style)
