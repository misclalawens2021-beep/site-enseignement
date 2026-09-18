let ETAT = { membres: [], entreprises: [], categories: [], competences: [] };

document.addEventListener('DOMContentLoaded', async () => {
  const [membres, entreprises, donneesCompetences] = await Promise.all([
    chargerDonnees('membres'),
    chargerDonnees('entreprises'),
    chargerDonnees('competences'),
  ]);
  if (!membres || !entreprises || !donneesCompetences) return;

  ETAT.membres = membres;
  ETAT.entreprises = entreprises;
  ETAT.categories = donneesCompetences.categories;
  ETAT.competences = donneesCompetences.competences;

  afficherMembres();
  afficherEntreprises();
  remplirFiltres();

  const params = parametresUrl();
  document.getElementById('q').value = params.get('q') || '';
  document.getElementById('membre').value = params.get('membre') || '0';
  document.getElementById('categorie').value = params.get('categorie') || '0';

  afficherCompetences();

  document.getElementById('form-filtres').addEventListener('submit', (evt) => {
    evt.preventDefault();
    const q = document.getElementById('q').value.trim();
    const membre = document.getElementById('membre').value;
    const categorie = document.getElementById('categorie').value;

    const nouveauxParams = new URLSearchParams();
    if (q) nouveauxParams.set('q', q);
    if (membre !== '0') nouveauxParams.set('membre', membre);
    if (categorie !== '0') nouveauxParams.set('categorie', categorie);
    const suffixe = nouveauxParams.toString() ? '?' + nouveauxParams.toString() : '';
    history.replaceState(null, '', 'groupe.html' + suffixe + '#competences');

    afficherCompetences();
  });
});

function afficherMembres() {
  const zone = document.getElementById('membres');
  if (!ETAT.membres.length) {
    zone.innerHTML = '<p class="vide">Aucun membre enregistré.</p>';
    return;
  }
  zone.innerHTML = ETAT.membres.map(m => `
    <article class="carte">
      <div class="membre__portrait">portrait 600x600</div>
      <p class="membre__role">${e(m.role)}</p>
      <h4>${e((m.prenom + ' ' + m.nom).trim())}</h4>
      <p>${e(m.bio)}</p>
      <a class="bouton bouton--secondaire bouton--petit" href="${e(m.cv_pdf)}" target="_blank" rel="noopener noreferrer">Voir le CV — PDF</a>
    </article>
  `).join('');
}

function afficherEntreprises() {
  const zone = document.getElementById('entreprises');
  if (!ETAT.entreprises.length) {
    zone.innerHTML = '<p class="vide">Aucune entreprise enregistrée.</p>';
    return;
  }
  zone.innerHTML = ETAT.entreprises.map(en => `
    <article class="carte">
      <p><span class="etiquette etiquette--bleu">${e(en.contrat)}</span></p>
      <h4>${e(en.nom)}</h4>
      <p class="exercice__meta">${e(en.secteur)} · ${e(en.ville)} · ${e(en.periode)} · ${e(en.prenom)}</p>
      <p>${e(en.missions)}</p>
      ${en.site_web ? `<a href="${e(en.site_web)}" target="_blank" rel="noopener noreferrer">Site web &#8599;</a>` : ''}
    </article>
  `).join('');
}

function remplirFiltres() {
  const selMembre = document.getElementById('membre');
  ETAT.membres.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.prenom;
    selMembre.appendChild(opt);
  });

  const selCat = document.getElementById('categorie');
  [...ETAT.categories].sort((a, b) => a.nom.localeCompare(b.nom)).forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.nom;
    selCat.appendChild(opt);
  });
}

function afficherCompetences() {
  const recherche = document.getElementById('q').value.trim().toLowerCase();
  const membreId = parseInt(document.getElementById('membre').value, 10) || 0;
  const categorieId = parseInt(document.getElementById('categorie').value, 10) || 0;

  const catParId = {};
  ETAT.categories.forEach(c => { catParId[c.id] = c.nom; });

  let lignes = ETAT.competences.filter(c => {
    if (recherche && !c.nom.toLowerCase().includes(recherche)) return false;
    if (membreId && c.membre_id !== membreId) return false;
    if (categorieId && c.categorie_id !== categorieId) return false;
    return true;
  });

  lignes = lignes.map(c => ({ ...c, categorie: catParId[c.categorie_id] }))
    .sort((a, b) => a.categorie.localeCompare(b.categorie) || a.nom.localeCompare(b.nom) || a.prenom.localeCompare(b.prenom));

  const parCategorie = {};
  lignes.forEach(l => {
    if (!parCategorie[l.categorie]) parCategorie[l.categorie] = [];
    parCategorie[l.categorie].push(l);
  });

  const zone = document.getElementById('competences-liste');
  const noms = Object.keys(parCategorie);
  if (!noms.length) {
    zone.innerHTML = '<p class="vide">Aucune compétence ne correspond à ces filtres.</p>';
    return;
  }

  zone.innerHTML = noms.map(nomCategorie => `
    <article class="carte">
      <p class="surtitre">${e(nomCategorie)}</p>
      <ul class="competences__liste">
        ${parCategorie[nomCategorie].map(l => `
          <li>
            <span>${e(l.nom)} <span class="exercice__meta">· ${e(l.prenom)}</span></span>
            <span class="jauge" title="${e(niveauLibelle(l.niveau))}" aria-label="${e(niveauLibelle(l.niveau))}">
              ${[1, 2, 3].map(i => `<span class="${i <= l.niveau ? 'plein' : ''}"></span>`).join('')}
            </span>
          </li>
        `).join('')}
      </ul>
    </article>
  `).join('');
}
