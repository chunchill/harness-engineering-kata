import { useState } from 'react'
import * as api from '../api/client'
import { useI18n } from '../i18n/useI18n'

type Mode = 'login' | 'register'

export function AuthPage(props: { onAuthed: () => void }) {
  const { t } = useI18n()
  const [mode, setMode] = useState<Mode>('login')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setBusy(true)
    setError(null)
    try {
      if (mode === 'register') {
        await api.register({ phone, password })
      } else {
        await api.login({ phone, password })
      }
      props.onAuthed()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{t('board.title')}</h1>

        <div className="auth-tabs" role="tablist" aria-label="auth mode">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
            role="tab"
            aria-selected={mode === 'login'}
          >
            {t('auth.login')}
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
            role="tab"
            aria-selected={mode === 'register'}
          >
            {t('auth.register')}
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <label className="auth-label">
          {t('auth.phone')}
          <input
            className="auth-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            autoComplete="tel"
            placeholder="13800000000"
          />
        </label>

        <label className="auth-label">
          {t('auth.password')}
          <input
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          />
        </label>

        <button type="button" className="auth-primary" onClick={submit} disabled={busy}>
          {mode === 'register' ? t('auth.register') : t('auth.login')}
        </button>

        <div className="auth-divider">
          <span>{t('auth.or')}</span>
        </div>

        <a className="auth-wechat" href={api.wechatLoginUrl()}>
          {t('auth.wechatLogin')}
        </a>
      </div>
    </div>
  )
}

