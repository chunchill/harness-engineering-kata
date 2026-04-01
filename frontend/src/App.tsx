import { useEffect, useState } from 'react'
import { TaskBoard } from './components/TaskBoard'
import { AuthPage } from './components/AuthPage'
import * as api from './api/client'
import './App.css'

function App() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    api.me().then(() => setAuthed(true)).catch(() => setAuthed(false))
  }, [])

  if (authed === null) return null

  return (
    <main className="app-shell">
      {authed ? <TaskBoard onLoggedOut={() => setAuthed(false)} /> : <AuthPage onAuthed={() => setAuthed(true)} />}
    </main>
  )
}

export default App
