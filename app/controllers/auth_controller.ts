import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { currentUser } from '#services/actor'

// Límite simple de intentos por correo e IP: 5 fallos en 15 minutos.
const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILS = 5
const fails = new Map<string, { count: number; until: number }>()

export default class AuthController {
  // POST /api/auth/login
  async login({ request, response }: HttpContext) {
    const email = String(request.input('email') ?? '')
      .trim()
      .toLowerCase()
    const password = String(request.input('password') ?? '')
    if (!email || !password) return response.badRequest({ error: 'Correo y contraseña requeridos' })

    const key = `${email}|${request.ip()}`
    const f = fails.get(key)
    if (f && f.count >= MAX_FAILS && f.until > Date.now()) {
      return response.tooManyRequests({ error: 'Demasiados intentos. Espera 15 minutos.' })
    }

    let user: User
    try {
      user = await User.verifyCredentials(email, password)
    } catch {
      const prev = f && f.until > Date.now() ? f.count : 0
      fails.set(key, { count: prev + 1, until: Date.now() + WINDOW_MS })
      return response.unauthorized({ error: 'Correo o contraseña incorrectos' })
    }
    if (!user.isActive) return response.unauthorized({ error: 'Usuario desactivado' })

    fails.delete(key)
    const token = await User.accessTokens.create(user, ['*'], { name: 'panel' })
    return {
      token: token.value!.release(),
      expiresAt: token.expiresAt,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    }
  }

  // GET /api/auth/me
  async me(ctx: HttpContext) {
    const user = currentUser(ctx)
    if (!user) return ctx.response.unauthorized({ error: 'Sin sesión' })
    return { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
  }

  // POST /api/auth/logout
  async logout(ctx: HttpContext) {
    const user = currentUser(ctx)
    const token = ctx.auth.use('api').user?.currentAccessToken
    if (user && token) await User.accessTokens.delete(user, token.identifier)
    return { ok: true }
  }
}
