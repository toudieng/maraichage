// src/pages/ProfilPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // <-- Import de la Navbar
import Footer from '../components/Footer'; // <-- Import du Footer


// Fonction utilitaire pour récupérer le cookie CSRF (laisser telle quelle)
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const ProfilPage = () => {
    const [formData, setFormData] = useState({ /* ... état du formulaire ... */ });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); 
    const [isLoading, setIsLoading] = useState(true); 
    const [isSubmitting, setIsSubmitting] = useState(false); 

    // 1. Chargement initial des données
    useEffect(() => {
        setIsLoading(true);
        axios.get('http://localhost:8000/api/user/', { withCredentials: true })
            .then(res => {
                setFormData({
                    nom_complet: res.data.nom_complet || '',
                    email: res.data.email || '',
                    telephone: res.data.telephone || '',
                });
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Erreur chargement profil :", err);
                setMessage("Erreur lors du chargement de votre profil.");
                setMessageType('error');
                setIsLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // 2. Soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(''); 
        setMessageType('');

        const csrfToken = getCookie('csrftoken');
        if (!csrfToken) {
            setMessage("Erreur de sécurité: Jeton CSRF manquant. Veuillez vous reconnecter.");
            setMessageType('error');
            setIsSubmitting(false);
            return;
        }

        axios.post(
            'http://localhost:8000/api/profil/',
            formData,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                }
            }
        )
        .then(res => {
            if (res.status === 200 || res.status === 201) {
                setMessage("Profil mis à jour avec succès !");
                setMessageType('success');
            } else {
                setMessage(res.data.message || "Échec de la mise à jour (réponse serveur inattendue).");
                setMessageType('error');
            }
        })
        .catch(err => {
            console.error("Erreur mise à jour :", err.response || err);
            const serverError = err.response?.data?.detail || err.response?.data?.error || "Vérifiez la console et le backend.";
            setMessage(`Erreur lors de la mise à jour : ${serverError}`);
            setMessageType('error');
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };
    
    // Classes pour les messages d'état (vert/rouge)
    const messageClasses = messageType === 'success'
        ? 'bg-green-100 border-l-4 border-green-500 text-green-700 p-4'
        : 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4';
    
    // Indicateur de chargement stylisé
    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );


    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-gray-50">
            <Navbar />

            <main className="flex-grow w-full mx-auto !px-4 sm:px-6 lg:px-8 !py-8 flex justify-center items-start">
                
                {/* Conteneur de la carte de profil */}
                <div className="w-full max-w-lg bg-white !p-8 md:p-10 rounded-xl shadow-2xl border border-gray-100 !mt-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center !mb-8 border-b border-gray-300 !pb-4">
                        Mon Profil
                    </h2>

                    {/* Affichage du message d'état */}
                    {message && (
                        <div className={`!mb-6 rounded-lg ${messageClasses}`}>
                            <p className="font-semibold">{message}</p>
                        </div>
                    )}

                    {/* Affichage de l'état de chargement initial */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <LoadingSpinner />
                            <span className="text-gray-600 !ml-3">Chargement du profil...</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="!space-y-6">
                            
                            {/* Champ Nom complet */}
                            <div>
                                <label htmlFor="nom_complet" className="block text-sm font-medium text-gray-700">Nom complet</label>
                                <input
                                    type="text"
                                    id="nom_complet"
                                    name="nom_complet"
                                    value={formData.nom_complet}
                                    onChange={handleChange}
                                    className="!mt-1 block w-full !px-4 !py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            {/* Champ Email (Lecture seule) */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (Non modifiable)</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    readOnly
                                    className="!mt-1 block w-full !px-4 !py-2 border border-gray-200 rounded-none shadow-inner bg-gray-100 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            {/* Champ Téléphone */}
                            <div>
                                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                                <input
                                    type="text"
                                    id="telephone"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    className="!mt-1 block w-full !px-4 !py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            {/* Bouton de soumission (style vert) */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center items-center !py-3 !px-4 border border-transparent rounded-none shadow-md text-base font-medium text-white transition duration-200 
                                    ${isSubmitting 
                                        ? 'bg-green-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`
                                }
                            >
                                {isSubmitting ? (
                                    <>
                                        <LoadingSpinner />
                                        Mise à jour...
                                    </>
                                ) : (
                                    'Mettre à jour mon profil'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </main>

            <Footer /> {/* <-- Rendu direct du Footer */}
        </div>
    );
};

export default ProfilPage;