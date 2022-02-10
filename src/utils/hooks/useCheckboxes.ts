import { useEffect, useState } from 'react'

type UseCheckbox = {
  data: CheckboxesState
  set: (id: string, value: boolean) => void
  setAll: (value: boolean) => void
  toggle: (id: string) => void
  toggleAll: () => void
  isEnabled: (id: string) => boolean
  isEnabledAll: () => { enabled: boolean; partial: boolean }
  getSelected: () => string[]
  getNotSelected: () => string[]
}

type CheckboxesState = { [key: string]: boolean }

type Item = {
  id: string
}

const getCheckboxesState = (
  list: Item[],
  defaultValue: boolean = false
): CheckboxesState => {
  const state = {}

  list.forEach(({ id }) => (state[id] = defaultValue))

  return state
}

const isUpdateNeeded = (state: CheckboxesState, list: Item[]) => {
  if (Object.keys(state).length !== list.length) return true

  for (let i = 0; i < list.length; i++) {
    if (state[list[i].id] === undefined) return true
  }

  return false
}

const useCheckboxes = (list: Item[]): UseCheckbox => {
  const [checkboxesState, setCheckboxesState] = useState<CheckboxesState>(
    getCheckboxesState(list)
  )

  useEffect(() => {
    if (!isUpdateNeeded(checkboxesState, list)) return

    setCheckboxesState(getCheckboxesState(list))
  }, [list])

  const set = (id: string, value: boolean) => {
    setCheckboxesState({ ...checkboxesState, [id]: value })
  }

  const setAll = (value: boolean) => {
    setCheckboxesState(getCheckboxesState(list, value))
  }

  const toggle = (id: string) => {
    setCheckboxesState({ ...checkboxesState, [id]: !checkboxesState[id] })
  }

  const toggleAll = () => {
    const { enabled, partial } = isEnabledAll()

    setCheckboxesState(getCheckboxesState(list, !(enabled && !partial)))
  }

  const isEnabled = (id: string) => {
    return checkboxesState[id]
  }

  const isEnabledAll = () => {
    const items = Object.values(checkboxesState)

    if (items.every(value => value === false))
      return { enabled: false, partial: false }

    if (items.every(value => value === true))
      return { enabled: true, partial: false }

    return { enabled: true, partial: true }
  }

  const getSelected = () => {
    return Object.entries(checkboxesState)
      .filter(([_, value]) => value === true)
      .map(([item]) => item)
  }

  const getNotSelected = () => {
    return Object.entries(checkboxesState)
      .filter(([_, value]) => value === true)
      .map(([item]) => item)
  }

  return {
    data: checkboxesState,
    set,
    setAll,
    toggle,
    toggleAll,
    isEnabled,
    isEnabledAll,
    getSelected,
    getNotSelected
  }
}

export default useCheckboxes
