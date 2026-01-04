import React, { useEffect, useState } from 'react'
import CTable from '../components/CTable'

const API_BASE = 'http://localhost:5000'

type UserRef = {
  id: number
  firstname?: string
  clerkId?: string
}

type Message = {
  id: number
  senderId: number
  receiverId: number
  content: string
  createdAt: Date
  updatedAt: Date
  sender?: UserRef
  receiver?: UserRef
}

const Messages: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`${API_BASE}/admin/messages`)
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Erreur serveur (${res.status})`)
        }
        const data = await res.json()
        setMessages(data.data)
        return data
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : String(error))
      }
    }
    fetchMessages()
  }, [error, messages])

  
  return (
    <div>
      <CTable className='grid grid-col-1 md:grid-col-2 lg:grid-col-3' data={messages} />
    </div>
  )
}

export default Messages
