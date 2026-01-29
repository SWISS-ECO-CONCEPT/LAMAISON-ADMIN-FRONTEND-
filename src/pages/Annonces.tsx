import React, { useState,useEffect } from 'react'
import CTable from '../components/CTable';

const API_BASE = 'http://localhost:5000'

type TypeBien = "maison" | "appartement" | "terrain";

type Annonces = {
  titre: string;
  description: string;
  prix: number;
  ville: string;
  proprietaireId: number;
  type?: TypeBien;
  surface?: number;
  chambres?: number;
  douches?: number;
  images: string[];
  bn_reference?: string;
}


const Annonces: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [annonces, setAnnonces] = useState<Annonces[]>([])
  useEffect(() => {
    async function fetchAnnonces() {
      try {
        const res = await fetch(`${API_BASE}/admin/annonces`)
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Erreur serveur (${res.status})`)
        }
        const data = await res.json()
        setAnnonces(data.data)
        return data
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : String(error))
      }
    }
    fetchAnnonces()
  }, [error, annonces])

 

  return (
    <div>
        <CTable className='grid grid-col-1 md:grid-col-2 lg:grid-col-3' data={annonces} />
    </div>
  )
}

export default Annonces

