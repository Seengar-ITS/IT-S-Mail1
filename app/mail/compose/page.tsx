'use client'
import { useRouter } from 'next/navigation'
import { ComposeWindow } from '@/components/mail/ComposeWindow'

export default function ComposePage() {
  const router = useRouter()
  return <ComposeWindow onClose={() => router.push('/mail/inbox')} />
}
