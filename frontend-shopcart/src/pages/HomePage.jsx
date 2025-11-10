// src/pages/HomePage.jsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import im1 from '../assets/im1.jpg'; 
import catLegumesRacines from '../assets/cat-racines.jpg'; // Ajoutez ces images
import catLegumesBulbes from '../assets/cat-bulbes.jpg';
import catLegumesFeuilles from '../assets/cat-feuilles.jpg';
import catLegumesFruits from '../assets/cat-fruits.jpg';
import { useState, useEffect } from 'react';
import imgTechnologie from '../assets/eng-technologie.jpg';
import imgImpactLocal from '../assets/eng-impact.jpg';
import imgFraicheur from '../assets/eng-fraicheur.jpg';
import imgPompe from '../assets/pompe_solaire.jpg';
import imgCroissance from '../assets/croissance.jpg';
import imgRentabilite from '../assets/rentabilite.jpg';
import imageNewCtaBackground from '../assets/im3.jpg';


const CarouselCategoryCard = ({ image, name, description }) => (
    <div className="w-full h-80 md:h-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex"> {/* Augmente la hauteur ici */}
        {/* Moitié Gauche : Image (centrée verticalement) */}
        <div className="w-1/2 overflow-hidden flex items-center justify-center">
            <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            />
        </div>
        {/* Moitié Droite : Texte Descriptif (centré verticalement) */}
        <div className="w-1/2 !p-6 flex flex-col justify-center"> {/* Augmente le padding */}
            <h4 className="font-extrabold text-2xl md:text-3xl mb-3 text-green-700 leading-tight">{name}</h4> {/* Plus grand titre */}
            <p className="text-base text-gray-700 leading-relaxed line-clamp-4">{description}</p> {/* Plus grand texte, limite les lignes */}
            {/* Bouton vers la catégorie */}
            
        </div>
    </div>
);

const categoriesData = [
    {
        name: "Légumes Racines",
        description: "Découvrez nos carottes, ignames et autres légumes qui poussent sous terre. Riches en nutriments et parfaits pour une alimentation saine.",
        image: catLegumesRacines // Remplacez par le chemin réel
    },
    {
        name: "Légumes Bulbes",
        description: "Oignons, échalotes et ails de première qualité. Indispensables dans toutes les cuisines pour relever vos plats avec saveur.",
        image: catLegumesBulbes
    },
    {
        name: "Légumes Feuilles",
        description: "Salades, épinards et choux fraîchement cueillis. La base d'une alimentation équilibrée, garantis sans produits chimiques superflus.",
        image: catLegumesFeuilles
    },
    {
        name: "Légumes Fruits",
        description: "Tomates, piments, aubergines... Nos produits phares, cultivés avec des techniques modernes pour une saveur et une fraîcheur maximales.",
        image: catLegumesFruits
    },
    // Ajoutez d'autres catégories si nécessaire
];

const EngagementBlock = ({ title, description, image, alignRight }) => (
    <div className={`flex flex-col md:flex-row items-center my-12 !p-8 md:p-8 rounded-xl ${alignRight ? 'bg-green-50' : 'bg-gray-50'}`}>
        
        {/* L'ordre des divs est contrôlé par la classe 'md:order-...' de Tailwind */}
        
        {/* Bloc Image */}
        <div className={`md:w-1/2 w-full p-2 md:p-6 ${alignRight ? 'md:order-2' : 'md:order-1'}`}>
            <div className="aspect-video rounded-none overflow-hidden shadow-xl border-none">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover-fit transition-transform duration-500 hover:scale-105" 
                />
            </div>
        </div>

        {/* Bloc Texte */}
        <div className={`md:w-1/2 w-full !p-15 md:p-6 ${alignRight ? 'md:order-1' : 'md:order-2'} text-gray-800`}>
            <h4 className="text-3xl font-extrabold mb-3 text-green-700 leading-tight">
                {title}
            </h4>
            <p className="text-lg leading-relaxed text-gray-700">
                {description}
            </p>
        </div>
    </div>
);

const engagementsData = [
    {
        title: "Technologie & Durabilité",
        description: "Nous utilisons des techniques de pointe comme l'**irrigation au goutte à goutte** et les pompes solaires pour minimiser l'utilisation d'eau et d'énergie. Notre culture sous serres garantit une **qualité constante**, toute l'année, minimisant l'impact environnemental.",
        image: imgTechnologie,
        alignRight: false // Image à gauche, Texte à droite
    },
    {
        title: "Impact Social et Local",
        description: "En choisissant nos produits, vous soutenez directement l'**emploi local** et la création de valeur dans la région de Fatick. Notre projet contribue activement à l'**autosuffisance alimentaire** et au développement économique du Sénégal.",
        image: imgImpactLocal,
        alignRight: true // Image à droite, Texte à gauche
    },
    {
        title: "Fraîcheur Absolue Garantie",
        description: "La chaîne d'approvisionnement est optimisée pour assurer que nos légumes fruits et racines sont livrés peu de temps après la récolte. C'est l'assurance d'une **fraîcheur inégalée** et d'un goût préservé, directement de nos fermes à votre table.",
        image: imgFraicheur,
        alignRight: false // Image à gauche, Texte à droite
    },
];

