// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useToast } from '../components/Toast';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // <-- Ajout de l'import
import Footer from '../components/Footer'; // <-- Ajout de l'import
import loginBackground from '../assets/connexion.jpg'; // <-- Import de l'image de fond (assumant le même nom)

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false); // Gestion du chargement

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password1 !== password2) {
            showToast('Les mots de passe ne correspondent pas', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include',
                body: new URLSearchParams({
                    username,
                    email,
                    password: password1, // Le nom du champ peut varier côté Django
                    password2,
                }),
            });

            const data = await response.json();
            if (data.success) {
                showToast('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                navigate('/connexion'); // Rediriger vers la page de connexion
            } else {
                showToast(data.error || 'Erreur lors de l’inscription', 'error');
            }
        } catch (error) {
            console.error('Erreur serveur:', error);
            showToast('Erreur serveur', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // Conteneur principal qui définit la hauteur totale
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main 
                className="flex-grow flex items-center justify-center !p-4 relative" 
                style={{ backgroundImage: `url(${loginBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                {/* Superposition sombre, limitée au MAIN */}
                <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
                
                {/* Bloc d'inscription stylisé - z-10 pour être au-dessus de l'overlay */}
                <div className="w-full max-w-lg bg-white !p-8 md:p-10 rounded-xl shadow-2xl border border-gray-100 relative !z-10 !my-8"> {/* Augmenté à max-w-lg pour plus de champs */}
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center !mb-4">
                        Créer un Compte
                    </h2>
                    <p className="text-md text-gray-600 text-center !mb-8">
                        Rejoignez la communauté Naatal Mbay
                    </p>

                    <form onSubmit={handleRegister} className="!space-y-6"> 
                        
                        {/* Champ Nom d'utilisateur */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 !mb-1">
                                Nom d'utilisateur
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Nom d'utilisateur"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full !px-4 !py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-gray-500" // Styles verts
                                required
                            />
                        </div>

                        {/* Champ Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 !mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="votre.email@exemple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full !px-4 !py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-gray-500" // Styles verts
                                required
                            />
                        </div>

                        {/* Champ Mot de passe */}
                        <div>
                            <label htmlFor="password1" className="block text-sm font-medium text-gray-700 !mb-1">
                                Mot de passe
                            </label>
                            <input
                                id="password1"
                                type="password"
                                placeholder="••••••••"
                                value={password1}
                                onChange={(e) => setPassword1(e.target.value)}
                                className="w-full !px-4 !py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-gray-500" // Styles verts
                                required
                            />
                        </div>

                        {/* Champ Confirmation Mot de passe */}
                        <div>
                            <label htmlFor="password2" className="block text-sm font-medium text-gray-700 !mb-1">
                                Confirmer le mot de passe
                            </label>
                            <input
                                id="password2"
                                type="password"
                                placeholder="••••••••"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                className="w-full !px-4 !py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-gray-500" // Styles verts
                                required
                            />
                        </div>

                        {/* Bouton S'inscrire */}
                        <div className="!pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center items-center !py-2 !px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white transition duration-200 
                                    ${isSubmitting 
                                        ? 'bg-green-400 cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`
                                }
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 !mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Inscription...
                                    </>
                                ) : (
                                    "S'inscrire"
                                )}
                            </button>
                        </div>
                    </form>
                    
                    <p className="!mt-6 text-center text-sm text-gray-600">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/connexion" className="text-green-600 hover:underline font-medium">
                            Connectez-vous
                        </Link>
                    </p>
                </div>
            </main>

            <Footer /> {/* <-- Footer inclus */}
        </div>
    );
};

export default RegisterPage;