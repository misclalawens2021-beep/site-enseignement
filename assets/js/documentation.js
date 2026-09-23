document.addEventListener('DOMContentLoaded', async () => {
  const documents = await chargerDonnees('documents');
  const zone = document.getElementById('zone-documents');
  if (!documents) return;

  if (!documents.length) {
    zone.innerHTML = '<p class="vide">Aucun document enregistré.</p>';
    return;
  }

  zone.innerHTML = `
    <table class="tableau">
      <thead>
        <tr><th>Document</th><th>Description</th><th>Format</th><th></th></tr>
      </thead>
      <tbody>
        ${documents.map(d => `
          <tr class="ligne-document">
            <td><strong>${e(d.nom)}</strong></td>
            <td>${e(d.meta)}</td>
            <td><span class="etiquette">${e(d.format)}</span></td>
            <td class="actions-doc">
              <a href="${e(d.fichier)}" target="_blank" rel="noopener noreferrer">Télécharger</a>
              ${String(d.format).trim().toUpperCase() === 'PDF', 'PNG' ? `<button type="button" class="bouton bouton--secondaire bouton--petit bouton-apercu" data-fichier="${e(d.fichier)}" data-id="${e(d.id)}">Aperçu</button>` : ''}
            </td>
          </tr>
          <tr class="ligne-apercu" id="apercu-${e(d.id)}" hidden>
            <td colspan="4"><div class="apercu-pdf"></div></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  zone.addEventListener('click', (evt) => {
    const bouton = evt.target.closest('.bouton-apercu');
    if (!bouton) return;

    const ligneApercu = document.getElementById(`apercu-${bouton.dataset.id}`);
    const conteneur = ligneApercu.querySelector('.apercu-pdf');
    const etaitOuverte = !ligneApercu.hidden;

    // referme tous les aperçus ouverts avant d'en ouvrir un nouveau
    zone.querySelectorAll('.ligne-apercu').forEach(ligne => {
      ligne.hidden = true;
      ligne.querySelector('.apercu-pdf').innerHTML = '';
    });
    zone.querySelectorAll('.bouton-apercu').forEach(b => b.textContent = 'Aperçu');

    if (!etaitOuverte) {
      conteneur.innerHTML = `<iframe src="${bouton.dataset.fichier}" title="Aperçu de ${e(bouton.closest('tr').querySelector('strong')?.textContent || 'document')}" loading="lazy"></iframe>`;
      ligneApercu.hidden = false;
      bouton.textContent = 'Fermer l\u2019aperçu';
    }
  });
});