const concreteResultsData = [
    {
        image: imgPompe,
        title: "Optimisation : 1 Hectare sous Pompes Solaires",
        description: "Découvrez comment notre investissement dans l'énergie solaire et le goutte-à-goutte a garanti une **production stable** tout au long de l'année, même en période sèche.",
        link: "/etudes/technologie-solaire" 
    },
    {
        image: imgCroissance,
        title: "Emploi et Croissance : Le Cas de la Région de Fatick",
        description: "Notre engagement a permis la création de **plus de 10 emplois locaux stables**. Lisez les témoignages de nos employés et l'impact sur leurs communautés.",
        link: "/etudes/impact-local" 
    },
    {
        image: imgRentabilite,
        title: "Performance & Rentabilité : Atteindre 46% de TRI",
        description: "Analyse détaillée de la performance de notre modèle agricole. Nos techniques innovantes maximisent le rendement et assurent une **rentabilité durable**.",
        link: "/etudes/performance-tri" 
    },
];

const ResultCard = ({ image, title, description, link }) => (
    <a 
        href={link} 
        className="block bg-white rounded-none shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:scale-[1.01] border-t-4 border-none"
    >
        {/* Image - Hauteur fixe pour l'homogénéité */}
        <div className="h-60 overflow-hidden">
            <img 
                src={image} 
                alt={title} 
                className="w-full h-full object-cover"
            />
        </div>
        
        {/* Contenu Texte */}
        <div className="!p-6 text-gray-800">
            <h4 className="text-xl font-bold !mb-2 leading-snug transition-colors">
                {title}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-3">
                {description}
            </p>
            {/* Bouton ou lien visuel - imite le lien de l'exemple */}
            {/* <p className="mt-4 text-green-600 font-semibold text-sm flex items-center">
                Lire l'étude
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </p> */}
        </div>
    </a>
);

