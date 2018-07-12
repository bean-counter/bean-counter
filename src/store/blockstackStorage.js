import { getFile, putFile, isUserSignedIn } from 'blockstack'

const filename = 'entaxy.json'

export const loadState = () => {
  if (isUserSignedIn()) {
    const stuff = getFile(filename)
      .then(data => JSON.parse(data))
      .catch(() => undefined)
    return stuff
  }
  return undefined
}

export const saveState = (state) => {
  if (isUserSignedIn()) {
    return putFile(filename, JSON.stringify(state))
  }
  return undefined
}
