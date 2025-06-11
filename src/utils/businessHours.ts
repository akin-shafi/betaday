/**
 * Enhanced business hours utility for handling complex business schedules
 * Supports 24/7 operations, overnight hours, and flexible business days
 */

// Day mapping for business days parsing
const DAY_MAP: { [key: string]: number } = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
}

/**
 * Parse business days string into array of day numbers (0 = Sunday, 6 = Saturday)
 * Supports formats like: "Mon - Fri", "Mon - Sun", "Sat - Sun", "Mon, Wed, Fri"
 */
export const parseBusinessDays = (businessDays: string): number[] => {
  if (!businessDays || businessDays.trim() === "") {
    return [0, 1, 2, 3, 4, 5, 6] // Default to all days
  }

  const normalizedDays = businessDays.toLowerCase().trim()

  // Handle "24/7" or "everyday" cases
  if (normalizedDays.includes("24/7") || normalizedDays.includes("everyday") || normalizedDays.includes("daily")) {
    return [0, 1, 2, 3, 4, 5, 6]
  }

  // Handle range format: "Mon - Fri", "Sat - Sun", "Mon - Sun"
  if (normalizedDays.includes(" - ")) {
    const [startDay, endDay] = normalizedDays.split(" - ").map((day) => day.trim())
    const startDayNum = DAY_MAP[startDay]
    const endDayNum = DAY_MAP[endDay]

    if (startDayNum !== undefined && endDayNum !== undefined) {
      const days: number[] = []

      if (startDayNum <= endDayNum) {
        // Normal range: Mon - Fri (1 to 5), Mon - Sun (1 to 0, which is all days)
        if (startDayNum === 1 && endDayNum === 0) {
          // Special case: Mon - Sun means all days
          return [0, 1, 2, 3, 4, 5, 6]
        }
        for (let i = startDayNum; i <= endDayNum; i++) {
          days.push(i)
        }
      } else {
        // Wrap around range: Fri - Mon (5,6,0,1)
        for (let i = startDayNum; i <= 6; i++) {
          days.push(i)
        }
        for (let i = 0; i <= endDayNum; i++) {
          days.push(i)
        }
      }
      return days
    }
  }

  // Handle comma-separated format: "Mon, Wed, Fri"
  if (normalizedDays.includes(",")) {
    const dayNames = normalizedDays.split(",").map((day) => day.trim())
    const days: number[] = []

    for (const dayName of dayNames) {
      const dayNum = DAY_MAP[dayName]
      if (dayNum !== undefined) {
        days.push(dayNum)
      }
    }
    return days.length > 0 ? days : [0, 1, 2, 3, 4, 5, 6]
  }

  // Handle single day: "Monday"
  const singleDay = DAY_MAP[normalizedDays]
  if (singleDay !== undefined) {
    return [singleDay]
  }

  // Default to all days if parsing fails
  return [0, 1, 2, 3, 4, 5, 6]
}

/**
 * Check if current time is within business hours
 * Handles 24/7 operations and overnight hours
 * FIXED: 00:00:00 - 00:00:00 with Mon - Sun is considered 24/7
 */
export const isTimeInRange = (openingTime: string, closingTime: string, businessDays: string): boolean => {
  // Handle 24/7 operations
  if (openingTime === "00:00:00" && closingTime === "00:00:00") {
    const operatingDays = parseBusinessDays(businessDays)
    // If business operates all 7 days, it's 24/7
    if (operatingDays.length === 7) {
      console.log("🕒 24/7 operation detected (00:00:00 - 00:00:00 with all days)")
      return true
    }
  }

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTimeInMinutes = currentHour * 60 + currentMinute

  // Parse opening time
  const [openHour, openMinute] = openingTime.split(":").map(Number)
  const openTimeInMinutes = openHour * 60 + openMinute

  // Parse closing time
  const [closeHour, closeMinute] = closingTime.split(":").map(Number)
  const closeTimeInMinutes = closeHour * 60 + closeMinute

  console.log(
    `🕒 Time check: Current ${currentHour}:${currentMinute.toString().padStart(2, "0")} (${currentTimeInMinutes}min)`,
  )
  console.log(`🕒 Business hours: ${openingTime} (${openTimeInMinutes}min) - ${closingTime} (${closeTimeInMinutes}min)`)

  // Handle overnight hours (e.g., 22:00 - 04:00)
  if (closeTimeInMinutes < openTimeInMinutes) {
    console.log("🌙 Overnight hours detected")
    const isOpen = currentTimeInMinutes >= openTimeInMinutes || currentTimeInMinutes < closeTimeInMinutes
    console.log(`🕒 Overnight check result: ${isOpen}`)
    return isOpen
  }

  // Normal hours (e.g., 09:00 - 17:00)
  const isOpen = currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes
  console.log(`🕒 Normal hours check result: ${isOpen}`)
  return isOpen
}

/**
 * Check if business is currently open based on all factors
 * Considers: business days, opening hours, and active status
 */
