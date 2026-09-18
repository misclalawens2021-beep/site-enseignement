const SUJETS_VALIDES = ['Question sur un cours', 'Signaler une erreur', 'Proposition de contenu', 'Autre'];

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-contact');
  if (!form) return;

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const valeurs = {
      nom: form.nom.value.trim(),
      email: form.email.value.trim(),
      sujet: form.sujet.value.trim(),
      message: form.message.value.trim(),
    };

    const erreurs = {};
    if (valeurs.nom === '') {
      erreurs.nom = 'Le nom est obligatoire.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valeurs.email)) {
      erreurs.email = 'Adresse invalide.';
    }
    if (!SUJETS_VALIDES.includes(valeurs.sujet)) {
      erreurs.sujet = 'Choisissez un sujet.';
    }
    if (valeurs.message.length < 20) {
      erreurs.message = 'Le message doit faire au moins 20 caractères.';
    }

    ['nom', 'email', 'sujet', 'message'].forEach(champ => {
      const zone = document.getElementById(`erreur-${champ}`);
      if (zone) zone.textContent = erreurs[champ] || '';
    });

    if (Object.keys(erreurs).length > 0) {
      document.getElementById('message-succes').hidden = true;
      return;
    }

    /* Pas de backend : on enregistre localement (equivalent de l'INSERT message_contact) */
    try {
      const messages = JSON.parse(localStorage.getItem('messages_contact') || '[]');
      messages.push({ ...valeurs, date_envoi: new Date().toISOString() });
      localStorage.setItem('messages_contact', JSON.stringify(messages));
    } catch (err) {
      console.error('Impossible d\'enregistrer le message localement', err);
    }

    form.reset();
    document.getElementById('message-succes').hidden = false;
  });

  form.addEventListener('input', (evt) => {
    if (evt.target.name === 'message') {
      const zone = document.getElementById('erreur-message');
      if (zone) zone.textContent = '';
    }
  });
});
