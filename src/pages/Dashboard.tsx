import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Home,
    Users,
    Calendar,
    MessageSquare,
} from "lucide-react";

const API_BASE = 'http://localhost:5000'

type Annonce = {
    id: number
    createdAt: string
}

type User = {
    id: number
    role: 'AGENT' | 'PROSPECT'
}

type Rdv = {
    id: number
}

type Message = {
    id: number
}

const Dashboard: React.FC = () => {
    const [annonces, setAnnonces] = useState<Annonce[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [rdvs, setRdvs] = useState<Rdv[]>([])
    const [messages, setMessages] = useState<Message[]>([])

    // Fetch all data
    useEffect(() => {
        async function fetchAllData() {
            try {
                const [annoncesRes, usersRes, rdvsRes, messagesRes] = await Promise.all([
                    fetch(`${API_BASE}/admin/annonces`),
                    fetch(`${API_BASE}/admin/users`),
                    fetch(`${API_BASE}/admin/rdv`),
                    fetch(`${API_BASE}/admin/messages`)
                ])

                if (annoncesRes.ok) {
                    const data = await annoncesRes.json()
                    setAnnonces(data.data || [])
                }
                if (usersRes.ok) {
                    const data = await usersRes.json()
                    setUsers(data.data || [])
                }
                if (rdvsRes.ok) {
                    const data = await rdvsRes.json()
                    setRdvs(data.data || [])
                }
                if (messagesRes.ok) {
                    const data = await messagesRes.json()
                    setMessages(data.data || [])
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error)
            }
        }
        fetchAllData()
    }, [])

    // Calculer les stats en fonction des vraies données
    const stats = [
        { id: 1, title: "Annonces", value: annonces.length, icon: <Home className="text-blue-600" /> },
        { id: 2, title: "Utilisateurs", value: users.length, icon: <Users className="text-green-600" /> },
        { id: 3, title: "Rendez-vous", value: rdvs.length, icon: <Calendar className="text-orange-500" /> },
        { id: 4, title: "Messages", value: messages.length, icon: <MessageSquare className="text-purple-500" /> },
    ];

    // 📊 Données du graphique d'évolution (annonces par mois)
    const annonceData = Array.from({ length: 12 }, (_, i) => {
        const mois = new Date(new Date().getFullYear(), i, 1).toLocaleDateString('fr-FR', { month: 'short' })
        const count = annonces.filter(annonce => {
            const annonceMonth = new Date(annonce.createdAt).getMonth()
            return annonceMonth === i
        }).length
        return { mois, annonces: count }
    });

    // 🥧 Données du graphique camembert (répartition des rôles)
    const roleData = [
        { name: "Agents", value: users.filter(u => u.role === 'AGENT').length },
        { name: "Prospects", value: users.filter(u => u.role === 'PROSPECT').length }
        // { name: "Admins", value: users.filter(u => u.role === 'ADMIN').length },
    ].filter(r => r.value > 0);

    const COLORS = ["#3b82f6", "#22c55e", "#f97316"];

    return (
        <div className="p-6 space-y-6">
            {/* 🧩 En-tête */}
            <h2 className="text-2xl font-semibold text-gray-800">
                Bienvenue sur le tableau de bord
            </h2>

            {/* 📈 Cartes de stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between hover:shadow-lg transition-all"
                    >
                        <div>
                            <p className="text-sm text-gray-500">{item.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-full">{item.icon}</div>
                    </div>
                ))}
            </div>

            {/* 📊 Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 📈 Ligne d'évolution */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Évolution des annonces
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={annonceData}>
                            <XAxis dataKey="mois" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="annonces"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* 🥧 Répartition des rôles */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Répartition des rôles
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={roleData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={80}
                                label
                            >
                                {roleData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 flex justify-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="text-sm text-gray-600">Agent</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-sm text-gray-600">Prospect</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

