const locale = 'hu-HU'
const weatherApi = 'https://api.open-meteo.com/v1/forecast'
const weatherGeoApi = 'https://geocoding-api.open-meteo.com/v1/search'
const palette = ['#2f6fed', '#14a48a', '#d84f6f', '#e3a22c', '#7b61ff', '#2aa7b8', '#c56a3a', '#6f8f3f']
const legacyPalette = new Set([
  '#ff7a90',
  '#48c6ef',
  '#8ddf7a',
  '#b38cff',
  '#ffd166',
  '#4ecdc4',
  '#ff9f45',
  '#7aa7ff',
  '#e9784f',
  '#77a8d8',
  '#b889d8',
  '#ff8a5f'
])
const avatarThemes = [
  ['#2f6fed', '#d9e6ff', '#17346e'],
  ['#14a48a', '#d5f4ec', '#0e5d50'],
  ['#d84f6f', '#ffe1e8', '#7f2439'],
  ['#e3a22c', '#fff1c7', '#835514'],
  ['#7b61ff', '#e8e2ff', '#382a8a'],
  ['#2aa7b8', '#d7f5f8', '#0e6370']
]
const dayLabels = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V']
const feelingIcons = {
  Boldog: '☺',
  Nyugodt: '☁',
  Semleges: '•',
  Fáradt: '◐',
  Szomorú: '☂',
  Dühös: '!',
  Izgatott: '★',
  Aggódó: '?'
}

const storage = {
  events: 'hearth-display-events',
  profiles: 'hearth-display-profiles',
  todos: 'hearth-display-todos',
  routines: 'hearth-display-routines',
  meals: 'hearth-display-meals',
  lists: 'hearth-display-lists',
  feelings: 'hearth-display-feelings',
  weather: 'hearth-display-weather',
  privacy: 'hearth-display-privacy',
  settings: 'hearth-display-settings',
  helper: 'hearth-display-helper',
  rewards: 'hearth-display-rewards'
}

const configuredBackendUrl = typeof window !== 'undefined' ? (window.HEARTH_BACKEND_URL || '').trim() : ''
const defaultSettings = {
  familyName: 'Otthoni család',
  frame: 'wood',
  theme: 'warm',
  bedtimeDim: false,
  wallpaper: '',
  orientation: 'portrait',
  backendUrl: configuredBackendUrl
}

const el = id => document.getElementById(id)
const nodes = {
  familyNameLabel: el('familyNameLabel'),
  screenTitle: el('screenTitle'),
  weekdayRow: el('weekdayRow'),
  monthTitle: el('monthTitle'),
  calendarGrid: el('calendarGrid'),
  calendarViews: el('calendarViews'),
  todayLabel: el('todayLabel'),
  clock: el('clock'),
  weatherPill: el('weatherPill'),
  prevMonth: el('prevMonth'),
  nextMonth: el('nextMonth'),
  eventForm: el('eventForm'),
  eventTitle: el('eventTitle'),
  eventDate: el('eventDate'),
  eventTime: el('eventTime'),
  eventProfile: el('eventProfile'),
  eventList: el('eventList'),
  eventItemTemplate: el('eventItemTemplate'),
  tabs: el('tabs'),
  privacyToggle: el('privacyToggle'),
  todoForm: el('todoForm'),
  todoTitle: el('todoTitle'),
  todoProfile: el('todoProfile'),
  todoImportance: el('todoImportance'),
  todoRecurring: el('todoRecurring'),
  todoList: el('todoList'),
  routineForm: el('routineForm'),
  routineName: el('routineName'),
  routineProfile: el('routineProfile'),
  routineTime: el('routineTime'),
  routineTasks: el('routineTasks'),
  routineList: el('routineList'),
  mealForm: el('mealForm'),
  mealDay: el('mealDay'),
  mealName: el('mealName'),
  mealProfile: el('mealProfile'),
  mealList: el('mealList'),
  autoMealBtn: el('autoMealBtn'),
  listForm: el('listForm'),
  listName: el('listName'),
  listItemForm: el('listItemForm'),
  listTarget: el('listTarget'),
  listItemText: el('listItemText'),
  sharedList: el('sharedList'),
  feelingForm: el('feelingForm'),
  feelingProfile: el('feelingProfile'),
  feelingEmoji: el('feelingEmoji'),
  feelingNote: el('feelingNote'),
  feelingList: el('feelingList'),
  weatherForm: el('weatherForm'),
  zipCode: el('zipCode'),
  weatherList: el('weatherList'),
  weatherPreview: el('weatherPreview'),
  helperForm: el('helperForm'),
  helperText: el('helperText'),
  helperList: el('helperList'),
  profileForm: el('profileForm'),
  profileName: el('profileName'),
  profileColor: el('profileColor'),
  profileAvatar: el('profileAvatar'),
  profileAllergy: el('profileAllergy'),
  profileEmergency: el('profileEmergency'),
  profileList: el('profileList'),
  settingsForm: el('settingsForm'),
  familyNameInput: el('familyNameInput'),
  backendUrlInput: el('backendUrlInput'),
  frameSelect: el('frameSelect'),
  themeSelect: el('themeSelect'),
  bedtimeDim: el('bedtimeDim'),
  familySummary: el('familySummary'),
  todayEventCount: el('todayEventCount'),
  openTodoCount: el('openTodoCount'),
  starCount: el('starCount'),
  todayEvents: el('todayEvents'),
  todayRoutines: el('todayRoutines'),
  todayMeals: el('todayMeals'),
  googleConnectBtn: el('googleConnectBtn'),
  googleImportBtn: el('googleImportBtn'),
  syncStatus: el('syncStatus'),
  profileRail: el('profileRail'),
  dayTimeline: el('dayTimeline'),
  calendarProfileFilter: el('calendarProfileFilter'),
  todayJumpBtn: el('todayJumpBtn'),
  calendarUrlForm: el('calendarUrlForm'),
  calendarUrl: el('calendarUrl'),
  todoFilter: el('todoFilter'),
  routineCover: el('routineCover'),
  rewardForm: el('rewardForm'),
  rewardName: el('rewardName'),
  rewardCost: el('rewardCost'),
  rewardProfile: el('rewardProfile'),
  rewardPinned: el('rewardPinned'),
  rewardList: el('rewardList'),
  listPrivate: el('listPrivate'),
  listViews: el('listViews'),
  privacyWallpaperInput: el('privacyWallpaperInput'),
  orientationToggle: el('orientationToggle'),
  quickAddButton: el('quickAddButton'),
  quickAddMenu: el('quickAddMenu')
}

