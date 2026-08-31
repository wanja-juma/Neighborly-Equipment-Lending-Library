const STORAGE_KEY = 'neighborly_mock_users'

function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function registerUser({ firstName, lastName, email, password }) {
  await delay(500)
  const users = getUsers()
  if (users.some((u) => u.email === email)) {
    throw new Error('An account with that email already exists')
  }
  users.push({ firstName, lastName, email, password })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  return { firstName, lastName, email }
}

export async function loginUser({ email, password }) {
  await delay(500)
  const user = getUsers().find((u) => u.email === email && u.password === password)
  if (!user) {
    throw new Error('Invalid email or password')
  }
  return { firstName: user.firstName, lastName: user.lastName, email: user.email }
}

const LOGIN_KEY = 'neighborly_logged_in'

export function setLoggedIn(user) {
  localStorage.setItem(LOGIN_KEY, JSON.stringify(user))
}

export function getLoggedInUser() {
  return JSON.parse(localStorage.getItem(LOGIN_KEY) || 'null')
}

export function logoutUser() {
  localStorage.removeItem(LOGIN_KEY)
}
