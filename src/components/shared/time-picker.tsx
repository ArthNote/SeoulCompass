import * as React from "react"
import { Input } from "@/components/ui/input"

interface TimePickerInputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export function TimePickerInput({
  placeholder,
  value,
  onChange,
  disabled,
  ...props
}: TimePickerInputProps) {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value
    // Convert 24-hour format to 12-hour format with AM/PM
    if (timeValue) {
      const [hours, minutes] = timeValue.split(':')
      const date = new Date()
      date.setHours(parseInt(hours), parseInt(minutes))
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      onChange?.(formattedTime)
    } else {
      onChange?.('')
    }
  }

  // Convert 12-hour format to 24-hour format for input value
  const get24HourTime = () => {
    if (!value) return ''
    const date = new Date(`1/1/2024 ${value}`)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <Input
      type="time"
      placeholder={placeholder}
      value={get24HourTime()}
      onChange={handleTimeChange}
      disabled={disabled}
      {...props}
    />
  )
}
