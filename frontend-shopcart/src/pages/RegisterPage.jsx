import { useState } from 'react';
import { useToast } from '../components/Toast';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password1 !== password2) {
      showToast('Les mots de passe ne correspondent pas', 'error');
      return;
    }

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
          password1,
          password2,
        }),
      });

      const data = await response.json();
      if (data.success) {
        showToast('Inscription réussie !');
        navigate('/panier');
      } else {
        showToast(data.error || 'Erreur lors de l’inscription', 'error');
      }
    } catch (error) {
      console.error('Erreur serveur:', error);
      showToast('Erreur serveur', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center px-4">
      {/* Bloc d'inscription */}
      <div className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Inscription</h2>
        <p className="text-sm text-gray-600 text-center mb-10">Créez votre compte Naatal Mbay</p>

        <form onSubmit={handleRegister} className="space-y-8">
          {/* Champ Nom d'utilisateur */}
          <div className="space-y-4">
            <label htmlFor="username" className="block text-sm text-gray-700">Nom d'utilisateur</label>
            <div className="h-2"></div> 
            <input
              id="username"
              type="text" 
              placeholder="Nom d'utilisateur" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="w-full px-3 py-3 h-8 text-sm text-gray-800 bg-white border border-gray-300 focus:outline-none focus:border-blue-600" 
            />
          </div>

          <div className="h-3"></div>

          {/* Champ Email */}
          <div className="space-y-4">
            <label htmlFor="email" className="block text-sm text-gray-700">Email</label>
            <div className="h-2"></div> 
            <input 
              id="email"
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-3 py-3 h-8 text-sm text-gray-800 bg-white border border-gray-300 focus:outline-none focus:border-blue-600" 
            />
          </div>

          <div className="h-3"></div>

          {/* Champ Mot de passe */}
          <div className="space-y-4">
            <label htmlFor="password1" className="block text-sm text-gray-700">Mot de passe</label>
            <div className="h-2"></div> 
            <input 
              id="password1"
              type="password" 
              placeholder="••••••••" 
              value={password1} 
              onChange={(e) => setPassword1(e.target.value)} 
              required 
              className="w-full px-3 py-4 h-8 text-sm text-gray-800 bg-white border border-gray-300 focus:outline-none focus:border-blue-600" 
            />
          </div>

          <div className="h-3"></div>

          {/* Champ Confirmation Mot de passe */}
          <div className="space-y-4">
            <label htmlFor="password2" className="block text-sm text-gray-700">Confirmer le mot de passe</label>
            <div className="h-2"></div> 
            <input 
              id="password2"
              type="password" 
              placeholder="••••••••" 
              value={password2} 
              onChange={(e) => setPassword2(e.target.value)} 
              required 
              className="w-full px-3 py-4 h-8 text-sm text-gray-800 bg-white border border-gray-300 focus:outline-none focus:border-blue-600" 
            />
          </div>

          <div className="h-3"></div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-blue-600 h-7 text-white py-4 text-sm font-semibold hover:bg-blue-700 transition-colors" /* Changement de couleur de vert à bleu et augmentation du padding py-4 */
            >
              S'inscrire
            </button>
          </div>
        </form>
        
        <p className="mt-12 text-center text-sm text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link to="/connexion" className="text-blue-600 hover:underline font-medium">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;