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
          <tr>
            <td><strong>${e(d.nom)}</strong></td>
            <td>${e(d.meta)}</td>
            <td><span class="etiquette">${e(d.format)}</span></td>
            <td><a href="${e(d.fichier)}" target="_blank" rel="noopener noreferrer">Télécharger</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
});
