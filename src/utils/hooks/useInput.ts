import React, { useState } from 'react'

type UseInput = [
  string,
  (input?: string | React.ChangeEvent<HTMLInputElement>) => void
]

const useInput = (initialValue: string): UseInput => {
  const [value, setValue] = useState<string>(initialValue)

  const setValueWrapper = (
    input?: string | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (input === undefined) setValue('')

    if (typeof input === 'string') setValue(input)
    else setValue((input as React.ChangeEvent<HTMLInputElement>).target.value)
  }

  return [value, setValueWrapper]
}

export default useInput