const HomePage = () => {
    const heroImage = im1;
    const ctaImage = imageNewCtaBackground;
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % categoriesData.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => 
            (prevSlide - 1 + categoriesData.length) % categoriesData.length
        );
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 3000);
        return () => clearInterval(interval);
    }, []);

    const CurrentCategory = categoriesData[currentSlide];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              Contribuer au développement de l'économie sénégalaise en qualité et en quantité.
            </p>

            <div className="h-4"></div>

            {/* Paragraphe : max-w-2xl centre le bloc, mx-auto centre le bloc, text-center centre le texte à l'intérieur du bloc */}
            <p className="text-base mb-10 mx-auto font-normal text-center">
                Nous vous garantissons des légumes frais et de première qualité (tomates, oignons, piments, etc.)  grâce à notre unité moderne de production maraîchère à Fatick. En utilisant des techniques innovantes comme les pompes solaires et l'arrosage goutte à goutte, nous assurons une production continue pour le marché national et international. Consommer nos produits, c'est choisir l'excellence tout en soutenant l'autosuffisance alimentaire et la création d'emplois locaux au Sénégal.
            </p>

            <div className="h-15"></div>

            {/* Bouton en vert */}
            <a href="/produits" className="inline-block !px-6 !py-2 bg-green-400 text-gray-900 text-lg font-bold rounded-lg shadow-xl hover:bg-green-300 transition-colors transform hover:scale-105">
              Découvrir les produits
            </a>
          </div>
        </div>

        <div className="h-15"></div>

        <section className="my-16">
            <h3 className="text-3xl font-bold text-gray-800 !mb-15 text-center">Explorez Nos Catégories</h3>
            <div className="h-5"></div>
            
            {/* Conteneur du Carrousel */}
            <div className="w-full md:w-[70%] !mx-auto relative group">
                {/* Flèche Gauche */}
                <button 
                    onClick={prevSlide}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="Catégorie précédente"
                >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>

                {/* Conteneur de la carte avec transition */}
                <div key={currentSlide} className="transition-opacity duration-700 ease-in-out">
                    <CarouselCategoryCard 
                        name={CurrentCategory.name}
                        description={CurrentCategory.description}
                        image={CurrentCategory.image}
                    />
                </div>

                {/* Flèche Droite */}
                <button 
                    onClick={nextSlide}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 backdrop-blur-sm p-3 rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="Catégorie suivante"
                >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>

                {/* Indicateurs de position (Points) */}
                <div className="flex justify-center !mt-6 !space-x-2">
                    {categoriesData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentSlide ? 'bg-green-500' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Aller à la catégorie ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>

        <div className="h-10"></div>

        {/* --- NOUVELLE SECTION ENGAGEMENTS (ZIGZAG) --- */}
        <section className="!py-16 bg-white shadow-inner flex-1">
            <div className="text-center mb-16">
                <h3 className="text-4xl font-extrabold text-gray-800">Nos Engagements : Qualité & Impact</h3>
                <p className="text-xl text-gray-600 !mt-3">Ce qui fait la différence chez Naatal Mbay, étape par étape.</p>
            </div>

            {/* Rendu des blocs d'engagement en alternance */}
            <div className="max-w-7xl mx-auto">
                {engagementsData.map((item, index) => (
                    <EngagementBlock
                        key={index}
                        title={item.title}
                        description={item.description}
                        image={item.image}
                        alignRight={item.alignRight}
                    />
                ))}
            </div>
        </section>

        {/* --- NOUVELLE SECTION RÉSULTATS CONCRETS (GRILLE DE CARTES) --- */}
        <section className="py-20 bg-gray-100">
            <div className="max-w-7xl mx-auto text-center px-4">
                {/* Titre inspiré du style The Chef's Garden */}
                <div className="max-w-xl !mx-auto border-t border-gray-300 !pt-10 !mb-10">
                        <h3 className="text-4xl font-extrabold text-gray-800">
                        Un Projet Solide : Résultats & Études de Cas
                    </h3>
                </div>
                <p className="text-xl text-gray-600 !mb-12">
                    Nos chiffres se traduisent en succès réels sur le terrain.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {concreteResultsData.map((item, index) => (
                        <ResultCard
                            key={index}
                            title={item.title}
                            description={item.description}
                            image={item.image}
                            link={item.link}
                        />
                    ))}
                </div>

                {/* Bouton Voir Plus - comme l'exemple pourrait en avoir un */}
                {/* <div className="mt-16">
                    <a href="/etudes" className="inline-block px-10 py-3 border-2 border-green-700 text-green-700 text-lg font-bold rounded-lg hover:bg-green-700 hover:text-white transition-colors">
                        Voir toutes les études de cas
                    </a>
                </div> */}
            </div>
        </section>
        {/* --- FIN DE LA SECTION RÉSULTATS CONCRETS --- */}

        <div className="h-15"></div>

        {/* --- SECTION OÙ NOUS TROUVER --- */}
        <section className="py-16 bg-gray-50">
            <div className="max-w-6xl !mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                {/* Bloc de Texte (Marge à gauche ajoutée) */}
                <div className="text-gray-800 pl-4"> 
                    <h3 className="text-3xl font-extrabold mb-4 text-gray-800">
                        Où nous trouver ? Notre cœur est à Fatick. 📍
                    </h3>
                    <p className="text-lg mb-6">
                        Notre unité de production moderne est solidement implantée dans la région de **Fatick**. Cette localisation stratégique nous permet de cultiver des produits adaptés au terroir sénégalais tout en bénéficiant d'un environnement idéal pour l'innovation maraîchère.
                    </p>
                    <p className="mb-8 font-medium">
                        Découvrez notre histoire complète, rencontrez l'équipe et apprenez-en plus sur notre vision de l'agriculture durable au Sénégal.
                    </p>
                </div>

                {/* Bloc Carte - Remplacement par un iframe de Google Maps */}
                <div className="aspect-video bg-gray-200 rounded-none shadow-2xl overflow-hidden">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15448.243555239103!2d-16.42220498144415!3d14.339016758602708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xc665191c4d9351e3!2sFatick%2C%20S%C3%A9n%C3%A9gal!5e0!3m2!1sfr!2ssn!4v1633512345678!5m2!1sfr!2ssn"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </section>
        {/* --- FIN DE LA SECTION OÙ NOUS TROUVER --- */}

        <div className="h-15"></div>

        {/* --- SECTION APPEL À L'ACTION (MODIFIÉE) --- */}
        <section 
            className="relative bg-cover bg-center h-[450px] text-white !py-20 flex items-center justify-center rounded-none shadow-2xl" 
            style={{ backgroundImage: `url(${ctaImage})` }}
        >
            <div className="max-w-4xl mx-auto !px-4 text-center !z-10 bg-green-800/75 !p-10 rounded-none">
                <h3 className="text-4xl md:text-5xl font-extrabold !mb-10 drop-shadow-lg">
                    Prêt à Passer Commande ?
                </h3>
                <p className="text-xl md:text-2xl font-light !mb-12 drop-shadow-md">
                    Découvrez la fraîcheur et la qualité de nos produits directement de Fatick à votre table.
                </p>
                
                {/* Boutons avec espacement mis à jour */}
                <div className="flex justify-center flex-wrap">
                    <a 
                        href="/produits" 
                        className="inline-block !px-10 !py-2 bg-green-400 text-gray-900 text-xl font-bold rounded-lg shadow-xl hover:bg-green-300 transition-colors transform hover:scale-105 !mx-4 !my-2"
                    >
                        Voir Tous les Produits
                    </a>
                    <a 
                        href="/contact" 
                        className="inline-block !px-10 !py-2 border-2 border-white text-white text-xl font-bold rounded-lg shadow-xl hover:bg-white hover:text-green-800 transition-colors transform hover:scale-105 !mx-4 !my-2"
                    >
                        Nous Contacter
                    </a>
                </div>
            </div>
        </section>
        {/* --- FIN DE LA SECTION APPEL À L'ACTION --- */}

        <div className="h-15"></div>

      </main>

      <Footer />
    </div>
  );
};

export default HomePage;