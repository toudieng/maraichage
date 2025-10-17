import { useNavigate } from 'react-router-dom';

const CommandeActions = ({ commandeId }) => {
  const navigate = useNavigate();

  const handleDownloadFacture = () => {
    window.open(`http://localhost:8000/api/commande/${commandeId}/facture/`, '_blank');
  };

  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4">
      <button
        onClick={() => navigate('/')}
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        🛒 Retour aux produits
      </button>

      <button
        onClick={handleDownloadFacture}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        📄 Télécharger la facture
      </button>

      <button
        onClick={() => navigate('/mes-commandes')}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        📦 Voir mes commandes
      </button>
    </div>
  );
};

export default CommandeActions;
