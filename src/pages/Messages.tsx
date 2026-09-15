import React, { useEffect, useState } from 'react'
import CTable from '../components/CTable'

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
        const res = await fetch(`${API_BASE}/admin/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
          credentials: "include",
        })
        if (!res.ok) {
          let msg = `Erreur serveur (${res.status})`;
          try {
            const errJson = await res.json();
            msg = errJson?.error?.message ?? errJson?.message ?? msg;
          } catch {
            try {
              const text = await res.text();
              if (text) msg = text;
            } catch { /* ignore */ }
          }
          throw new Error(msg);
        }
        const json = await res.json();
        if (json && typeof json === 'object' && 'success' in json && json.success !== true) {
          throw new Error(json?.error?.message ?? json?.message ?? 'Échec récupération des messages');
        }
        const data = (json?.data ?? json) as Message[];
        const safe = Array.isArray(data) ? data : [];
        setMessages(safe);
        return json;
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : String(error));
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
