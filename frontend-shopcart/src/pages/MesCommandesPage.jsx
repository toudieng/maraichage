// src/pages/MesCommandesPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // <-- Import de la Navbar
import Footer from '../components/Footer'; // <-- Import du Footer
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Utilisation d'une icône pour le bouton

// Fonction utilitaire pour obtenir les classes de statut et les icônes
const getStatutStyle = (statut) => {
    switch (statut) {
        case 'validée':
            return {
                text: 'text-blue-700',
                bg: 'bg-blue-100',
                label: 'Validée'
            };
        case 'livree':
            return {
                text: 'text-green-700',
                bg: 'bg-green-100',
                label: 'Livrée'
            };
        case 'annulee':
            return {
                text: 'text-red-700',
                bg: 'bg-red-100',
                label: 'Annulée'
            };
        case 'en_attente':
        default:
            return {
                text: 'text-yellow-700',
                bg: 'bg-yellow-100',
                label: 'En attente'
            };
    }
};

const MesCommandesPage = () => {
    const [commandes, setCommandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtreStatut, setFiltreStatut] = useState('tous');


    useEffect(() => {
        axios.get('http://localhost:8000/api/mes-commandes/', {
            withCredentials: true,
        })
        .then(res => {
            setCommandes(res.data.commandes || res.data);
        })
        .catch(err => {
            setError('Erreur lors du chargement des commandes. Veuillez vérifier votre connexion.');
            console.error(err);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    const commandesFiltrées = filtreStatut === 'tous'
        ? commandes
        : commandes.filter(c => c.statut === filtreStatut);

    // --- RENDUS SPÉCIFIQUES ---

    // Rendu du Chargement stylisé
    if (loading) return (
        // Utilise les mêmes classes de fond que les autres pages
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-gray-50">
            <Navbar />
            <main className="flex-grow flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 border-opacity-50 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Chargement de vos commandes...</p>
                </div>
            </main>
            <Footer />
        </div>
    );

    // Rendu de l'Erreur stylisée
    if (error) return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-gray-50">
            <Navbar />
            <main className="flex-grow flex items-center justify-center h-96">
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md max-w-md">
                    <p className="font-bold text-lg">Problème de connexion</p>
                    <p>{error}</p>
                </div>
            </main>
            <Footer />
        </div>
    );

    // --- RENDU PRINCIPAL ---

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-gray-50">
            <Navbar /> {/* <-- Navbar incluse */}

            <main className="flex-grow w-full !mx-auto !px-4 sm:px-6 lg:px-8 !py-8">
                <div className="max-w-4xl !mx-auto !p-4 sm:p-6 bg-white rounded-xl shadow-2xl border border-gray-100">
                    <h1 className="text-3xl font-extrabold text-gray-800 !mb-6 border-b border-gray-300 !pb-4">
                        Historique des Commandes
                    </h1>

                    {/* En-tête avec Bouton de Retour et Filtre */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center !mb-6 !space-y-4 sm:space-y-0">
                        <Link
                            to="/"
                            className="flex items-center !px-4 !py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Retour à la boutique
                        </Link>

                        <div>
                            <label htmlFor="statut-filtre" className="!mr-3 font-medium text-gray-700">Filtrer par statut :</label>
                            <select
                                id="statut-filtre"
                                value={filtreStatut}
                                onChange={(e) => setFiltreStatut(e.target.value)}
                                className="border border-gray-300 !px-3 !py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="tous">Tous les statuts</option>
                                <option value="en_attente">En attente ⏳</option>
                                <option value="validée">Validée ✅</option>
                                <option value="livree">Livrée 🚚</option>
                                <option value="annulee">Annulée ❌</option>
                            </select>
                        </div>
                    </div>

                    {/* Liste des commandes */}
                    {commandes.length === 0 ? (
                        <div className="text-center !py-12 bg-gray-50 rounded-lg shadow-inner border border-dashed border-gray-300">
                            <p className="text-xl font-semibold text-gray-500">
                                Vous n'avez pas encore passé de commande.
                            </p>
                            <Link to="/" className="!mt-4 inline-block text-green-600 hover:text-green-700 font-medium">
                                Commencez vos achats ici →
                            </Link>
                        </div>
                    ) : (
                        <div className="!space-y-4">
                            {commandesFiltrées.map((c, index) => {
                                const statutStyle = getStatutStyle(c.statut);
                                const numeroInverse = commandesFiltrées.length - index;
                                return (
                                    <div 
                                        key={c.id} 
                                        className="bg-white !p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500 flex justify-between items-center flex-wrap"
                                    >
                                        {/* Informations de la commande */}
                                        <div className="flex-grow min-w-0 !pr-4 !space-y-1">
                                            <p className="text-lg font-bold text-gray-800">
                                                Commande <span className="text-green-600">#{numeroInverse}</span>
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Date : {new Date(c.date).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm font-semibold text-gray-700">
                                                Total : <span className="text-lg text-green-700">{Number(c.total).toFixed(0)} F CFA</span>
                                            </p>
                                        </div>

                                        {/* Statut et Détails */}
                                        <div className="flex flex-col items-end !space-y-2 !mt-3 sm:mt-0">
                                            <span className={`inline-flex items-center !px-3 !py-1 rounded-full text-sm font-medium ${statutStyle.bg} ${statutStyle.text}`}>
                                                {statutStyle.label} 
                                            </span>
                                            <Link
                                                to={`/commande/${c.id}`}
                                                className="text-green-600 hover:text-green-700 hover:underline font-medium text-sm transition"
                                            >
                                                Voir les détails →
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    
                    {commandes.length > 0 && commandesFiltrées.length === 0 && (
                        <div className="text-center !py-4 text-gray-500 bg-gray-50 rounded-lg shadow-md !mt-4">
                            <p className="font-semibold">Aucune commande trouvée avec ce statut.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer /> {/* <-- Footer inclus */}
        </div>
    );
};

export default MesCommandesPage;