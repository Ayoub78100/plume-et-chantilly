# Plume & Chantilly — site vitrine

Site statique (HTML/CSS/JS), sans build. Déploiement : GitHub + Vercel.

## Modifier le contenu
- Prix / produits : `index.html`, section `#creations`. Les produits à valider (citron meringuée, fraisier, macarons, cupcakes) sont en commentaire `<!-- ... -->` : retirer le commentaire pour les afficher.
- Photos : déposer dans `img/` (format portrait 4:5 conseillé), puis référencer dans `index.html`.
- SIRET : `mentions-legales.html` (remplacer « en cours d'immatriculation »).

## Formulaire
Envoyé par FormSubmit vers christelle.lecornu3107@gmail.com.
La 1re demande déclenche un e-mail d'activation chez Christelle : elle doit cliquer sur le lien « Activate Form ».

## Déployer
git add . && git commit -m "message" && git push   → Vercel redéploie automatiquement.
