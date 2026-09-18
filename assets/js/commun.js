/* ==========================================================================
   Fonctions communes — equivalent cote client de includes/fonctions.php
   ========================================================================== */

/** Echappe une valeur avant insertion dans le HTML (protection XSS). */
function e(texte) {
  if (texte === null || texte === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(texte);
  return div.innerHTML;
}

/** Coupe un texte a n caracteres et ajoute des points de suspension si besoin. */
function couper(texte, n) {
  texte = texte || '';
  if (texte.length <= n) return texte;
  return texte.slice(0, n) + '...';
}

/** Libelle texte d'un niveau de competence (1 a 3 — cf. charte graphique). */
function niveauLibelle(niveau) {
  const libelles = { 1: 'Notions', 2: 'Intermédiaire', 3: 'Avancé' };
  return libelles[niveau] || 'Notions';
}

/** Formate une date ISO (YYYY-MM-DD) en jj/mm/aaaa. */
function formaterDate(iso) {
  if (!iso) return '';
  const [an, mois, jour] = iso.split('-');
  return `${jour}/${mois}/${an}`;
}

/** Complete un nombre a 2 chiffres avec un zero devant. */
function pad2(n) {
  return String(n).padStart(2, '0');
}

/** Charge un fichier JSON depuis assets/data/. */
async function chargerDonnees(nom) {
  try {
    const reponse = await fetch(`assets/data/${nom}.json`);
    if (!reponse.ok) throw new Error('reponse non ok');
    return await reponse.json();
  } catch (err) {
    console.error(`Impossible de charger ${nom}.json`, err);
    return null;
  }
}

/** Lit les parametres de l'URL courante. */
function parametresUrl() {
  return new URLSearchParams(window.location.search);
}

/* ------------------------------------------------ Exercices terminés (localStorage) */

const CLE_EXERCICES_FAITS = 'exercices_faits';

/** Retourne le tableau des ids d'exercices marqués comme faits. */
function getExercicesFaits() {
  try {
    const brut = localStorage.getItem(CLE_EXERCICES_FAITS);
    const liste = brut ? JSON.parse(brut) : [];
    return Array.isArray(liste) ? liste.map(Number) : [];
  } catch {
    return [];
  }
}

/** Indique si un exercice est marqué comme fait. */
function estExerciceFait(id) {
  return getExercicesFaits().includes(Number(id));
}

/** Marque un exercice comme fait (ou le dé-marque si dejaFait = false). */
function setExerciceFait(id, dejaFait = true) {
  const idNum = Number(id);
  let liste = getExercicesFaits();
  if (dejaFait) {
    if (!liste.includes(idNum)) liste.push(idNum);
  } else {
    liste = liste.filter(x => x !== idNum);
  }
  try {
    localStorage.setItem(CLE_EXERCICES_FAITS, JSON.stringify(liste));
  } catch (err) {
    console.error('Impossible d\'enregistrer les exercices faits', err);
  }
}

/* ---------------------------------------------------------- En-tete / pied */

/** Remplit le header et le footer avec les infos du site (site.json). */
async function initSiteInfos() {
  const site = await chargerDonnees('site');
  if (!site) return;

  document.querySelectorAll('[data-site="nom"]').forEach(el => { el.textContent = site.nom; });
  document.querySelectorAll('[data-site="mail"]').forEach(el => {
    el.textContent = site.mail;
    if (el.tagName === 'A') el.href = `mailto:${site.mail}`;
  });
  document.querySelectorAll('[data-site="adresse"]').forEach(el => { el.textContent = site.adresse; });
  document.querySelectorAll('[data-site="linkedin"]').forEach(el => { el.href = site.linkedin; });
  document.querySelectorAll('[data-site="github"]').forEach(el => { el.href = site.github; });
  document.querySelectorAll('[data-site="instagram"]').forEach(el => { el.href = site.instagram; });

  document.title = document.title.replace('__SITE_NOM__', site.nom);
}

/** Menu mobile : ouverture / fermeture de la navigation. */
function initMenuMobile() {
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('navigation');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const ouvert = nav.classList.toggle('ouvert');
    burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSiteInfos();
  initMenuMobile();
  const anneeEl = document.getElementById('annee');
  if (anneeEl) anneeEl.textContent = new Date().getFullYear();
});
