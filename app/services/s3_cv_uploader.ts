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

    try {
      const body = fs.readFileSync(localPath)
      const client = getClient()
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: contentTypeFromExt(safeExt),
          CacheControl: 'public, max-age=31536000, immutable',
        })
      )

      // Verify the object actually landed in the bucket. Without this, a Put
      // that resolves without throwing but doesn't persist (Tigris/Railway can
      // ack a partial write) leaves a DB row pointing to a 404 forever.
      // Same guard as s3_menu_uploader.
      await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    } catch (err: any) {
      console.error(
        JSON.stringify({
          event: 'cv_upload',
          status: 'error',
          bucket,
          key,
          errorName: err?.name,
          errorMessage: err?.message,
        })
      )
      throw new Error(`s3_upload_verify_failed: ${key}`)
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
