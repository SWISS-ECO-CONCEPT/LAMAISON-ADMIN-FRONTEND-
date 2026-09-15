import React, { useEffect, useState } from 'react'
import CTable from '../components/CTable'

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
type Role = 'AGENT' | 'PROSPECT' | 'ADMIN'
type User = {
    id: number;
    clerkId: string;
    firstname: string;
    role: Role;
    phone: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}
const Users: React.FC = () => {
    const [error, setError] = useState<string | null>(null)
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch(`${API_BASE}/admin/users`, {
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
                    throw new Error(json?.error?.message ?? json?.message ?? 'Échec récupération des utilisateurs');
                }
                const data = (json?.data ?? json) as User[];
                const safe = Array.isArray(data) ? data : [];
                setUsers(safe);
                return json;
            } catch (error: unknown) {
                setError(error instanceof Error ? error.message : String(error));
            }
        }
        fetchUsers()
    }, [error, users])

    return (
        <div>
            <CTable className='grid grid-col-1 md:grid-col-2 lg:grid-col-3' data={users} />
        </div>
    )
}

export default Users
