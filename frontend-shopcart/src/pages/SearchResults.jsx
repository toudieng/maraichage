// src/pages/SearchResults.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    if (!query) return;

    axios.get(`http://localhost:8000/produits/api/produits/`)
      .then(res => {
        const filtered = res.data.filter(product =>
          product.nom?.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur lors de la recherche :', err);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Résultats pour « {query} »
      </h2>

      {loading ? (
        <p>Chargement...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
