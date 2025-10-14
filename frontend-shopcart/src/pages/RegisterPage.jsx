import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Inscription</h2>
        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />
        <input type="password" placeholder="Mot de passe" value={password1} onChange={(e) => setPassword1(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />
        <input type="password" placeholder="Confirmer le mot de passe" value={password2} onChange={(e) => setPassword2(e.target.value)} required className="w-full px-4 py-3 border rounded-lg" />
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">S'inscrire</button>
      </form>
    </div>
  );
};

export default RegisterPage;
