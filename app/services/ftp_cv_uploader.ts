// app/services/ftp_cv_uploader.ts
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import ftp from 'basic-ftp'

type UploadOpts = { candidateId: number; localPath: string; originalName?: string }

export default class FtpCvUploader {
  static async upload({ candidateId, localPath, originalName }: UploadOpts) {
    // Usa SIEMPRE tu FTPS_* y MEDIA_BASE_URL existentes
    const host = process.env.FTPS_HOST!
    const port = Number(process.env.FTPS_PORT || 21)
    const user = process.env.FTPS_USER!
    const password = process.env.FTPS_PASS!
    const secure = String(process.env.FTPS_SECURE ?? 'true') === 'true'
    const baseUrl = process.env.MEDIA_BASE_URL! // https://.../traspasos

    if (!host || !user || !password || !baseUrl) {
      throw new Error('FTPS/MEDIA_BASE_URL no configurados')
    }

    // nombre de archivo (mantiene extensión original o .pdf)
    const ext = (originalName && path.extname(originalName)) || path.extname(localPath) || '.pdf'
    const safeExt = ext.toLowerCase().replace(/[^.\w]/g, '')
    const fileName = `${Date.now()}-${randomUUID()}${safeExt}`

    // SUBCARPETA deseada dentro de /traspasos
    const remoteDir = `candidates/cv/${candidateId}`

    const client = new ftp.Client()
    try {
      await client.access({ host, port, user, password, secure })
      await client.ensureDir(remoteDir) // /traspasos/candidates/cv/1
      await client.uploadFrom(localPath, fileName) // sube archivo
      try {
        await client.cd('/')
      } catch {}
    } finally {
      try {
        client.close()
      } catch {}
      try {
        fs.unlinkSync(localPath)
      } catch {}
    }

    // URL pública bajo /traspasos
    return `${baseUrl}/candidates/cv/${candidateId}/${fileName}`
  }
}
