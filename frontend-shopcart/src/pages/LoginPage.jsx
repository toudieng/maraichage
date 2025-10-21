import { useState } from 'react';
import { useToast } from '../components/Toast';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ... (Logique de connexion inchangée)
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showToast(data.message || 'Connexion réussie !');
        navigate('/');
      } else {
        showToast(data.error || 'Identifiants incorrects', 'error');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      showToast('Erreur serveur', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center px-4">

      {/* Bloc de connexion */}
      <div className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Connexion</h2>
        <p className="text-sm text-gray-600 text-center mb-10">Accédez à votre espace Naatal Mbay</p>

        <form onSubmit={handleLogin} className="space-y-8"> 
          
          <div className="space-y-4"> {/* Rétabli space-y-4 pour espacer les groupes de champs */}
            <label 
              htmlFor="username" 
              className="block text-sm text-gray-700" 
            >
              Nom d'utilisateur
            </label>
            {/* AJOUT D'UNE DIV INVISIBLE AVEC UNE HAUTEUR FIXE POUR CRÉER L'ESPACE */}
            <div className="h-2"></div> 
            <input
              id="username"
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-3 h-8 text-sm text-gray-800 bg-white border border-gray-300 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="h-3"></div>

          <div className="space-y-4"> {/* Rétabli space-y-4 pour espacer les groupes de champs */}
            <label 
              htmlFor="password" 
              className="block text-sm text-gray-700" 
            >
              Mot de passe
            </label>
            {/* AJOUT D'UNE DIV INVISIBLE AVEC UNE HAUTEUR FIXE POUR CRÉER L'ESPACE */}
            <div className="h-2"></div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-4 h-8 text-sm text-gray-800 bg-white border border-gray-300 focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          <div className="h-3"></div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 h-7 text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </form>

        <p className="mt-12 text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-blue-600 hover:underline font-medium">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;