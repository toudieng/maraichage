// src/pages/ContactPage.jsx

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';

const ContactPage = () => {
    // État local pour le formulaire (simple gestion)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    // Gestion du changement des champs de formulaire
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulaire soumis :', formData);
        
        // En conditions réelles, vous ajouteriez ici la logique d'envoi à une API.
        alert(`Message de ${formData.name} envoyé ! (Simulation)`);
        
        // Réinitialisation du formulaire (optionnel)
        setFormData({ name: '', email: '', message: '' });
    };

    // Informations de contact Naatal Mbay (Ajustées pour Fatick)
    const contactInfo = {
        adresse: "Unité de Production de Fatick (Sénégal)",
        tel1: "+221 7X XXX XX XX", 
        tel2: "7X XXX XX XX",
        email: "contact@naatalmbay.sn", // Email générique
        site: "www.naatalmbay.sn", // Site générique
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-7xl !mx-auto !px-10 sm:px-6 lg:px-8 py-16">

                {/* --- TITRE DE LA PAGE --- */}
                <h1 className="text-4xl font-extrabold text-center !my-12  text-gray-800 border-b !pb-10">
                    Contactez l'Équipe Naatal Mbay
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    
                    {/* --- BLOC COORDONNÉES --- */}
                    <div>
                        <h2 className="text-2xl font-bold !mb-6 text-gray-800">Coordonnées</h2>
                        <div className="!space-y-4 text-lg text-gray-700">
                            <p>
                                <strong>Adresse :</strong> {contactInfo.adresse}
                            </p>
                            <p>
                                <strong>Tél :</strong> {contactInfo.tel1} / {contactInfo.tel2}
                            </p>
                            <p>
                                <strong>Email :</strong> <a href={`mailto:${contactInfo.email}`} className="text-green-600 hover:underline">{contactInfo.email}</a>
                            </p>
                            <p>
                                <strong>Site :</strong> <a href={`http://${contactInfo.site}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{contactInfo.site}</a>
                            </p>
                        </div>
                    </div>

                    {/* --- BLOC FORMULAIRE --- */}
                    <div>
                        <h2 className="text-2xl font-bold !mb-6 text-gray-800">Envoyez-nous un message</h2>
                        <form onSubmit={handleSubmit} className="!space-y-4">
                            
                            {/* Nom */}
                            <div>
                                <input 
                                    type="text" 
                                    name="name" 
                                    className="w-full !p-2 border border-gray-300 rounded-none focus:ring-green-500 focus:border-green-500" 
                                    placeholder="Votre nom" 
                                    value={formData.name}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            
                            {/* Email */}
                            <div>
                                <input 
                                    type="email" 
                                    name="email" 
                                    className="w-full !p-2 border border-gray-300 rounded-none focus:ring-green-500 focus:border-green-500" 
                                    placeholder="Votre email" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            
                            {/* Message */}
                            <div>
                                <textarea 
                                    name="message" 
                                    className="w-full p-3 border border-gray-300 rounded-none focus:ring-green-500 focus:border-green-500" 
                                    rows="5" 
                                    placeholder="Votre message"
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            
                            {/* Bouton Envoyer */}
                            <button 
                                type="submit" 
                                className="w-full !py-2 bg-green-700 text-white font-bold rounded-none shadow-md hover:bg-green-800 transition-colors"
                            >
                                Envoyer
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- BLOC CARTE GOOGLE MAPS --- */}
                <div className="!mt-12">
                    <h2 className="text-2xl font-bold !mb-4 text-gray-800">Où nous trouver (Fatick)</h2>
                    <div className="w-full h-96 !mb-10 rounded-none overflow-hidden shadow-xl border border-gray-100">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15448.243555239103!2d-16.42220498144415!3d14.339016758602708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xc665191c4d9351e3!2sFatick%2C%20S%C3%A9n%C3%A9gal!5e0!3m2!1sfr!2ssn!4v1633512345678!5m2!1sfr!2ssn" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Carte de Fatick, Sénégal"
                        ></iframe>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;