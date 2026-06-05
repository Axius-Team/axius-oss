import { NextResponse } from 'next/server'
import Docker from 'dockerode'

const docker = new Docker()

export async function GET() {
  try {
    const images = await docker.listImages()
    const data = images.map((img: any) => ({
      id: img.Id,
      repository: (img.RepoTags?.[0] || '').split(':')[0] || '<none>',
      tag: (img.RepoTags?.[0] || '').split(':')[1] || '<none>',
      size: img.Size,
      created: img.Created,
    }))

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to list images' },
      { status: 500 }
    )
  }
}
