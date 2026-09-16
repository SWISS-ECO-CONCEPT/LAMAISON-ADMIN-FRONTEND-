import React, { useEffect, useState } from 'react'
import CTable from '../components/CTable'

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/v1";

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
        const res = await fetch(`${API_BASE}/admin/rdv`, {
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
          throw new Error(json?.error?.message ?? json?.message ?? 'Échec récupération des rendez-vous');
        }
        const data = (json?.data ?? json) as Rdv[];
        const safe = Array.isArray(data) ? data : [];
        safe.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.date ? new Date(a.date).getTime() : a.id);
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.date ? new Date(b.date).getTime() : b.id);
          return timeB - timeA;
        });
        setRdvs(safe);
        return json;
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : String(error));
      }
    }
    fetchRdvs()
  }, [])



  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <CTable className='grid grid-col-1 md:grid-col-2 lg:grid-col-3' data={rdvs} />
    </div>
  )
}

export default RendezVous
