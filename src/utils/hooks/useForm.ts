import { useState } from 'react'

type UseFormResponse = {
  data: { [key: string]: any }
  errors: { [key: string]: string[] }
  edit: (name: string) => (value: string) => void
  patch: (patchData: { [key: string]: any }) => void
  clear: () => void
  isValid: (name?: string) => boolean
}

interface Validator {
  check: (value: any) => boolean
  message: string
}

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_REGEX = /(?=^.{8,}$)((?!.*s)(?=.*[A-Za-z0-9]))^.*$/

export const VALIDATORS = {
  NOT_EMPTY_STRING: (name: string): Validator => ({
    check: value => typeof value === 'string' && value.length > 0,
    message: `${name} is required`
  }),
  VALID_EMAIL: (): Validator => ({
    check: value =>
      typeof value === 'string' &&
      value.length > 0 &&
      EMAIL_REGEX.test(value.toLowerCase()),
    message: `Email format is incorrect`
  }),
  VALID_PASSWORD: (): Validator => ({
    check: value =>
      typeof value === 'string' &&
      value.length > 0 &&
      PASSWORD_REGEX.test(value),
    message: `Password format is incorrect`
  })
}

const getEmptyErrors = (data: { [key: string]: any }) => {
  const emptyErrors = {}

  Object.keys(data).forEach(item => {
    emptyErrors[item] = []
  })

  return emptyErrors
}

const useForm = (
  initialData: { [key: string]: any },
  validators?: { [key: string]: Validator[] }
): UseFormResponse => {
  const [data, setData] = useState<{ [key: string]: any }>(initialData)
  const [errors, setErrors] = useState<{ [key: string]: string[] }>(
    getEmptyErrors(initialData)
  )

  const edit = (name: string) => (value: any) => {
    setData((currentData) => ({ ...currentData, [name]: value }))
  }

  const patch = (patchData: { [key: string]: any }) => {
    setData((currentData) => ({ ...currentData, ...patchData }))
  }

  const clear = () => {
    setData(initialData)
  }

  const isValid = (name?: string) => {
    return name ? isValidOne(name) : isValidAll()
  }

  const isValidOne = (name: string) => {
    if (!validators?.[name]) return true

    const validatorErrors: string[] = []

    validators?.[name]?.forEach(item => {
      if (!item.check(data[name])) {
        validatorErrors.push(item.message)
      }
    })

    setErrors({ ...errors, [name]: validatorErrors })

    return validatorErrors.length === 0
  }

  const isValidAll = () => {
    if (!validators) return true

    let isValid = true
    const validatorErrors = getEmptyErrors(data)

    Object.entries(validators).forEach(([name, fieldValidators]) => {
      fieldValidators.forEach(item => {
        if (!item.check(data[name])) {
          isValid = false
          validatorErrors[name].push(item.message)
        }
      })
    })

    setErrors({ ...validatorErrors })

    return isValid
  }

  return {
    data,
    errors,
    edit,
    patch,
    clear,
    isValid
  }
}

export default useForm
