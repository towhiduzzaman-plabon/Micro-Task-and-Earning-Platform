import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/middleware/auth'

export const POST = requireAuth(async (req, user) => {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    // Upload to ImageBB
    const imgbbResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!imgbbResponse.ok) {
      throw new Error('ImageBB upload failed')
    }

    const imgbbData = await imgbbResponse.json()

    if (imgbbData.success) {
      return NextResponse.json({ url: imgbbData.data.url })
    } else {
      throw new Error('ImageBB upload failed')
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || 'Failed to upload image' }, { status: 500 })
  }
})




