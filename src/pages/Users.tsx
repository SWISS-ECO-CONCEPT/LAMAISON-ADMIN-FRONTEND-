import React, { useEffect, useState } from 'react'
import CTable from '../components/CTable'

const API_BASE = 'http://localhost:5000'
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
const Users:React.FC = () => {
    const [error, setError] = useState<string | null>(null)
    const [users,setUsers] = useState<User[]>([])

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch(`${API_BASE}/admin/users`)
                if (!res.ok) {
                    const text = await res.text()
                    throw new Error(text || `Erreur serveur (${res.status})`)
                }
                const data = await res.json()
                setUsers(data.data)
                return data
            } catch (error: unknown) {
                setError(error instanceof Error ? error.message : String(error))
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