let viewDate = new Date()
let calendarView = 'day'
let activeProfileFilter = 'all'
let todoFilter = 'all'
let listView = 'board'
let profiles = readLocal(storage.profiles, [
  { id: crypto.randomUUID(), name: 'Anya', color: palette[0], avatar: '', stars: 0, allergy: '', emergency: '' },
  { id: crypto.randomUUID(), name: 'Apa', color: palette[1], avatar: '', stars: 0, allergy: '', emergency: '' },
  { id: crypto.randomUUID(), name: 'Gyerek 1', color: palette[2], avatar: '', stars: 0, allergy: '', emergency: '' },
  { id: crypto.randomUUID(), name: 'Gyerek 2', color: palette[3], avatar: '', stars: 0, allergy: '', emergency: '' }
])
let events = readLocal(storage.events, [])
let todos = readLocal(storage.todos, [])
let routines = readLocal(storage.routines, [])
let meals = readLocal(storage.meals, [])
let lists = readLocal(storage.lists, [{ id: crypto.randomUUID(), name: 'Bevásárlás', items: [] }])
let feelings = readLocal(storage.feelings, [])
let weatherState = readLocal(storage.weather, { zip: 'Budapest', days: [] })
let privacyMode = readLocal(storage.privacy, false)
let settings = { ...defaultSettings, ...readLocal(storage.settings, defaultSettings) }
let helperQueue = readLocal(storage.helper, [])
let rewards = readLocal(storage.rewards, [])

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function saveLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function normalizeBackendUrl(value) {
  const raw = (value || '').trim()
  if (!raw) return ''
  try {
    const url = new URL(raw)
    return url.origin + url.pathname.replace(/\/$/, '')
  } catch {
    return ''
  }
}

function apiUrl(path) {
  const base = normalizeBackendUrl(settings.backendUrl || configuredBackendUrl)
  return base ? `${base}${path}` : path
}

function getStateSnapshot() {
  return {
    [storage.profiles]: profiles,
    [storage.events]: events,
    [storage.todos]: todos,
    [storage.routines]: routines,
    [storage.meals]: meals,
    [storage.lists]: lists,
    [storage.feelings]: feelings,
    [storage.weather]: weatherState,
    [storage.privacy]: privacyMode,
    [storage.settings]: settings,
    [storage.helper]: helperQueue,
    [storage.rewards]: rewards
  }
}

async function syncToBackend() {
  try {
    await fetch(apiUrl('/api/state'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: getStateSnapshot() })
    })
    if (nodes.syncStatus) nodes.syncStatus.textContent = normalizeBackendUrl(settings.backendUrl || configuredBackendUrl)
      ? 'Közös háttértár: mentve.'
      : 'Helyi háttértár: mentve SQLite adatbázisba.'
  } catch {
    if (nodes.syncStatus) nodes.syncStatus.textContent = 'Háttértár: offline/localStorage mód.'
  }
}

async function loadBackendState() {
  try {
    const res = await fetch(apiUrl('/api/state'))
    if (!res.ok) return
    const data = await res.json()
    const state = data.state || {}
    profiles = state[storage.profiles] || profiles
    events = state[storage.events] || events
    todos = state[storage.todos] || todos
    routines = state[storage.routines] || routines
    meals = state[storage.meals] || meals
    lists = state[storage.lists] || lists
    feelings = state[storage.feelings] || feelings
    weatherState = state[storage.weather] || weatherState
    privacyMode = typeof state[storage.privacy] === 'boolean' ? state[storage.privacy] : privacyMode
    settings = { ...settings, ...(state[storage.settings] || {}) }
    if (!settings.backendUrl && configuredBackendUrl) settings.backendUrl = configuredBackendUrl
    helperQueue = state[storage.helper] || helperQueue
    rewards = state[storage.rewards] || rewards
    if (nodes.syncStatus) nodes.syncStatus.textContent = normalizeBackendUrl(settings.backendUrl || configuredBackendUrl)
      ? 'Közös háttértár: betöltve.'
      : 'Helyi háttértár: SQLite betöltve.'
  } catch {
    if (nodes.syncStatus) nodes.syncStatus.textContent = 'Háttértár: offline/localStorage mód.'
  }
}

async function updateGoogleStatus() {
  try {
    const res = await fetch(apiUrl('/api/google/status'))
    const data = await res.json()
    if (!nodes.syncStatus) return
    if (!data.configured) nodes.syncStatus.textContent = 'Google Naptár: .env még nincs konfigurálva.'
    else if (data.connected) nodes.syncStatus.textContent = 'Google Naptár: csatlakoztatva.'
    else nodes.syncStatus.textContent = 'Google Naptár: konfigurálva, de nincs csatlakoztatva.'
  } catch {
    if (nodes.syncStatus) nodes.syncStatus.textContent = 'Háttértár nem fut, localStorage mód.'
  }
}

function persistAll() {
  saveLocal(storage.profiles, profiles)
  saveLocal(storage.events, events)
  saveLocal(storage.todos, todos)
  saveLocal(storage.routines, routines)
  saveLocal(storage.meals, meals)
  saveLocal(storage.lists, lists)
  saveLocal(storage.feelings, feelings)
  saveLocal(storage.weather, weatherState)
  saveLocal(storage.privacy, privacyMode)
  saveLocal(storage.settings, settings)
  saveLocal(storage.helper, helperQueue)
  saveLocal(storage.rewards, rewards)
  syncToBackend()
}

async function importGoogleEvents() {
  if (!nodes.syncStatus) return
  nodes.syncStatus.textContent = 'Google Naptár import folyamatban...'
  try {
    const res = await fetch(apiUrl('/api/google/events'))
    const data = await res.json()
    if (!res.ok) {
      nodes.syncStatus.textContent = data.error || 'Google Naptár import sikertelen.'
      return
    }
    const imported = data.events || []
    const localEvents = events.filter(item => item.source !== 'google')
    const localIds = new Set(localEvents.map(item => item.id))
    events = [...localEvents, ...imported.filter(item => !localIds.has(item.id))]
    persistAll()
    renderAll()
    nodes.syncStatus.textContent = `Google Naptár import kész: ${imported.length} esemény.`
  } catch {
    nodes.syncStatus.textContent = 'Google Naptár import sikertelen: háttértár nem elérhető.'
  }
}

async function importCalendarUrl(url) {
  if (!nodes.syncStatus) return
  nodes.syncStatus.textContent = 'URL naptár import folyamatban...'
  try {
    const res = await fetch(apiUrl('/api/calendar-url'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, profileId: nodes.eventProfile.value })
    })
    const data = await res.json()
    if (!res.ok) {
      nodes.syncStatus.textContent = data.error || 'URL naptár import sikertelen.'
      return
    }
    const imported = data.events || []
    const existingIds = new Set(events.map(item => item.id))
    events = [...events, ...imported.filter(item => !existingIds.has(item.id))]
    persistAll()
    renderAll()
    nodes.syncStatus.textContent = `URL naptár import kész: ${imported.length} esemény.`
  } catch {
    nodes.syncStatus.textContent = 'URL naptár import sikertelen: backend nem elérhető.'
  }
}

function formatDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatEventDate(date, time) {
  const dateObj = new Date(`${date}T00:00:00`)
  const d = dateObj.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })
  return time ? `${d} ${time}` : d
}

