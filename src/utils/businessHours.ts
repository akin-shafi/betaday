/**
 * Enhanced business hours utility for handling complex business schedules
 * Supports 24/7 operations, overnight hours, and flexible business days
 */

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

export const parseBusinessDays = (businessDays: string): number[] => {
  if (!businessDays || businessDays.trim() === "") {
    return [0, 1, 2, 3, 4, 5, 6]
  }

  const normalizedDays = businessDays.toLowerCase().trim()

  if (normalizedDays.includes("24/7") || normalizedDays.includes("everyday") || normalizedDays.includes("daily")) {
    return [0, 1, 2, 3, 4, 5, 6]
  }

  if (normalizedDays.includes(" - ")) {
    const [startDay, endDay] = normalizedDays.split(" - ").map((day) => day.trim())
    const startDayNum = DAY_MAP[startDay]
    const endDayNum = DAY_MAP[endDay]

    if (startDayNum !== undefined && endDayNum !== undefined) {
      const days: number[] = []

      if (startDayNum <= endDayNum) {
        if (startDayNum === 1 && endDayNum === 0) {
          return [0, 1, 2, 3, 4, 5, 6]
        }
        for (let i = startDayNum; i <= endDayNum; i++) {
          days.push(i)
        }
      } else {
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

  const singleDay = DAY_MAP[normalizedDays]
  if (singleDay !== undefined) {
    return [singleDay]
  }

  return [0, 1, 2, 3, 4, 5, 6]
}

export const isTimeInRange = (openingTime: string, closingTime: string, businessDays: string): boolean => {
  if (openingTime === "00:00:00" && closingTime === "00:00:00") {
    const operatingDays = parseBusinessDays(businessDays)
    if (operatingDays.length === 7) {
      return true
    }
  }

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTimeInMinutes = currentHour * 60 + currentMinute

  const [openHour, openMinute] = openingTime.split(":").map(Number)
  const openTimeInMinutes = openHour * 60 + openMinute

  const [closeHour, closeMinute] = closingTime.split(":").map(Number)
  const closeTimeInMinutes = closeHour * 60 + closeMinute

  if (closeTimeInMinutes < openTimeInMinutes) {
    return currentTimeInMinutes >= openTimeInMinutes || currentTimeInMinutes < closeTimeInMinutes
  }

  return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes
}

export const isBusinessCurrentlyOpen = (
  openingTime: string,
  closingTime: string,
  businessDays: string,
  isActive = true,
): boolean => {
  if (!isActive) {
    return false
  }

  const currentDay = new Date().getDay()
  const operatingDays = parseBusinessDays(businessDays)

  if (!operatingDays.includes(currentDay)) {
    return false
  }

  return isTimeInRange(openingTime, closingTime, businessDays)
}

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

  if (openingTime === "00:00:00" && closingTime === "00:00:00" && operatingDays.length === 7) {
    return {
      isOpen: true,
      status: "open",
      message: "Open 24/7",
    }
  }

  if (isOpen) {
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

  if (!operatingDays.includes(currentDay)) {
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

export const formatBusinessHours = (
  openingTime: string,
  closingTime: string,
  businessDays: string,
  isTwentyFourHours?: boolean | undefined
): string => {
  if (isTwentyFourHours) {
    return "Open 24/7"
  }

  if (openingTime === "00:00:00" && closingTime === "00:00:00") {
    const operatingDays = parseBusinessDays(businessDays)
    if (operatingDays.length === 7) {
      return "Open 24/7"
    }
  }

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

  if (closeTimeInMinutes < openTimeInMinutes) {
    return targetTimeInMinutes >= openTimeInMinutes || targetTimeInMinutes < closeTimeInMinutes
  }

  return targetTimeInMinutes >= openTimeInMinutes && targetTimeInMinutes < closeTimeInMinutes
}