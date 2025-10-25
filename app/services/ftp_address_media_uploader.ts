// app/services/ftp_address_media_uploader.ts
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import ftp from 'basic-ftp'
import sharp from 'sharp'

type UploadOpts = { candidateId: number; localPath: string }

export default class FtpAddressMediaUploader {
  static async upload({ candidateId, localPath }: UploadOpts) {
    const host = process.env.FTPS_HOST!
    const port = Number(process.env.FTPS_PORT || 21)
    const user = process.env.FTPS_USER!
    const password = process.env.FTPS_PASS!
    const secure = String(process.env.FTPS_SECURE ?? 'true') === 'true'
    const baseUrl = process.env.MEDIA_BASE_URL! // https://.../traspasos

    if (!host || !user || !password || !baseUrl) {
      throw new Error('FTPS/MEDIA_BASE_URL no configurados')
    }

    const outExt = 'webp'
    const fileName = `${Date.now()}-${randomUUID()}.${outExt}`
    const tmpOptimized = `${localPath}.opt.${outExt}`

    // Optimiza imagen → WEBP
    const MAX_W = 1600
    const input = sharp(localPath, { failOn: 'none' }).rotate()
    const meta = await input.metadata()
    const width = meta.width && meta.width > MAX_W ? MAX_W : meta.width || MAX_W
    await input.resize({ width }).webp({ quality: 80, effort: 4 }).toFile(tmpOptimized)

    // SUBCARPETA deseada
    const remoteDir = `candidates/address/${candidateId}`

    const client = new ftp.Client()
    try {
      await client.access({ host, port, user, password, secure })
      await client.ensureDir(remoteDir) // /traspasos/candidates/address/1
      await client.uploadFrom(tmpOptimized, fileName)
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
      try {
        fs.unlinkSync(tmpOptimized)
      } catch {}
    }

    // URL pública bajo /traspasos
    return `${baseUrl}/candidates/address/${candidateId}/${fileName}`
  }
}
