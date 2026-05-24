// app/services/s3_cv_uploader.ts
// Sube CVs (PDF/DOC/DOCX/imagen) al bucket S3-compatible (Railway Tigris)
// y regresa la URL publica. Reemplaza a ftp_cv_uploader.ts. Mismo contrato.
// NOTA: NO transforma el archivo (no Sharp, no webp) — preserva el original.

import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'

type UploadOpts = { candidateId: number; localPath: string; originalName?: string }

function getClient() {
  const endpoint = process.env.S3_ENDPOINT
  const region = process.env.S3_REGION || 'auto'
  const accessKeyId = process.env.S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error('S3_ENDPOINT/S3_ACCESS_KEY_ID/S3_SECRET_ACCESS_KEY no configurados')
  }
  return new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  })
}

function pathPrefixFromBaseUrl(baseUrl: string) {
  try {
    return new URL(baseUrl).pathname.replace(/^\/+|\/+$/g, '')
  } catch {
    return ''
  }
}

function contentTypeFromExt(ext: string): string {
  const e = ext.toLowerCase().replace(/^\./, '')
  switch (e) {
    case 'pdf':
      return 'application/pdf'
    case 'doc':
      return 'application/msword'
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    default:
      return 'application/octet-stream'
  }
}

export default class S3CvUploader {
  static async upload({ candidateId, localPath, originalName }: UploadOpts) {
    const bucket = process.env.S3_BUCKET
    const baseUrl = process.env.MEDIA_BASE_URL
    if (!bucket) throw new Error('S3_BUCKET no configurado')
    if (!baseUrl) throw new Error('MEDIA_BASE_URL no configurado')

    const ext = (originalName && path.extname(originalName)) || path.extname(localPath) || '.pdf'
    const safeExt = ext.toLowerCase().replace(/[^.\w]/g, '')
    const fileName = `${Date.now()}-${randomUUID()}${safeExt}`

    const prefix = pathPrefixFromBaseUrl(baseUrl)
    const relativePath = `candidates/cv/${candidateId}/${fileName}`
    const key = prefix ? `${prefix}/${relativePath}` : relativePath

    // Put + verify con reintentos. Tigris/Railway puede dar "ack" a un Put que
    // no persiste (Put fantasma) → fila huérfana apuntando a 404. Confirmamos
    // con HeadObject; si falla, reintentamos hasta MAX_ATTEMPTS con backoff
    // corto. Si agota los intentos, lanza (→ 500) — no escondemos un outage
    // real de Tigris ni dejamos loop infinito.
    const MAX_ATTEMPTS = 3
    let lastErr: any = null
    try {
      const body = fs.readFileSync(localPath)
      const client = getClient()

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          await client.send(
            new PutObjectCommand({
              Bucket: bucket,
              Key: key,
              Body: body,
              ContentType: contentTypeFromExt(safeExt),
              CacheControl: 'public, max-age=31536000, immutable',
            })
          )
          // Verifica que el objeto realmente aterrizó (cubre el Put fantasma).
          await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
          lastErr = null
          break
        } catch (err: any) {
          lastErr = err
          console.error(
            JSON.stringify({
              event: 'cv_upload',
              status: 'retry',
              attempt,
              maxAttempts: MAX_ATTEMPTS,
              bucket,
              key,
              errorName: err?.name,
              errorMessage: err?.message,
            })
          )
          if (attempt < MAX_ATTEMPTS) {
            await new Promise((resolve) => setTimeout(resolve, 300 * attempt))
          }
        }
      }

      if (lastErr) {
        console.error(
          JSON.stringify({
            event: 'cv_upload',
            status: 'failed',
            attempts: MAX_ATTEMPTS,
            bucket,
            key,
            errorName: lastErr?.name,
            errorMessage: lastErr?.message,
          })
        )
        throw new Error(`s3_upload_verify_failed after ${MAX_ATTEMPTS} attempts: ${key}`)
      }
    } finally {
      try {
        fs.unlinkSync(localPath)
      } catch {}
    }

    return `${baseUrl}/${relativePath}`
  }

  static async delete(url: string) {
    const bucket = process.env.S3_BUCKET
    const baseUrl = process.env.MEDIA_BASE_URL
    if (!bucket || !baseUrl) return
    if (!url.startsWith(baseUrl)) return
    const prefix = pathPrefixFromBaseUrl(baseUrl)
    const relative = url.slice(baseUrl.length).replace(/^\/+/, '')
    if (!relative) return
    const key = prefix ? `${prefix}/${relative}` : relative
    const client = getClient()
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
  }
}