function makePortraitDataUri(profile) {
  const index = Math.abs([...(profile.name || 'Hearth')].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % avatarThemes.length
  const [base, glow, ink] = avatarThemes[index]
  const initials = (profile.name || 'C')
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${profile.color || base}"/>
          <stop offset=".58" stop-color="${glow}"/>
          <stop offset="1" stop-color="#ffffff"/>
        </linearGradient>
        <radialGradient id="shine" cx=".26" cy=".16" r=".75">
          <stop offset="0" stop-color="#ffffff" stop-opacity=".8"/>
          <stop offset=".72" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="160" height="160" rx="44" fill="url(#bg)"/>
      <circle cx="52" cy="44" r="46" fill="url(#shine)"/>
      <circle cx="82" cy="72" r="31" fill="#fff8ef"/>
      <path d="M40 142c8-35 30-52 43-52s35 17 42 52" fill="${ink}" opacity=".86"/>
      <path d="M50 55c9-24 55-29 69 4-22-10-43 12-69-4z" fill="${ink}" opacity=".78"/>
      <circle cx="72" cy="76" r="4" fill="${ink}"/>
      <circle cx="94" cy="76" r="4" fill="${ink}"/>
      <path d="M75 92c7 6 18 6 25 0" stroke="${ink}" stroke-width="5" stroke-linecap="round" fill="none"/>
      <text x="80" y="137" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="900" fill="#fff">${initials}</text>
    </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function createAvatar(profile, size = 'small') {
  const avatar = document.createElement('span')
  avatar.className = `avatar ${size}`
  avatar.style.background = profile.color || 'var(--accent)'
  const image = document.createElement('img')
  image.src = profile.avatar || makePortraitDataUri(profile)
  image.alt = profile.name || 'Profil'
  avatar.appendChild(image)
  return avatar
}

function createProgressBar(value, max, color) {
  const progress = document.createElement('div')
  progress.className = 'progress-bar'
  const fill = document.createElement('span')
  fill.style.width = `${Math.min(100, Math.round((value / Math.max(max, 1)) * 100))}%`
  fill.style.background = color
  progress.appendChild(fill)
  return progress
}

function getProfile(id) {
  return profiles.find(p => p.id === id) || { name: 'Család', color: '#e4b44f', stars: 0 }
}

function getDefaultProfileId() {
  return profiles[0]?.id || ''
}

function migrateLegacyProfileColors() {
  let changed = false
  profiles = profiles.map((profile, index) => {
    if (!legacyPalette.has((profile.color || '').toLowerCase())) return profile
    changed = true
    return { ...profile, color: palette[index % palette.length] }
  })
  if (changed) saveLocal(storage.profiles, profiles)
}

function matchesActiveProfile(item) {
  return activeProfileFilter === 'all' || item.profileId === activeProfileFilter || !item.profileId
}

function importanceLabel(value) {
  return {
    normal: 'normál',
    important: 'fontos',
    household: 'bárki'
  }[value] || value || 'normál'
}

function routineTimeLabel(value) {
  return {
    morning: 'reggel',
    afternoon: 'délután',
    evening: 'este'
  }[value] || value || 'reggel'
}

function helperTypeLabel(value) {
  return {
    event: 'esemény',
    meal: 'menü',
    list: 'lista'
  }[value] || value
}

function updateProfileStars(profileId, amount) {
  const profile = profiles.find(p => p.id === profileId)
  if (!profile) return
  profile.stars = Math.max(0, (profile.stars || 0) + amount)
  persistAll()
  renderProfileSelects()
  renderProfiles()
  renderDashboard()
}

function celebrate(message = 'Szép munka!') {
  const burst = document.createElement('div')
  burst.className = 'celebration-burst'
  burst.textContent = message
  document.body.appendChild(burst)
  window.setTimeout(() => burst.remove(), 1700)
}

function renderProfileSelects() {
  const selects = [nodes.eventProfile, nodes.todoProfile, nodes.routineProfile, nodes.mealProfile, nodes.feelingProfile, nodes.rewardProfile]
  selects.forEach(select => {
    if (!select) return
    select.innerHTML = ''
    profiles.forEach(p => {
      const opt = document.createElement('option')
      opt.value = p.id
      opt.textContent = `${p.name} (${p.stars || 0} csillag)`
      select.appendChild(opt)
    })
  })
  if (nodes.calendarProfileFilter) {
    nodes.calendarProfileFilter.innerHTML = '<option value="all">Minden profil</option>'
    profiles.forEach(p => {
      const opt = document.createElement('option')
      opt.value = p.id
      opt.textContent = p.name
      nodes.calendarProfileFilter.appendChild(opt)
    })
    nodes.calendarProfileFilter.value = activeProfileFilter
  }
  renderProfileRail()
}

function renderProfileRail() {
  if (!nodes.profileRail) return
  nodes.profileRail.innerHTML = ''
  const allButton = document.createElement('button')
  allButton.type = 'button'
  allButton.className = `profile-chip ${activeProfileFilter === 'all' ? 'active' : ''}`
  allButton.dataset.profile = 'all'
  allButton.innerHTML = '<span class="avatar mini">∞</span><strong>Mindenki</strong><small>családi nézet</small>'
  nodes.profileRail.appendChild(allButton)
  profiles.forEach(profile => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = `profile-chip ${activeProfileFilter === profile.id ? 'active' : ''}`
    button.dataset.profile = profile.id
    button.appendChild(createAvatar(profile, 'mini'))
    const name = document.createElement('strong')
    name.textContent = profile.name
    const stars = document.createElement('small')
    stars.textContent = `${profile.stars || 0} csillag`
    button.append(name, stars)
    nodes.profileRail.appendChild(button)
  })
}

function createItem(title, subtitle, color, actions = [], profile = null) {
  const node = nodes.eventItemTemplate.content.cloneNode(true)
  const titleNode = node.querySelector('.event-title')
  const subNode = node.querySelector('.event-datetime')
  const actionsNode = node.querySelector('.item-actions')
  if (profile) node.querySelector('.event-info').before(createAvatar(profile))
  titleNode.textContent = title
  subNode.textContent = subtitle
  const badge = document.createElement('span')
  badge.className = 'badge'
  badge.style.background = color
  badge.style.color = '#1f1b24'
  badge.textContent = profile?.name || 'közös'
  node.querySelector('.event-info').appendChild(badge)
  const deleteButton = actionsNode.querySelector('.delete-btn')
  if (actions.length) {
    deleteButton.remove()
    actions.forEach(action => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = action.kind === 'done' ? 'done-btn' : 'delete-btn'
      btn.textContent = action.label
      btn.addEventListener('click', action.handler)
      actionsNode.appendChild(btn)
    })
  }
  return node
}

function renderEmpty(target, text) {
  target.innerHTML = ''
  const li = document.createElement('li')
  li.className = 'event-item'
  li.textContent = text
  target.appendChild(li)
}

function activateTab(target) {
  document.querySelectorAll('.tab-btn').forEach(t => t.classList.toggle('active', t.dataset.tab === target))
  document.querySelectorAll('.panel').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === target))
  const btn = document.querySelector(`.tab-btn[data-tab="${target}"]`)
  if (btn) {
    nodes.screenTitle.textContent = btn.textContent
    btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }
  if (nodes.quickAddMenu) nodes.quickAddMenu.classList.remove('open')
}

function renderTabs() {
  nodes.tabs.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn')
    if (!btn) return
    activateTab(btn.dataset.tab)
  })
}

function renderWeekdays() {
  nodes.weekdayRow.innerHTML = ''
  dayLabels.forEach(label => {
    const el = document.createElement('div')
    el.className = 'weekday'
    el.textContent = label
    nodes.weekdayRow.appendChild(el)
  })
}

function getMonthGridAnchor(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const day = first.getDay()
  const mondayBased = day === 0 ? 6 : day - 1
  first.setDate(first.getDate() - mondayBased)
  return first
}

function getWeekAnchor(date) {
  const anchor = new Date(date)
  const day = anchor.getDay()
  const mondayBased = day === 0 ? 6 : day - 1
  anchor.setDate(anchor.getDate() - mondayBased)
  return anchor
}