export const isBusinessCurrentlyOpen = (
  openingTime: string,
  closingTime: string,
  businessDays: string,
  isActive = true,
): boolean => {
  console.log(`🏪 Checking business status:`)
  console.log(`   - Opening: ${openingTime}`)
  console.log(`   - Closing: ${closingTime}`)
  console.log(`   - Days: ${businessDays}`)
  console.log(`   - Active: ${isActive}`)

  // Business must be active to be considered open
  if (!isActive) {
    console.log("❌ Business is inactive")
    return false
  }

  // Get current day (0 = Sunday, 6 = Saturday)
  const currentDay = new Date().getDay()
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  console.log(`📅 Current day: ${dayNames[currentDay]} (${currentDay})`)

  // Parse business operating days
  const operatingDays = parseBusinessDays(businessDays)
  console.log(`📅 Operating days: ${operatingDays.map((d) => dayNames[d]).join(", ")}`)

  // Check if business operates today
  if (!operatingDays.includes(currentDay)) {
    console.log("❌ Business not operating today")
    return false
  }

  // Check if current time is within business hours
  const isOpenNow = isTimeInRange(openingTime, closingTime, businessDays)
  console.log(`🕒 Final result: ${isOpenNow ? "OPEN ✅" : "CLOSED ❌"}`)
  return isOpenNow
}

/**
 * Get business status with detailed information
 * Returns status and next opening/closing time
 */
export const getBusinessStatus = (
  openingTime: string,
  closingTime: string,
  businessDays: string,
  isActive = true,
): {
  isOpen: boolean
  status: "open" | "closed" | "inactive"
  message: string
  nextChange?: string
} => {
  if (!isActive) {
    return {
      isOpen: false,
      status: "inactive",
      message: "Business is currently inactive",
    }
  }

  const isOpen = isBusinessCurrentlyOpen(openingTime, closingTime, businessDays, isActive)
  const operatingDays = parseBusinessDays(businessDays)
  const currentDay = new Date().getDay()

  // Handle 24/7 operations
  if (openingTime === "00:00:00" && closingTime === "00:00:00" && operatingDays.length === 7) {
    return {
      isOpen: true,
      status: "open",
      message: "Open 24/7",
    }
  }

  if (isOpen) {
    // Format closing time for display
    const formatTime = (time: string): string => {
      const [hour, minute] = time.split(":").map(Number)
      const period = hour >= 12 ? "PM" : "AM"
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`
    }

    return {
      isOpen: true,
      status: "open",
      message: `Open until ${formatTime(closingTime)}`,
      nextChange: closingTime,
    }
  }

  // Business is closed
  if (!operatingDays.includes(currentDay)) {
    // Find next operating day
    let nextDay = (currentDay + 1) % 7
    while (!operatingDays.includes(nextDay) && nextDay !== currentDay) {
      nextDay = (nextDay + 1) % 7
    }

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const formatTime = (time: string): string => {
      const [hour, minute] = time.split(":").map(Number)
      const period = hour >= 12 ? "PM" : "AM"
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`
    }

    return {
      isOpen: false,
      status: "closed",
      message: `Closed today. Opens ${dayNames[nextDay]} at ${formatTime(openingTime)}`,
      nextChange: openingTime,
    }
  }

  const formatTime = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number)
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`
  }

  return {
    isOpen: false,
    status: "closed",
    message: `Closed. Opens at ${formatTime(openingTime)}`,
    nextChange: openingTime,
  }
}

/**
 * Format business hours for display
 * Returns human-readable business hours string
 */
export const formatBusinessHours = (openingTime: string, closingTime: string, businessDays: string): string => {
  // Handle 24/7 operations
  if (openingTime === "00:00:00" && closingTime === "00:00:00") {
    const operatingDays = parseBusinessDays(businessDays)
    if (operatingDays.length === 7) {
      return "Open 24/7"
    }
  }

  // Format time from 24-hour to 12-hour format
  const formatTime = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number)
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`
  }

  const formattedOpening = formatTime(openingTime)
  const formattedClosing = formatTime(closingTime)

  return `${businessDays}: ${formattedOpening} - ${formattedClosing}`
}

/**
 * Check if business will be open at a specific time
 * Useful for scheduling and pre-orders
 */
export const willBusinessBeOpen = (
  openingTime: string,
  closingTime: string,
  businessDays: string,
  targetDate: Date,
  isActive = true,
): boolean => {
  if (!isActive) {
    return false
  }

  const targetDay = targetDate.getDay()
  const operatingDays = parseBusinessDays(businessDays)

  if (!operatingDays.includes(targetDay)) {
    return false
  }

  // Handle 24/7 operations
  if (openingTime === "00:00:00" && closingTime === "00:00:00" && operatingDays.length === 7) {
    return true
  }

  const targetHour = targetDate.getHours()
  const targetMinute = targetDate.getMinutes()
  const targetTimeInMinutes = targetHour * 60 + targetMinute

  const [openHour, openMinute] = openingTime.split(":").map(Number)
  const openTimeInMinutes = openHour * 60 + openMinute

  const [closeHour, closeMinute] = closingTime.split(":").map(Number)
  const closeTimeInMinutes = closeHour * 60 + closeMinute

  // Handle overnight hours
  if (closeTimeInMinutes < openTimeInMinutes) {
    return targetTimeInMinutes >= openTimeInMinutes || targetTimeInMinutes < closeTimeInMinutes
  }

  return targetTimeInMinutes >= openTimeInMinutes && targetTimeInMinutes < closeTimeInMinutes
}
