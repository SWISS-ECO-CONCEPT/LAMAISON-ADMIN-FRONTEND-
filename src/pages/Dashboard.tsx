import React from "react";
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

const Dashboard: React.FC = () => {
    // 🧾 Données pour les statistiques
    const stats = [
        { id: 1, title: "Annonces", value: 128, icon: <Home className="text-blue-600" /> },
        { id: 2, title: "Utilisateurs", value: 76, icon: <Users className="text-green-600" /> },
        { id: 3, title: "Rendez-vous", value: 32, icon: <Calendar className="text-orange-500" /> },
        { id: 4, title: "Messages", value: 58, icon: <MessageSquare className="text-purple-500" /> },
    ];

    // 📊 Données du graphique d’évolution
    const annonceData = [
        { mois: "Jan", annonces: 10 },
        { mois: "Fév", annonces: 20 },
        { mois: "Mar", annonces: 15 },
        { mois: "Avr", annonces: 30 },
        { mois: "Mai", annonces: 25 },
        { mois: "Juin", annonces: 40 },
    ];

    // 🥧 Données du graphique camembert
    const roleData = [
        { name: "Agents", value: 40 },
        { name: "Prospects", value: 30 },
        { name: "Admins", value: 5 },
        { name: "Autres", value: 25 },
    ];

    const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7"];

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
                {/* 📈 Ligne d’évolution */}
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
                        Répartition des utilisateurs
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
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

