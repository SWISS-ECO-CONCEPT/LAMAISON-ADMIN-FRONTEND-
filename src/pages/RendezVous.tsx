import React, { useEffect, useState } from 'react'
import CTable from '../components/CTable'

const API_BASE = 'http://localhost:5000'

type UserRef = {
  id: number
  firstname?: string
}

type AnnonceRef = {
  id: number
  titre?: string
}

type Rdv = {
  id: number
  date: string
  proposedDate?: string | null
  nom: string
  prenom: string
  email: string
  telephone: string
  message: string
  status: string
  createdAt: string
  prospect?: UserRef
  annonce?: AnnonceRef
}

const RendezVous: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [rdvs, setRdvs] = useState<Rdv[]>([])

  useEffect(() => {
    async function fetchRdvs() {
      try {
        const res = await fetch(`${API_BASE}/admin/rdv`)
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Erreur serveur (${res.status})`)
        }
        const data = await res.json()
        setRdvs(data.data)
        return data
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : String(error))
      }
    }
    fetchRdvs()
  }, [error, rdvs])



  return (
    <div>
      <CTable className='grid grid-col-1 md:grid-col-2 lg:grid-col-3' data={rdvs} />
    </div>
  )
}

export default RendezVous
