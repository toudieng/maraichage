// src/pages/HomePage.jsx
import Navbar from '../components/Navbar';

const CategoryCard = ({ emoji, name }) => (
  <div className="bg-white p-4 rounded-xl text-center shadow hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-gray-100">
    <div className="text-4xl mb-2">{emoji}</div>
    <p className="font-semibold text-sm text-gray-700">{name}</p>
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SECTION HÉROS */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-500 text-white p-12 md:p-20 rounded-2xl mb-12 shadow-2xl overflow-hidden">
          <div className="max-w-4xl z-10 relative">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Maraîchage et Épicerie Fine
            </h2>
            <p className="text-xl mb-6 font-light">
              Retrouvez le meilleur du terroir local et des produits frais, livrés avec soin.
            </p>
            <a href="/produits" className="inline-block px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-300 transition-colors">
              Découvrir les produits
            </a>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
            <div className="text-9xl">🥕🌿🌶️</div>
          </div>
        </div>

        {/* CATÉGORIES */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Nos Catégories</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <CategoryCard emoji="🥕" name="Légumes Racines" />
            <CategoryCard emoji="🌿" name="Feuillages" />
            <CategoryCard emoji="🌶️" name="Piments & Épices" />
            <CategoryCard emoji="🍋" name="Fruits Exotiques" />
            <CategoryCard emoji="🌾" name="Céréales" />
            <CategoryCard emoji="🥛" name="Produits Laitiers" />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-20 py-12 border-t-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-3">🌱 Natal Mbey - Maraîchage Moderne</h3>
          <p className="text-gray-300 text-lg">Ross Béthio, Dagana - Sénégal</p>
          <p className="text-green-400 font-semibold mt-2 text-lg">📞 Tel: 78 587 41 10</p>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">© 2024 Projet Natal Mbey - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
