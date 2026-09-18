document.addEventListener('DOMContentLoaded', async () => {
  const data = await chargerDonnees('exercices');
  if (!data) return;

  const { langages, exercices } = data;
  const langageParId = {};
  langages.forEach(l => { langageParId[l.id] = l; });

  const params = parametresUrl();
  const exerciceId = parseInt(params.get('exercice'), 10) || 0;
  const slug = params.get('langage') || '';

  /* Onglets par langage */
  const onglets = document.getElementById('onglets-langages');
  let html = `<a href="exercices.html"${slug === '' ? ' class="actif"' : ''}>Tous</a>`;
  html += langages.map(l => `
    <a href="exercices.html?langage=${e(l.slug)}"${slug === l.slug ? ' class="actif"' : ''}>${e(l.nom)}</a>
  `).join('');
  onglets.innerHTML = html;

  /* Detail d'un exercice si selectionne */
  const zoneDetail = document.getElementById('zone-exercice-detail');
  const exercice = exercices.find(ex => ex.id === exerciceId) || null;
  if (exercice) {
    const langage = langageParId[exercice.langage_id];
    const retourHref = 'exercices.html' + (slug ? '?langage=' + e(slug) : '');
    zoneDetail.innerHTML = `
      <div class="conteneur">
        <article class="carte">
          <p class="exercice__meta">
            Exercice ${pad2(exercice.numero)} ·
            séance du ${formaterDate(exercice.date_exo)} ·
            posté par ${e(exercice.auteur)}
          </p>
          <h2>${e(exercice.titre)}</h2>
          <p><span class="etiquette etiquette--bleu">${e(langage ? langage.nom : '')}</span>
             ${exercice.correction ? '<span class="etiquette etiquette--valide">Corrigé disponible</span>' : ''}
          </p>

          <h4>Énoncé</h4>
          <p>${e(exercice.enonce).replace(/\n/g, '<br>')}</p>

          ${exercice.correction ? `
            <details class="repli">
              <summary>Afficher la correction</summary>
              <pre><code>${e(exercice.correction)}</code></pre>
            </details>
          ` : ''}

          <p><a href="${retourHref}">&#8592; Retour à la liste</a></p>
        </article>
      </div>
    `;
  } else {
    zoneDetail.innerHTML = '';
  }

  /* Liste des exercices filtree par langage */
  let liste = exercices;
  if (slug) {
    liste = liste.filter(ex => langageParId[ex.langage_id] && langageParId[ex.langage_id].slug === slug);
  }
  liste = [...liste].sort((a, b) => a.numero - b.numero);

  const zoneListe = document.getElementById('liste-exercices');
  if (!liste.length) {
    zoneListe.innerHTML = '<p class="vide">Aucun exercice pour ce langage.</p>';
    return;
  }

  zoneListe.innerHTML = liste.map(ex => {
    const langage = langageParId[ex.langage_id];
    return `
      <article class="carte">
        <p class="exercice__meta">Exercice ${pad2(ex.numero)} · ${e(ex.auteur)}</p>
        <h4>${e(ex.titre)}</h4>
        <p>${e(couper(ex.enonce, 110))}</p>
        <p>
          <span class="etiquette etiquette--bleu">${e(langage ? langage.nom : '')}</span>
          ${ex.correction ? '<span class="etiquette etiquette--valide">Corrigé</span>' : ''}
        </p>
        <a href="exercices.html?exercice=${ex.id}">Ouvrir l'exercice</a>
      </article>
    `;
  }).join('');
});
