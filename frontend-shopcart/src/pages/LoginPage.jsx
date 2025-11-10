// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useToast } from '../components/Toast';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import loginBackground from '../assets/connexion.jpg'; // <-- Importez l'image ici

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include',  // ✅ CRITIQUE
                body: new URLSearchParams({
                    username,
                    password,
                }),
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                console.log("✅ Connexion réussie", data);
                showToast('Connexion réussie !');
                
                // ✅ IMPORTANT : Rechargement complet pour forcer la mise à jour
                window.location.href = '/';  // Ou window.location.reload()
            } else {
                showToast(data.error || 'Identifiants incorrects', 'error');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            showToast('Erreur serveur', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // const handleLogin = async (e) => {
    //     e.preventDefault();
    //     setIsSubmitting(true);
    //     try {
    //         const response = await fetch('http://localhost:8000/api/login/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //             credentials: 'include',
    //             body: new URLSearchParams({
    //                 username,
    //                 password,
    //             }),
    //         });

    //         const data = await response.json();
    //         if (response.ok && data.success) {
    //             showToast(data.message || 'Connexion réussie !');
    //             navigate('/');
    //         } else {
    //             showToast(data.error || 'Identifiants incorrects', 'error');
    //         }
    //     } catch (error) {
    //         console.error('Erreur de connexion:', error);
    //         showToast('Erreur serveur', 'error');
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main 
                className="flex-grow flex items-center justify-center !p-4 relative" 
                // Application de l'image de fond uniquement sur le MAIN
                style={{ backgroundImage: `url(${loginBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                {/* Superposition sombre, maintenant limitée au MAIN */}
                <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
                
                {/* Bloc de connexion stylisé - z-10 pour être au-dessus de l'overlay */}
                <div className="w-full max-w-md bg-white !mt-15 !p-8 md:p-10 rounded-xl shadow-2xl border border-gray-100 transform -translate-y-4 sm:-translate-y-8 relative !z-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center !mb-4">
                        Bienvenue !
                    </h2>
                    <p className="text-md text-gray-600 text-center !mb-8">
                        Connectez-vous pour accéder à votre compte.
                    </p>

                    <form onSubmit={handleLogin} className="!space-y-6">
                        <div>
                            <label 
                                htmlFor="username" 
                                className="block text-sm font-medium text-gray-700 !mb-1" 
                            >
                                Nom d'utilisateur
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Votre nom d'utilisateur"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full !px-4 !py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-gray-500"
                                required
                            />
                        </div>

                        {/* Champ Mot de passe */}
                        <div>
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-gray-700 !mb-1" 
                            >
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full !px-4 !py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-gray-500"
                                required
                            />
                        </div>

                        {/* Bouton de connexion */}
                        <div className="!pt-2">
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
                                        Connexion...
                                    </>
                                ) : (
                                    'Se connecter'
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="!mt-6 text-center text-sm text-gray-600">
                        Pas encore de compte ?{' '}
                        <Link to="/inscription" className="text-green-600 hover:underline font-medium">
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </main>

            </div>
    );
};

export default LoginPage;