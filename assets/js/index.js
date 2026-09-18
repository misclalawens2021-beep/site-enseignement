document.addEventListener('DOMContentLoaded', async () => {
  const [membres, coursListe, exercicesData, competences] = await Promise.all([
    chargerDonnees('membres'),
    chargerDonnees('cours'),
    chargerDonnees('exercices'),
    chargerDonnees('competences'),
  ]);

  if (!membres || !coursListe || !exercicesData || !competences) return;

  const nbChapitres = coursListe.reduce((n, c) => n + c.chapitres.length, 0);
  const nbExercices = exercicesData.exercices.length;
  const nbCompetences = competences.competences.length;

  const chiffres = [
    { valeur: membres.length,   titre: 'Membres',     texte: "Fiches, CV téléchargeables et entreprises d'alternance.", lien: 'groupe.html' },
    { valeur: nbChapitres,      titre: 'Chapitres',   texte: 'Numérotés, avec 2 examens chacun et un bilan.',            lien: 'cours.html' },
    { valeur: nbExercices,      titre: 'Exercices',   texte: 'Algo, C, PHP, JavaScript, Java — énoncé + correction.',    lien: 'exercices.html' },
    { valeur: nbCompetences,    titre: 'Compétences', texte: 'Issues des données, filtrables par membre ou catégorie.',  lien: 'groupe.html#competences' },
  ];

  const zoneChiffres = document.getElementById('chiffres');
  zoneChiffres.innerHTML = chiffres.map(bloc => `
    <article class="carte">
      <span class="chiffre">${pad2(bloc.valeur)}</span>
      <h4>${e(bloc.titre)}</h4>
      <p>${e(bloc.texte)}</p>
      <a href="${bloc.lien}">Consulter</a>
    </article>
  `).join('');

  /* Derniers exercices publies, tries par date desc, limite a 3 */
  const langageParId = {};
  const langagesData = await chargerDonnees('exercices');
  langagesData.langages.forEach(l => { langageParId[l.id] = l.nom; });

  const derniers = [...exercicesData.exercices]
    .sort((a, b) => new Date(b.date_exo) - new Date(a.date_exo) || b.id - a.id)
    .slice(0, 3);

  const zoneDerniers = document.getElementById('derniers-exercices');
  if (!derniers.length) {
    zoneDerniers.innerHTML = '<p class="vide">Aucun exercice pour le moment.</p>';
    return;
  }

  zoneDerniers.innerHTML = derniers.map(ex => `
    <article class="carte">
      <p class="exercice__meta">Exercice ${pad2(ex.numero)} · ${e(ex.auteur)}</p>
      <h4>${e(ex.titre)}</h4>
      <p><span class="etiquette etiquette--bleu">${e(langageParId[ex.langage_id])}</span></p>
      <a href="exercices.html?exercice=${ex.id}">Ouvrir l'exercice</a>
    </article>
  `).join('');
});
