document.addEventListener('DOMContentLoaded', async () => {
  const coursListe = await chargerDonnees('cours');
  if (!coursListe) return;

  /* Applatit tous les chapitres, tous cours confondus, tries par cours puis numero */
  const chapitres = [];
  coursListe.forEach(co => {
    co.chapitres.forEach(ch => {
      chapitres.push({ ...ch, cours: co.titre });
    });
  });

  const params = parametresUrl();
  let chapitreId = parseInt(params.get('chapitre'), 10) || 0;
  if (!chapitreId && chapitres.length) {
    chapitreId = chapitres[0].id;
  }

  const chapitre = chapitres.find(ch => ch.id === chapitreId) || null;

  document.getElementById('titre-cours').textContent = chapitre ? chapitre.cours : 'Chapitres';

  const listeEl = document.getElementById('liste-chapitres');
  if (!chapitres.length) {
    listeEl.innerHTML = '<li class="vide">Aucun chapitre enregistré.</li>';
  } else {
    listeEl.innerHTML = chapitres.map(ch => `
      <li>
        <a href="cours.html?chapitre=${ch.id}"${ch.id === chapitreId ? ' class="actif"' : ''}>
          <span>
            <span class="chapitre__numero">Chapitre ${ch.numero}</span><br>
            ${e(ch.titre)}
          </span>
        </a>
      </li>
    `).join('');
  }

  const detailEl = document.getElementById('detail-chapitre');
  if (!chapitre) {
    detailEl.innerHTML = '<p class="vide">Sélectionnez un chapitre.</p>';
    return;
  }

  const exercicesLiesHtml = (chapitre.exercices_lies || []).map(el => `
    <li><a href="exercices.html?exercice=${el.exercice_id}">${e(el.label)} &#8594;</a></li>
  `).join('');

  detailEl.innerHTML = `
    <article class="carte">
      <p class="chapitre__numero">Chapitre ${chapitre.numero}</p>
      <h2>${e(chapitre.titre)}</h2>
      <p>${e(chapitre.contenu).replace(/\n/g, '<br>')}</p>
      ${chapitre.exemple_code ? `<pre><code>${e(chapitre.exemple_code)}</code></pre>` : ''}
      ${exercicesLiesHtml ? `
        <h4>Exercice${(chapitre.exercices_lies || []).length > 1 ? 's' : ''} associé${(chapitre.exercices_lies || []).length > 1 ? 's' : ''}</h4>
        <ul class="competences__liste">${exercicesLiesHtml}</ul>
      ` : ''}
    </article>

  `;
});