function hourToPosition(time) {
  if (!time) return 0
  const [hour, minute] = time.split(':').map(Number)
  const start = 6
  const end = 21
  const clamped = Math.min(end, Math.max(start, hour + (minute || 0) / 60))
  return ((clamped - start) / (end - start)) * 100
}

function renderDayCalendar() {
  const key = formatDateKey(viewDate)
  nodes.weekdayRow.style.display = 'none'
  nodes.calendarGrid.style.gridTemplateColumns = '1fr'
  nodes.calendarGrid.className = 'calendar-grid day-swimlane-grid'
  nodes.monthTitle.textContent = viewDate.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })

  const dayBoard = document.createElement('div')
  dayBoard.className = 'hearth-day-board'
  const visibleProfiles = profiles.filter(profile => activeProfileFilter === 'all' || activeProfileFilter === profile.id)
  dayBoard.style.setProperty('--profile-count', visibleProfiles.length)

  const profileHeader = document.createElement('div')
  profileHeader.className = 'hearth-profile-row'
  const allDayLabel = document.createElement('span')
  allDayLabel.className = 'all-day-label'
  allDayLabel.textContent = 'Egész nap'
  profileHeader.appendChild(allDayLabel)

  visibleProfiles.forEach(profile => {
    const person = document.createElement('div')
    person.className = 'hearth-person'
    person.appendChild(createAvatar(profile, 'large'))
    const name = document.createElement('strong')
    name.textContent = profile.name
    const meta = document.createElement('small')
    const todoCount = todos.filter(item => item.profileId === profile.id).length
    meta.textContent = `${todoCount} teendő`
    person.append(name, meta)
    profileHeader.appendChild(person)
  })
  dayBoard.appendChild(profileHeader)

  const laneGrid = document.createElement('div')
  laneGrid.className = 'hearth-lane-grid'
  laneGrid.style.setProperty('--profile-count', visibleProfiles.length)
  const timeRail = document.createElement('div')
  timeRail.className = 'time-rail'
  for (let hour = 6; hour <= 21; hour += 1) {
    const tick = document.createElement('span')
    tick.style.top = `${((hour - 6) / 15) * 100}%`
    tick.textContent = hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`
    timeRail.appendChild(tick)
  }
  laneGrid.appendChild(timeRail)

  visibleProfiles.forEach(profile => {
    const lane = document.createElement('div')
    lane.className = 'person-lane'
    lane.style.setProperty('--profile-color', profile.color)
    const profileEvents = events.filter(item => item.date === key && item.profileId === profile.id)
    profileEvents.forEach((item, index) => {
      const ev = document.createElement('button')
      ev.type = 'button'
      ev.className = `swimlane-event ${item.time ? '' : 'all-day-event'}`
      ev.style.background = profile.color
      ev.style.top = item.time ? `${hourToPosition(item.time)}%` : `${3 + index * 5}%`
      ev.textContent = `${item.title}${item.time ? ` ${item.time}` : ''}`
      lane.appendChild(ev)
    })
    laneGrid.appendChild(lane)
  })

  dayBoard.appendChild(laneGrid)
  nodes.calendarGrid.appendChild(dayBoard)
}

function renderCalendar() {
  const now = new Date()
  nodes.calendarGrid.innerHTML = ''
  nodes.calendarGrid.className = 'calendar-grid'
  if (calendarView === 'day') {
    renderDayCalendar()
    return
  }
  const count = calendarView === 'month' ? 42 : calendarView === 'week' ? 7 : 1
  const cursor = calendarView === 'month' ? getMonthGridAnchor(viewDate) : calendarView === 'week' ? getWeekAnchor(viewDate) : new Date(viewDate)
  nodes.weekdayRow.style.display = calendarView === 'day' ? 'none' : 'grid'
  nodes.calendarGrid.style.gridTemplateColumns = calendarView === 'day' ? '1fr' : 'repeat(7, minmax(0, 1fr))'
  nodes.monthTitle.textContent = calendarView === 'day'
    ? viewDate.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : viewDate.toLocaleDateString(locale, { year: 'numeric', month: 'long' })

  for (let i = 0; i < count; i += 1) {
    const cell = document.createElement('div')
    cell.className = 'day-cell'
    const key = formatDateKey(cursor)
    if (calendarView === 'month' && cursor.getMonth() !== viewDate.getMonth()) cell.classList.add('muted')
    if (key === formatDateKey(now)) cell.classList.add('today')
    const dayNumber = document.createElement('div')
    dayNumber.className = 'day-number'
    dayNumber.textContent = cursor.toLocaleDateString(locale, calendarView === 'day' ? { weekday: 'long', month: 'long', day: 'numeric' } : { day: 'numeric' })
    cell.appendChild(dayNumber)
    events.filter(item => item.date === key && matchesActiveProfile(item)).slice(0, calendarView === 'day' ? 20 : 4).forEach(item => {
      const ev = document.createElement('div')
      ev.className = 'day-event'
      ev.style.background = getProfile(item.profileId).color
      ev.textContent = `${item.time ? `${item.time} ` : ''}${item.title}`
      cell.appendChild(ev)
    })
    nodes.calendarGrid.appendChild(cell)
    cursor.setDate(cursor.getDate() + 1)
  }
}

function renderEvents() {
  nodes.eventList.innerHTML = ''
  const sorted = events
    .filter(matchesActiveProfile)
    .sort((a, b) => `${a.date}T${a.time || '00:00'}`.localeCompare(`${b.date}T${b.time || '00:00'}`))
  if (!sorted.length) return renderEmpty(nodes.eventList, 'Még nincs felvett esemény.')
  sorted.forEach(item => {
    const profile = getProfile(item.profileId)
    nodes.eventList.appendChild(createItem(item.title, `${formatEventDate(item.date, item.time)} • ${profile.name}`, profile.color, [
      { label: 'Törlés', kind: 'delete', handler: () => deleteEvent(item.id) }
    ], profile))
  })
}

function deleteEvent(id) {
  events = events.filter(e => e.id !== id)
  persistAll()
  renderAll()
}

function renderTodos() {
  nodes.todoList.innerHTML = ''
  const visible = todos.filter(item => {
    if (todoFilter === 'important') return item.importance === 'important'
    if (todoFilter === 'household') return item.importance === 'household'
    return matchesActiveProfile(item)
  })
  if (!visible.length) return renderEmpty(nodes.todoList, 'Nincs to-do.')
  visible.forEach(item => {
    const profile = getProfile(item.profileId)
    const subtitle = `${profile.name} • ${importanceLabel(item.importance)}${item.recurring ? ' • ismétlődő' : ''}`
    nodes.todoList.appendChild(createItem(item.title, subtitle, profile.color, [
      { label: 'Kész +1★', kind: 'done', handler: () => completeTodo(item) },
      { label: 'Törlés', kind: 'delete', handler: () => deleteTodo(item.id) }
    ], profile))
  })
}

function completeTodo(item) {
  updateProfileStars(item.profileId, 1)
  celebrate('+1 csillag')
  if (!item.recurring) todos = todos.filter(t => t.id !== item.id)
  persistAll()
  renderAll()
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id)
  persistAll()
  renderAll()
}

function renderRoutines() {
  nodes.routineList.innerHTML = ''
  const visible = routines.filter(matchesActiveProfile)
  if (!visible.length) return renderEmpty(nodes.routineList, 'Nincs rutin.')
  visible.forEach(item => {
    const profile = getProfile(item.profileId)
    const steps = item.tasks.length ? item.tasks.join(' → ') : 'nincs lépés'
    const node = createItem(item.name, `${profile.name} • ${routineTimeLabel(item.time)} • sorozat: ${item.streak || 0} • ${steps}`, profile.color, [
      { label: 'Kész +2★', kind: 'done', handler: () => completeRoutine(item) },
      { label: 'Törlés', kind: 'delete', handler: () => deleteRoutine(item.id) }
    ], profile)
    const li = node.querySelector('.event-item')
    if (item.cover && li) {
      const cover = document.createElement('img')
      cover.className = 'routine-cover'
      cover.src = item.cover
      cover.alt = item.name
      li.prepend(cover)
    }
    nodes.routineList.appendChild(node)
  })
}

function completeRoutine(item) {
  item.streak = (item.streak || 0) + 1
  updateProfileStars(item.profileId, 2)
  celebrate(`Sorozat ${item.streak}!`)
  persistAll()
  renderAll()
}

function deleteRoutine(id) {
  routines = routines.filter(r => r.id !== id)
  persistAll()
  renderAll()
}

function renderMeals() {
  nodes.mealList.innerHTML = ''
  const sorted = meals.filter(matchesActiveProfile).sort((a, b) => a.day.localeCompare(b.day))
  if (!sorted.length) return renderEmpty(nodes.mealList, 'Nincs tervezett étel.')
  sorted.forEach(item => {
    const profile = getProfile(item.profileId)
    nodes.mealList.appendChild(createItem(item.name, `${formatEventDate(item.day)} • ${profile.name}`, profile.color, [
      { label: 'Törlés', kind: 'delete', handler: () => deleteMeal(item.id) }
    ], profile))
  })
}

function deleteMeal(id) {
  meals = meals.filter(m => m.id !== id)
  persistAll()
  renderAll()
}

function renderLists() {
  nodes.listTarget.innerHTML = ''
  nodes.sharedList.innerHTML = ''
  if (!lists.length) return renderEmpty(nodes.sharedList, 'Nincs lista.')
  lists.forEach(l => {
    const opt = document.createElement('option')
    opt.value = l.id
    opt.textContent = l.name
    nodes.listTarget.appendChild(opt)
    const li = document.createElement('li')
    li.className = `event-item list-card ${listView === 'board' ? 'board-list' : 'check-list'}`
    const info = document.createElement('div')
    info.className = 'event-info'
    const title = document.createElement('strong')
    title.className = 'event-title'
    title.textContent = l.private ? `${l.name} • privát` : l.name
    const items = document.createElement('div')
    items.className = 'list-items'
    if (!l.items.length) {
      const empty = document.createElement('span')
      empty.className = 'event-datetime'
      empty.textContent = 'Üres lista'
      items.appendChild(empty)
    } else {
      l.items.forEach((text, index) => {
        const chip = document.createElement('button')
        chip.type = 'button'
        chip.className = 'list-chip'
        chip.textContent = listView === 'board' ? text : `✓ ${text}`
        chip.addEventListener('click', () => removeListItem(l.id, index))
        items.appendChild(chip)
      })
    }
    info.append(title, items)
    const actions = document.createElement('div')
    actions.className = 'item-actions'
    const del = document.createElement('button')
    del.className = 'delete-btn'
    del.type = 'button'
    del.textContent = 'Törlés'
    del.addEventListener('click', () => deleteList(l.id))
    actions.appendChild(del)
    li.append(info, actions)
    nodes.sharedList.appendChild(li)
  })
}

function deleteList(id) {
  lists = lists.filter(x => x.id !== id)
  persistAll()
  renderAll()
}

function removeListItem(listId, index) {
  const list = lists.find(item => item.id === listId)
  if (!list) return
  list.items.splice(index, 1)
  persistAll()
  renderAll()
}

function renderFeelings() {
  nodes.feelingList.innerHTML = ''
  const sorted = feelings.filter(matchesActiveProfile).sort((a, b) => b.date.localeCompare(a.date))
  if (!sorted.length) return renderEmpty(nodes.feelingList, 'Még nincs érzés riport.')
  sorted.slice(0, 20).forEach(item => {
    const profile = getProfile(item.profileId)
    nodes.feelingList.appendChild(createItem(`${feelingIcons[item.emoji] || '•'} ${item.emoji}`, `${profile.name} • ${formatEventDate(item.date)}${item.note ? ` • ${item.note}` : ''}`, profile.color, [
      { label: 'Törlés', kind: 'delete', handler: () => deleteFeeling(item.id) }
    ], profile))
  })
}

function deleteFeeling(id) {
  feelings = feelings.filter(f => f.id !== id)
  persistAll()
  renderAll()
}

function renderWeather() {
  nodes.weatherList.innerHTML = ''
  const days = weatherState.days || []
  if (!days.length) {
    nodes.weatherPreview.textContent = 'Nincs időjárás adat'
    nodes.weatherPill.textContent = 'Időjárás'
    return renderEmpty(nodes.weatherList, 'Nincs időjárás adat. Frissítsd a város alapján.')
  }
  const today = days[0]
  nodes.weatherPreview.textContent = `${weatherState.zip}: ${today.min}°C - ${today.max}°C`
  nodes.weatherPill.textContent = `${today.min}° / ${today.max}°C`
  days.forEach(d => {
    const title = new Date(`${d.date}T00:00:00`).toLocaleDateString(locale, { weekday: 'long', month: 'short', day: 'numeric' })
    nodes.weatherList.appendChild(createItem(title, `${d.min}°C - ${d.max}°C`, '#77a8d8', []))
  })
}

function renderProfiles() {
  nodes.profileList.innerHTML = ''
  if (!profiles.length) return renderEmpty(nodes.profileList, 'Nincs profil.')
  profiles.forEach(profile => {
    const subtitle = `${profile.stars || 0} csillag${profile.allergy ? ` • allergia: ${profile.allergy}` : ''}${profile.emergency ? ` • SOS: ${profile.emergency}` : ''}`
    nodes.profileList.appendChild(createItem(profile.name, subtitle, profile.color, [
      { label: '+5★', kind: 'done', handler: () => updateProfileStars(profile.id, 5) },
      { label: 'Törlés', kind: 'delete', handler: () => deleteProfile(profile.id) }
    ], profile))
  })
}

function deleteProfile(id) {
  if (profiles.length <= 1) return
  profiles = profiles.filter(p => p.id !== id)
  persistAll()
  renderAll()
}

function renderRewards() {
  if (!nodes.rewardList) return
  nodes.rewardList.innerHTML = ''
  const visible = rewards.filter(matchesActiveProfile)
  if (!visible.length) return renderEmpty(nodes.rewardList, 'Nincs jutalom cél.')
  visible.forEach(reward => {
    const profile = getProfile(reward.profileId)
    const stars = profile.stars || 0
    const canRedeem = stars >= reward.cost
    const li = document.createElement('li')
    li.className = `event-item reward-item ${reward.pinned ? 'pinned' : ''}`
    li.appendChild(createAvatar(profile))
    const info = document.createElement('div')
    info.className = 'event-info'
    const title = document.createElement('strong')
    title.className = 'event-title'
    title.textContent = reward.name
    const subtitle = document.createElement('span')
    subtitle.className = 'event-datetime'
    subtitle.textContent = `${profile.name} • ${stars}/${reward.cost} csillag${reward.pinned ? ' • kitűzött' : ''}`
    info.append(title, subtitle, createProgressBar(stars, reward.cost, profile.color))
    const actions = document.createElement('div')
    actions.className = 'item-actions'
    const redeem = document.createElement('button')
    redeem.className = canRedeem ? 'done-btn' : 'ghost-btn'
    redeem.type = 'button'
    redeem.textContent = canRedeem ? 'Kiváltás' : 'Gyűjtés'
    redeem.disabled = !canRedeem
    redeem.addEventListener('click', () => redeemReward(reward))
    const del = document.createElement('button')
    del.className = 'delete-btn'
    del.type = 'button'
    del.textContent = 'Törlés'
    del.addEventListener('click', () => deleteReward(reward.id))
    actions.append(redeem, del)
    li.append(info, actions)
    nodes.rewardList.appendChild(li)
  })
}

function redeemReward(reward) {
  updateProfileStars(reward.profileId, -reward.cost)
  celebrate('Jutalom kiváltva')
  rewards = rewards.filter(item => item.id !== reward.id)
  persistAll()
  renderAll()
}

function deleteReward(id) {
  rewards = rewards.filter(item => item.id !== id)
  persistAll()
  renderAll()
}

function renderHelper() {
  nodes.helperList.innerHTML = ''
  if (!helperQueue.length) return renderEmpty(nodes.helperList, 'Nincs jóváhagyásra váró elem.')
  helperQueue.forEach(item => {
    nodes.helperList.appendChild(createItem(item.title, helperTypeLabel(item.type), '#b889d8', [
      { label: 'Jóváhagy', kind: 'done', handler: () => approveHelper(item) },
      { label: 'Elvet', kind: 'delete', handler: () => rejectHelper(item.id) }
    ]))
  })
}

function approveHelper(item) {
  if (item.type === 'event') events.push({ id: crypto.randomUUID(), title: item.title, date: item.date, time: item.time, profileId: item.profileId })
  if (item.type === 'meal') meals.push({ id: crypto.randomUUID(), name: item.title, day: item.date, profileId: item.profileId })
  if (item.type === 'list') lists[0]?.items.push(item.title)
  rejectHelper(item.id)
}

function rejectHelper(id) {
  helperQueue = helperQueue.filter(h => h.id !== id)
  persistAll()
  renderAll()
}

function renderDashboard() {
  const today = formatDateKey(new Date())
  const todayEvents = events.filter(e => e.date === today && matchesActiveProfile(e))
  const todayMeals = meals.filter(m => m.day === today && matchesActiveProfile(m))
  const visibleTodos = todos.filter(matchesActiveProfile)
  const visibleRoutines = routines.filter(matchesActiveProfile)
  nodes.todayEventCount.textContent = todayEvents.length
  nodes.openTodoCount.textContent = visibleTodos.length
  nodes.starCount.textContent = profiles.reduce((sum, p) => sum + (p.stars || 0), 0)
  nodes.familySummary.textContent = `${settings.familyName} ritmusa`
  renderSummaryList(nodes.todayEvents, todayEvents.map(e => [e.title, `${e.time || 'egész nap'} • ${getProfile(e.profileId).name}`, getProfile(e.profileId).color, getProfile(e.profileId)]), 'Ma nincs esemény.')
  renderSummaryList(nodes.todayRoutines, visibleRoutines.slice(0, 5).map(r => [r.name, `${getProfile(r.profileId).name} • ${routineTimeLabel(r.time)} • sorozat ${r.streak || 0}`, getProfile(r.profileId).color, getProfile(r.profileId)]), 'Nincs rutin.')
  renderSummaryList(nodes.todayMeals, todayMeals.map(m => [m.name, getProfile(m.profileId).name, getProfile(m.profileId).color, getProfile(m.profileId)]), 'Ma nincs menü.')
  renderTimeline(todayEvents, todayMeals, visibleTodos)
}

function renderSummaryList(target, rows, emptyText) {
  target.innerHTML = ''
  if (!rows.length) return renderEmpty(target, emptyText)
  rows.forEach(row => target.appendChild(createItem(row[0], row[1], row[2], [], row[3] || null)))
}

function renderTimeline(dayEvents, dayMeals, dayTodos) {
  if (!nodes.dayTimeline) return
  nodes.dayTimeline.innerHTML = ''
  const timelineItems = [
    ...dayEvents.map(item => ({ time: item.time || '09:00', title: item.title, color: getProfile(item.profileId).color, profile: getProfile(item.profileId) })),
    ...dayMeals.map(item => ({ time: '18:00', title: `Menü: ${item.name}`, color: getProfile(item.profileId).color, profile: getProfile(item.profileId) })),
    ...dayTodos.slice(0, 4).map((item, index) => ({ time: `${String(15 + index).padStart(2, '0')}:00`, title: item.title, color: getProfile(item.profileId).color, profile: getProfile(item.profileId) }))
  ].sort((a, b) => a.time.localeCompare(b.time))
  if (!timelineItems.length) {
    const empty = document.createElement('div')
    empty.className = 'timeline-empty'
    empty.textContent = 'Ma nyugodt napnak néz ki.'
    nodes.dayTimeline.appendChild(empty)
    return
  }
  timelineItems.forEach(item => {
    const row = document.createElement('div')
    row.className = 'timeline-row'
    row.style.setProperty('--row-color', item.color)
    const time = document.createElement('strong')
    time.textContent = item.time
    const title = document.createElement('span')
    title.textContent = item.title
    row.append(time, createAvatar(item.profile, 'mini'), title)
    nodes.dayTimeline.appendChild(row)
  })
}

function applySettings() {
  settings.orientation = settings.orientation || 'portrait'
  document.body.classList.toggle('frame-white', settings.frame === 'white')
  document.body.classList.toggle('frame-black', settings.frame === 'black')
  document.body.classList.toggle('theme-light', settings.theme === 'light')
  document.body.classList.toggle('theme-night', settings.theme === 'night')
  document.body.classList.toggle('dimmed', Boolean(settings.bedtimeDim))
  document.body.classList.toggle('orientation-landscape', settings.orientation === 'landscape')
  document.body.style.setProperty('--privacy-wallpaper', settings.wallpaper ? `url("${settings.wallpaper}")` : 'linear-gradient(135deg, #f8d7bd, #f7efe5 48%, #dbefff)')
  nodes.familyNameLabel.textContent = settings.familyName
  nodes.familyNameInput.value = settings.familyName
  if (nodes.backendUrlInput) nodes.backendUrlInput.value = settings.backendUrl || configuredBackendUrl || ''
  nodes.frameSelect.value = settings.frame
  nodes.themeSelect.value = settings.theme
  nodes.bedtimeDim.checked = Boolean(settings.bedtimeDim)
  if (nodes.orientationToggle) {
    const landscape = settings.orientation === 'landscape'
    nodes.orientationToggle.textContent = landscape ? 'Álló nézet' : 'Fekvő nézet'
    nodes.orientationToggle.setAttribute('aria-label', landscape ? 'Álló nézetre váltás' : 'Fekvő nézetre váltás')
  }
}

function applyPrivacyMode() {
  document.body.classList.toggle('privacy', privacyMode)
  nodes.privacyToggle.textContent = privacyMode ? 'Privát mód ki' : 'Privát mód'
  nodes.privacyToggle.setAttribute('aria-label', privacyMode ? 'Privát mód kikapcsolása' : 'Privát mód bekapcsolása')
}

function setPrivacyMode(enabled) {
  privacyMode = enabled
  persistAll()
  applyPrivacyMode()
}

function tickClock() {
  const now = new Date()
  nodes.clock.textContent = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  nodes.todayLabel.textContent = now.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

async function updateWeatherByZip(zip) {
  const geoRes = await fetch(`${weatherGeoApi}?name=${encodeURIComponent(zip)}&count=1&language=hu&format=json`)
  if (!geoRes.ok) return
  const geoData = await geoRes.json()
  if (!geoData.results || !geoData.results.length) return
  const place = geoData.results[0]
  const wRes = await fetch(`${weatherApi}?latitude=${place.latitude}&longitude=${place.longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`)
  if (!wRes.ok) return
  const wData = await wRes.json()
  weatherState = {
    zip: place.name || zip,
    days: wData.daily.time.map((date, i) => ({ date, min: Math.round(wData.daily.temperature_2m_min[i]), max: Math.round(wData.daily.temperature_2m_max[i]) })).slice(0, 7)
  }
  persistAll()
  renderAll()
}

function readAvatarFile(file) {
  return new Promise(resolve => {
    if (!file) return resolve('')
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => resolve('')
    reader.readAsDataURL(file)
  })
}

function parseHelperText(text) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const date = text.toLowerCase().includes('holnap') ? formatDateKey(tomorrow) : formatDateKey(today)
  const timeMatch = text.match(/([01]?\d|2[0-3])[:.]([0-5]\d)/)
  const time = timeMatch ? `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}` : ''
  const profile = profiles.find(p => text.toLowerCase().includes(p.name.toLowerCase())) || profiles[0]
  const lower = text.toLowerCase()
  if (lower.includes('vacsora') || lower.includes('ebéd') || lower.includes('menü') || lower.includes('pizza')) return { type: 'meal', title: text, date, time, profileId: profile.id }
  if (lower.includes('vegyél') || lower.includes('bevásárl') || lower.includes('lista')) return { type: 'list', title: text, date, time, profileId: profile.id }
  return { type: 'event', title: text, date, time, profileId: profile.id }
}

function wireEvents() {
  if (nodes.orientationToggle) {
    nodes.orientationToggle.addEventListener('click', () => {
      settings.orientation = settings.orientation === 'landscape' ? 'portrait' : 'landscape'
      persistAll()
      applySettings()
      renderCalendar()
    })
  }
  if (nodes.quickAddButton && nodes.quickAddMenu) {
    nodes.quickAddButton.addEventListener('click', () => {
      nodes.quickAddMenu.classList.toggle('open')
      nodes.quickAddMenu.setAttribute('aria-hidden', nodes.quickAddMenu.classList.contains('open') ? 'false' : 'true')
    })
    nodes.quickAddMenu.addEventListener('click', e => {
      const btn = e.target.closest('[data-tab-target]')
      if (!btn) return
      activateTab(btn.dataset.tabTarget)
    })
    document.addEventListener('click', e => {
      if (!nodes.quickAddMenu.classList.contains('open')) return
      if (e.target.closest('#quickAddMenu') || e.target.closest('#quickAddButton')) return
      nodes.quickAddMenu.classList.remove('open')
      nodes.quickAddMenu.setAttribute('aria-hidden', 'true')
    })
  }
  nodes.profileRail.addEventListener('click', e => {
    const btn = e.target.closest('.profile-chip')
    if (!btn) return
    activeProfileFilter = btn.dataset.profile
    if (nodes.calendarProfileFilter) nodes.calendarProfileFilter.value = activeProfileFilter
    renderAll()
  })
  if (nodes.calendarProfileFilter) {
    nodes.calendarProfileFilter.addEventListener('change', () => {
      activeProfileFilter = nodes.calendarProfileFilter.value
      renderAll()
    })
  }
  if (nodes.todoFilter) {
    nodes.todoFilter.addEventListener('change', () => {
      todoFilter = nodes.todoFilter.value
      renderTodos()
    })
  }
  if (nodes.todayJumpBtn) {
    nodes.todayJumpBtn.addEventListener('click', () => {
      viewDate = new Date()
      renderCalendar()
    })
  }
  if (nodes.calendarUrlForm) {
    nodes.calendarUrlForm.addEventListener('submit', async e => {
      e.preventDefault()
      if (!nodes.calendarUrl.value.trim()) return
      await importCalendarUrl(nodes.calendarUrl.value.trim())
      nodes.calendarUrlForm.reset()
    })
  }
  if (nodes.listViews) {
    nodes.listViews.addEventListener('click', e => {
      const btn = e.target.closest('.view-btn')
      if (!btn) return
      listView = btn.dataset.listView
      nodes.listViews.querySelectorAll('.view-btn').forEach(item => item.classList.remove('active'))
      btn.classList.add('active')
      renderLists()
    })
  }
  if (nodes.googleConnectBtn) {
    nodes.googleConnectBtn.addEventListener('click', () => {
      window.location.href = apiUrl('/auth/google')
    })
  }
  if (nodes.googleImportBtn) nodes.googleImportBtn.addEventListener('click', importGoogleEvents)
  nodes.prevMonth.addEventListener('click', () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + (calendarView === 'month' ? -1 : 0), viewDate.getDate() - (calendarView === 'week' ? 7 : calendarView === 'day' ? 1 : 0))
    renderCalendar()
  })
  nodes.nextMonth.addEventListener('click', () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + (calendarView === 'month' ? 1 : 0), viewDate.getDate() + (calendarView === 'week' ? 7 : calendarView === 'day' ? 1 : 0))
    renderCalendar()
  })
  nodes.calendarViews.addEventListener('click', e => {
    const btn = e.target.closest('.view-btn')
    if (!btn) return
    calendarView = btn.dataset.view
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    renderCalendar()
  })
  nodes.privacyToggle.addEventListener('click', () => {
    setPrivacyMode(!privacyMode)
  })
  const display = document.querySelector('.display')
  if (display) {
    display.addEventListener('click', e => {
      if (!privacyMode || e.target.closest('.display-tools')) return
      setPrivacyMode(false)
    })
  }
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return
    if (privacyMode) setPrivacyMode(false)
    if (nodes.quickAddMenu) {
      nodes.quickAddMenu.classList.remove('open')
      nodes.quickAddMenu.setAttribute('aria-hidden', 'true')
    }
  })
  nodes.eventForm.addEventListener('submit', e => {
    e.preventDefault()
    if (!nodes.eventTitle.value.trim() || !nodes.eventDate.value) return
    events.push({ id: crypto.randomUUID(), title: nodes.eventTitle.value.trim(), date: nodes.eventDate.value, time: nodes.eventTime.value, profileId: nodes.eventProfile.value })
    persistAll()
    nodes.eventForm.reset()
    renderAll()
  })
  nodes.todoForm.addEventListener('submit', e => {
    e.preventDefault()
    if (!nodes.todoTitle.value.trim()) return
    todos.push({ id: crypto.randomUUID(), title: nodes.todoTitle.value.trim(), profileId: nodes.todoProfile.value, recurring: nodes.todoRecurring.checked, importance: nodes.todoImportance.value })
    persistAll()
    nodes.todoForm.reset()
    renderAll()
  })
  nodes.routineForm.addEventListener('submit', async e => {
    e.preventDefault()
    if (!nodes.routineName.value.trim()) return
    const cover = await readAvatarFile(nodes.routineCover.files[0])
    routines.push({ id: crypto.randomUUID(), name: nodes.routineName.value.trim(), profileId: nodes.routineProfile.value, time: nodes.routineTime.value, tasks: nodes.routineTasks.value.split(',').map(x => x.trim()).filter(Boolean), streak: 0, cover })
    persistAll()
    nodes.routineForm.reset()
    renderAll()
  })
  nodes.mealForm.addEventListener('submit', e => {
    e.preventDefault()
    if (!nodes.mealDay.value || !nodes.mealName.value.trim()) return
    meals.push({ id: crypto.randomUUID(), day: nodes.mealDay.value, name: nodes.mealName.value.trim(), profileId: nodes.mealProfile.value })
    persistAll()
    nodes.mealForm.reset()
    renderAll()
  })
  nodes.autoMealBtn.addEventListener('click', () => {
    const suggestions = ['Paradicsomos tészta', 'Csirkés wrap', 'Sült lazac rizzsel', 'Zöldségkrémleves', 'Marhapörkölt', 'Rántott karfiol', 'Házi pizza']
    const groceries = ['paradicsom', 'wrap', 'lazac', 'rizs', 'zöldség', 'marhahús', 'liszt']
    const start = new Date()
    for (let i = 0; i < 7; i += 1) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      meals.push({ id: crypto.randomUUID(), day: formatDateKey(day), name: suggestions[i], profileId: profiles[i % profiles.length].id })
    }
    const groceryList = lists.find(l => l.name.toLowerCase().includes('bevásárl')) || lists[0]
    groceryList.items.push(...groceries)
    persistAll()
    renderAll()
  })
  nodes.listForm.addEventListener('submit', e => {
    e.preventDefault()
    if (!nodes.listName.value.trim()) return
    lists.push({ id: crypto.randomUUID(), name: nodes.listName.value.trim(), items: [], private: nodes.listPrivate.checked })
    persistAll()
    nodes.listForm.reset()
    renderAll()
  })
  nodes.listItemForm.addEventListener('submit', e => {
    e.preventDefault()
    const target = lists.find(l => l.id === nodes.listTarget.value)
    if (!target || !nodes.listItemText.value.trim()) return
    target.items.push(nodes.listItemText.value.trim())
    persistAll()
    nodes.listItemForm.reset()
    renderAll()
  })
  nodes.feelingForm.addEventListener('submit', e => {
    e.preventDefault()
    feelings.push({ id: crypto.randomUUID(), profileId: nodes.feelingProfile.value, emoji: nodes.feelingEmoji.value, note: nodes.feelingNote.value.trim(), date: formatDateKey(new Date()) })
    persistAll()
    nodes.feelingForm.reset()
    renderAll()
  })
  nodes.weatherForm.addEventListener('submit', async e => {
    e.preventDefault()
    if (nodes.zipCode.value.trim()) await updateWeatherByZip(nodes.zipCode.value.trim())
  })
  nodes.helperForm.addEventListener('submit', e => {
    e.preventDefault()
    const parsed = parseHelperText(nodes.helperText.value.trim())
    helperQueue.push({ id: crypto.randomUUID(), ...parsed })
    persistAll()
    nodes.helperForm.reset()
    renderAll()
  })
  nodes.rewardForm.addEventListener('submit', e => {
    e.preventDefault()
    if (!nodes.rewardName.value.trim()) return
    rewards.push({
      id: crypto.randomUUID(),
      name: nodes.rewardName.value.trim(),
      cost: Number(nodes.rewardCost.value || 10),
      profileId: nodes.rewardProfile.value,
      pinned: nodes.rewardPinned.checked
    })
    persistAll()
    nodes.rewardForm.reset()
    renderAll()
  })
  nodes.profileForm.addEventListener('submit', async e => {
    e.preventDefault()
    if (!nodes.profileName.value.trim()) return
    const avatar = await readAvatarFile(nodes.profileAvatar.files[0])
    profiles.push({ id: crypto.randomUUID(), name: nodes.profileName.value.trim(), color: nodes.profileColor.value, avatar, allergy: nodes.profileAllergy.value.trim(), emergency: nodes.profileEmergency.value.trim(), stars: 0 })
    persistAll()
    nodes.profileForm.reset()
    renderAll()
  })
  nodes.settingsForm.addEventListener('submit', async e => {
    e.preventDefault()
    const wallpaper = await readAvatarFile(nodes.privacyWallpaperInput.files[0])
    settings = {
      ...settings,
      familyName: nodes.familyNameInput.value.trim() || 'Otthoni család',
      frame: nodes.frameSelect.value,
      theme: nodes.themeSelect.value,
      bedtimeDim: nodes.bedtimeDim.checked,
      orientation: settings.orientation || 'portrait',
      backendUrl: normalizeBackendUrl(nodes.backendUrlInput?.value || configuredBackendUrl),
      wallpaper: wallpaper || settings.wallpaper || ''
    }
    persistAll()
    applySettings()
    renderDashboard()
  })
}

function renderAll() {
  renderProfileSelects()
  renderCalendar()
  renderEvents()
  renderTodos()
  renderRoutines()
  renderMeals()
  renderLists()
  renderFeelings()
  renderWeather()
  renderProfiles()
  renderRewards()
  renderHelper()
  renderDashboard()
}

function seedDemoData() {
  const today = formatDateKey(new Date())
  if (!events.length && !todos.length && !routines.length && !meals.length) {
    events.push({ id: crypto.randomUUID(), title: 'Iskola / munka indulás', date: today, time: '07:45', profileId: getDefaultProfileId() })
    todos.push({ id: crypto.randomUUID(), title: 'Uzsonnás doboz elpakolása', profileId: profiles[2]?.id || getDefaultProfileId(), recurring: true, importance: 'household' })
    routines.push({ id: crypto.randomUUID(), name: 'Reggeli rutin', profileId: profiles[2]?.id || getDefaultProfileId(), time: 'morning', tasks: ['fogmosás', 'öltözés', 'táska'], streak: 0 })
    meals.push({ id: crypto.randomUUID(), day: today, name: 'Csirkés wrap', profileId: getDefaultProfileId() })
  }
  if (!rewards.length) rewards.push({ id: crypto.randomUUID(), name: 'Családi mozi este', cost: 12, profileId: profiles[2]?.id || getDefaultProfileId(), pinned: true })
  persistAll()
}

async function init() {
  renderTabs()
  renderWeekdays()
  await loadBackendState()
  migrateLegacyProfileColors()
  applySettings()
  applyPrivacyMode()
  seedDemoData()
  renderAll()
  const initialTab = window.location.hash.replace('#', '')
  if (initialTab && document.querySelector(`.panel[data-panel="${initialTab}"]`)) activateTab(initialTab)
  tickClock()
  setInterval(tickClock, 1000)
  wireEvents()
  updateGoogleStatus()
  if (weatherState.zip && (!weatherState.days || !weatherState.days.length)) updateWeatherByZip(weatherState.zip)
}

init()
