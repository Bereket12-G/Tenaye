/**
 * Validation utilities for Challenge Portal
 */

export interface ValidationRule {
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  required?: boolean
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Validate a field against validation rules
 */
export function validateField(value: unknown, rules: ValidationRule[]): ValidationResult {
  const errors: string[] = []

  for (const rule of rules) {
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push('This field is required')
      continue
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      continue
    }

    // Min length validation
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      errors.push(`Minimum length is ${rule.minLength} characters`)
    }

    // Max length validation
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      errors.push(`Maximum length is ${rule.maxLength} characters`)
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors.push('Invalid format')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(email)
  
  return {
    isValid,
    errors: isValid ? [] : ['Please enter a valid email address']
  }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): ValidationResult {
  try {
    new URL(url)
    return { isValid: true, errors: [] }
  } catch {
    return {
      isValid: false,
      errors: ['Please enter a valid URL']
    }
  }
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): ValidationResult {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  const cleanPhone = phone.replace(/[\s\-()]/g, '')
  const isValid = phoneRegex.test(cleanPhone)
  
  return {
    isValid,
    errors: isValid ? [] : ['Please enter a valid phone number']
  }
}

/**
 * Validate numeric range
 */
export function validateNumericRange(value: number, min?: number, max?: number): ValidationResult {
  const errors: string[] = []
  
  if (min !== undefined && value < min) {
    errors.push(`Value must be at least ${min}`)
  }
  
  if (max !== undefined && value > max) {
    errors.push(`Value must be at most ${max}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate date range
 */
export function validateDateRange(date: Date, minDate?: Date, maxDate?: Date): ValidationResult {
  const errors: string[] = []
  
  if (minDate && date < minDate) {
    errors.push(`Date must be on or after ${minDate.toLocaleDateString()}`)
  }
  
  if (maxDate && date > maxDate) {
    errors.push(`Date must be on or before ${maxDate.toLocaleDateString()}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSize: number): ValidationResult {
  const isValid = file.size <= maxSize
  
  return {
    isValid,
    errors: isValid ? [] : [`File size must be less than ${formatFileSize(maxSize)}`]
  }
}

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): ValidationResult {
  const isValid = allowedTypes.includes(file.type)
  
  return {
    isValid,
    errors: isValid ? [] : [`File type must be one of: ${allowedTypes.join(', ')}`]
  }
}

/**
 * Validate form data
 */
export function validateForm(formData: Record<string, unknown>, validationSchema: Record<string, ValidationRule[]>): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {}
  
  for (const [fieldName, rules] of Object.entries(validationSchema)) {
    results[fieldName] = validateField(formData[fieldName], rules)
  }
  
  return results
}

/**
 * Check if form is valid
 */
export function isFormValid(validationResults: Record<string, ValidationResult>): boolean {
  return Object.values(validationResults).every(result => result.isValid)
}

/**
 * Get all form errors
 */
export function getFormErrors(validationResults: Record<string, ValidationResult>): string[] {
  return Object.values(validationResults)
    .flatMap(result => result.errors)
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Sanitize input string
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate challenge data
 */
export function validateChallenge(data: Record<string, unknown>): ValidationResult {
  const errors: string[] = []
  
  if (!data.title || (typeof data.title === 'string' && data.title.trim().length === 0)) {
    errors.push('Challenge title is required')
  } else if (typeof data.title === 'string' && data.title.length > 100) {
    errors.push('Challenge title must be less than 100 characters')
  }
  
  if (!data.description || (typeof data.description === 'string' && data.description.trim().length === 0)) {
    errors.push('Challenge description is required')
  } else if (typeof data.description === 'string' && data.description.length > 500) {
    errors.push('Challenge description must be less than 500 characters')
  }
  
  if (!data.category || (typeof data.category === 'string' && data.category.trim().length === 0)) {
    errors.push('Challenge category is required')
  }
  
  if (!data.durationDays || (typeof data.durationDays === 'number' && (data.durationDays < 1 || data.durationDays > 365))) {
    errors.push('Challenge duration must be between 1 and 365 days')
  }
  
  if (!data.estimatedDailyMinutes || (typeof data.estimatedDailyMinutes === 'number' && (data.estimatedDailyMinutes < 1 || data.estimatedDailyMinutes > 120))) {
    errors.push('Estimated daily minutes must be between 1 and 120')
  }
  
  if (!data.guidelines || !Array.isArray(data.guidelines) || data.guidelines.length === 0) {
    errors.push('At least one guideline is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate team data
 */
export function validateTeam(data: Record<string, unknown>): ValidationResult {
  const errors: string[] = []
  
  if (!data.name || (typeof data.name === 'string' && data.name.trim().length === 0)) {
    errors.push('Team name is required')
  } else if (typeof data.name === 'string' && data.name.length > 50) {
    errors.push('Team name must be less than 50 characters')
  }
  
  if (!data.emoji || (typeof data.emoji === 'string' && data.emoji.trim().length === 0)) {
    errors.push('Team emoji is required')
  }
  
  if (!data.colorId || (typeof data.colorId === 'string' && data.colorId.trim().length === 0)) {
    errors.push('Team color is required')
  }
  
  if (data.chant && typeof data.chant === 'string' && data.chant.length > 200) {
    errors.push('Team chant must be less than 200 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate post data
 */
export function validatePost(data: Record<string, unknown>): ValidationResult {
  const errors: string[] = []
  
  if (!data.content || (typeof data.content === 'string' && data.content.trim().length === 0)) {
    errors.push('Post content is required')
  } else if (typeof data.content === 'string' && data.content.length > 500) {
    errors.push('Post content must be less than 500 characters')
  }
  
  if (data.mood && typeof data.mood === 'string' && data.mood.length > 10) {
    errors.push('Mood must be less than 10 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}