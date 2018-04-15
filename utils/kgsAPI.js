import { GOOGLE_API } from './keysAPI'

const url = 'https://kgsearch.googleapis.com/v1/entities:search?'


// https://kgsearch.googleapis.com/v1/entities:search?query:taylor+swift&types=person&limit=1&key=AIzaSyAiezXiOJMvOtSK4eMoXKfUvX4yY4RW5SQ

export const getDetailWithName = (name) => {
  let query = name.toLowerCase()
  query = query.trim()
  query = query.split(' ').join('+')

  return fetch(`${url}query=${query}&limit=1&key=${GOOGLE_API}`)
    .then(res => res.json())
}

export const getDetailWithID = (mid) =>
  fetch(`${url}ids=${mid}&limit=1&key=${GOOGLE_API}`)
    .then(res => res.json())
