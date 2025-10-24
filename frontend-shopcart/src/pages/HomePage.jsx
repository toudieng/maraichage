// src/pages/HomePage.jsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import im1 from '../assets/im1.jpg'; 

const CategoryCard = ({ emoji, name }) => (
  <div className="bg-white p-4 rounded-xl text-center shadow hover:shadow-lg transition-all hover:scale-105 cursor-pointer border border-gray-100">
    <div className="text-4xl mb-2">{emoji}</div>
    <p className="font-semibold text-sm text-gray-700">{name}</p>
  </div>
);

const HomePage = () => {
  const heroImage = im1; 
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SECTION HÉROS : rounded-none pour 0 radius, bouton vert, centrage du texte confirmé */}
        <div 
            className="relative bg-cover bg-center h-[500px] mt-5 text-white py-20 md:p-20 **rounded-none** mb-12 shadow-2xl overflow-hidden flex items-center justify-center"
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})` }}
        >
          <div className="max-w-4xl z-10 relative text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
              Maraîchage et Épicerie Fine
            </h2>

            <div className="h-10"></div>

            <p className="text-xl md:text-2xl mb-8 font-light drop-shadow-md">
              "Contribuer au développement de l'économie sénégalaise en qualité et en quantité."
            </p>

            <div className="h-4"></div>

            {/* Paragraphe : max-w-2xl centre le bloc, mx-auto centre le bloc, text-center centre le texte à l'intérieur du bloc */}
            <p className="text-base mb-10 mx-auto font-normal text-center">
                Nous vous garantissons des **légumes frais et de première qualité** (tomates, oignons, piments, etc.)  grâce à notre unité moderne de production maraîchère à Fatick. En utilisant des **techniques innovantes** comme les pompes solaires et l'arrosage goutte à goutte, nous assurons une **production continue** pour le marché national et international. Consommer nos produits, c'est choisir l'excellence tout en soutenant l'**autosuffisance alimentaire** et la **création d'emplois locaux** au Sénégal.
            </p>

            <div className="h-15"></div>

            {/* Bouton en vert */}
            <a href="/produits" className="inline-block px-10 py-4 bg-green-400 text-gray-900 text-lg font-bold rounded-lg shadow-xl hover:bg-green-300 transition-colors transform hover:scale-105">
              Découvrir les produits
            </a>
          </div>
        </div>

        <div className="h-5"></div>

        {/* CATÉGORIES */}
        <section className="my-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Nos Catégories</h3>
          <div className="h-5"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CategoryCard emoji="🥕" name="Légumes Racines" />
            <CategoryCard emoji="🧅" name="Légumes Bulbes" />
            <CategoryCard emoji="🥬" name="Légumes Feuilles" />
            <CategoryCard emoji="🍅" name="Légumes Fruits" />
          </div>
        </section>

        <div className="h-10"></div>

        <section className="py-16 bg-white shadow-inner flex-1">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-green-700">Nos Engagements : Qualité & Impact</h3>
            <p className="text-lg text-gray-600 mt-2">Ce qui fait la différence chez Naatal Mbay.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Carte 1 : Techniques Modernes */}
            <div className="p-6 text-center bg-green-50 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-3">⚙️</div>
              <h4 className="font-bold text-xl mb-2 text-gray-800">Technologie & Durabilité</h4>
              <p className="text-gray-600 text-sm">Culture sous serres et irrigation au goutte à goutte pour minimiser l'eau et garantir une **qualité constante**, toute l'année.</p>
            </div>
            
            {/* Carte 2 : Emploi Local */}
            <div className="p-6 text-center bg-green-50 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-3">🤝</div>
              <h4 className="font-bold text-xl mb-2 text-gray-800">Impact Local</h4>
              <p className="text-gray-600 text-sm">En achetant chez nous, vous soutenez directement l'**emploi** et le développement de l'**autosuffisance alimentaire** dans la région de Fatick.</p>
            </div>

            {/* Carte 3 : Fraîcheur Garantie */}
            <div className="p-6 text-center bg-green-50 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-3">☀️</div>
              <h4 className="font-bold text-xl mb-2 text-gray-800">Récolte du Jour</h4>
              <p className="text-gray-600 text-sm">Nos produits sont livrés peu de temps après la récolte pour une **fraîcheur inégalée** et un goût préservé.</p>
            </div>
          </div>
        </section>

        <div className="h-15"></div>

        <section className="py-16 bg-green-700 text-white">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-3xl font-extrabold mb-10">Un Projet Solide, Des Résultats Concrets</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              
              {/* Stat 1 : Superficie */}
              <div>
                <p className="text-5xl font-extrabold text-yellow-300">1 Ha</p>
                <p className="text-lg mt-2 font-medium">de Production Maraîchère</p>
              </div>

              {/* Stat 2 : Potentiel de Rendement (basé sur le rendement max de 18180 kg/3636m2) */}
              <div>
                <p className="text-5xl font-extrabold text-yellow-300">18 T</p>
                <p className="text-lg mt-2 font-medium">Rendement Potentiel/cycle</p>
              </div>

              {/* Stat 3 : Taux de Rentabilité Interne (TRI) */}
              <div>
                <p className="text-5xl font-extrabold text-yellow-300">46%</p>
                <p className="text-lg mt-2 font-medium">Taux de Rentabilité Interne (TRI)</p>
              </div>
              
              {/* Stat 4 : Création d'Emplois (Estimation) */}
              <div>
                <p className="text-5xl font-extrabold text-yellow-300">10+</p>
                <p className="text-lg mt-2 font-medium">Emplois Locaux Créés</p>
              </div>
            </div>
          </div>
        </section>

        <div className="h-15"></div>

        <section className="py-16 bg-gradient-to-r from-gray-50 to-white">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                {/* Bloc de Texte et Appel à l'Action */}
                <div className="text-gray-800">
                    <h3 className="text-3xl font-extrabold mb-4 text-green-700">
                        Où nous trouver ? Notre cœur est à Fatick. 📍
                    </h3>
                    <p className="text-lg mb-6">
                        Notre unité de production moderne est solidement implantée dans la région de **Fatick**. Cette localisation stratégique nous permet de cultiver des produits adaptés au terroir sénégalais tout en bénéficiant d'un environnement idéal pour l'innovation maraîchère.
                    </p>
                    <p className="mb-8 font-medium">
                        Découvrez notre histoire complète, rencontrez l'équipe et apprenez-en plus sur notre vision de l'agriculture durable au Sénégal.
                    </p>
                    <a href="/a-propos" className="inline-block px-8 py-3 bg-yellow-400 text-gray-900 text-md font-bold rounded-lg shadow-lg hover:bg-yellow-300 transition-colors transform hover:scale-105">
                        Lire notre Histoire
                    </a>
                </div>

                {/* Bloc Image ou Carte (Simulation d'un bloc visuel) */}
                <div className="aspect-video bg-gray-200 rounded-xl shadow-2xl overflow-hidden flex items-center justify-center">
                    <p className="text-xl text-gray-500 font-semibold">
                        [Espace pour une carte de Fatick ou une photo de l'équipe]
                    </p>
                </div>
            </div>
        </section>

        <div className="h-15"></div>

        <section className="py-20 text-center bg-gray-100">
            <div className=" mx-auto px-4">
                <h3 className="text-4xl font-extrabold mb-10 text-gray-800">
                    Prêt à Passer Commande ?
                </h3>
                <p className="text-xl text-gray-600 mb-8">
                    Découvrez la fraîcheur et la qualité de nos produits directement de Fatick à votre table.
                </p>
                <a href="/produits" className="inline-block px-10 py-4 bg-green-500 text-white text-xl font-bold rounded-lg shadow-xl hover:bg-green-600 transition-colors transform hover:scale-105 mr-4">
                    Voir Tous les Produits
                </a>
                <a href="/contact" className="inline-block px-10 py-4 border border-green-500 text-green-700 text-xl font-bold rounded-lg shadow-xl hover:bg-green-100 transition-colors transform hover:scale-105">
                    Nous Contacter
                </a>
            </div>
        </section>

        <div className="h-15"></div>

      </main>

      <Footer />
    </div>
  );
};

export default HomePage;