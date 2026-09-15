import React, { useState, useEffect } from 'react'
import CTable from '../components/CTable';

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/v1";

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
        const res = await fetch(`${API_BASE}/admin/annonces`, {
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
          throw new Error(json?.error?.message ?? json?.message ?? 'Échec récupération des annonces');
        }
        const data = (json?.data ?? json) as Annonces[];
        const safe = Array.isArray(data) ? data : [];
        setAnnonces(safe);
        return json;
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : String(error));
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

