import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

// Alta de usuarios del panel. No hay registro público.
//   node ace users:create --email=ana@x.mx --name="Ana López" --role=recruiter
// La contraseña se pide en pantalla (no queda en el historial de la terminal).
export default class UsersCreate extends BaseCommand {
  static commandName = 'users:create'
  static description = 'Crea un usuario del panel de reclutamiento'
  static options: CommandOptions = { startApp: true }

  @flags.string({ description: 'Correo', required: true }) declare email: string
  @flags.string({ description: 'Nombre completo', required: true }) declare name: string
  @flags.string({ description: 'admin | recruiter', default: 'recruiter' }) declare role: string
  @flags.string({ description: 'Contraseña (sólo para scripts de prueba)' })
  declare password?: string

  async run() {
    const { default: User } = await import('#models/user')
    if (!['admin', 'recruiter'].includes(this.role)) {
      this.logger.error('role debe ser admin o recruiter')
      this.exitCode = 1
      return
    }
    const email = this.email.trim().toLowerCase()
    if (await User.findBy('email', email)) {
      this.logger.error(`Ya existe ${email}`)
      this.exitCode = 1
      return
    }
    const password: string =
      this.password ?? (await this.prompt.secure('Contraseña (mínimo 12 caracteres)')) ?? ''
    if (password.length < 12) {
      this.logger.error('La contraseña debe tener al menos 12 caracteres')
      this.exitCode = 1
      return
    }
    const user = await User.create({
      email,
      fullName: this.name.trim(),
      password,
      role: this.role as 'admin' | 'recruiter',
      isActive: true,
    })
    this.logger.success(`Usuario #${user.id} ${user.email} (${user.role})`)
  }
}
