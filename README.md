# Monevo: Your Money Made Easy

Crée une application web moderne, responsive et très facile à utiliser appelée « Monevo ».

L'objectif de Monevo est d'aider les utilisateurs du monde entier à gérer simplement leur argent au quotidien. L'application doit être pensée pour les débutants et ne doit jamais être compliquée ou ressembler à un logiciel de comptabilité professionnel.

LANGUE ET INTERNATIONALISATION

La langue par défaut est le français.

Prévoir une architecture permettant d'ajouter d'autres langues plus tard.

Lors de la première utilisation, demander à l'utilisateur de choisir sa devise principale.

Proposer une liste de nombreuses devises internationales, notamment XOF, XAF, EUR, USD, GBP, CAD, CHF et d'autres devises courantes.

Tous les montants, symboles et formats doivent utiliser automatiquement la devise choisie.

Pour cette V1, ne pas effectuer de conversion automatique entre les devises : une devise principale est utilisée pour toutes les données d'un utilisateur.

OBJECTIF PRINCIPAL L'utilisateur doit pouvoir rapidement :

Voir combien d'argent il possède.

Ajouter ses revenus.

Ajouter ses dépenses.

Suivre ses dépenses.

Gérer ses abonnements récurrents.

Préparer une réserve pour les dépenses imprévues.

Créer et suivre des objectifs d'épargne.

STRUCTURE DE L'APPLICATION

Créer une navigation simple avec les sections suivantes :

Accueil

Transactions

Abonnements

Objectifs

Paramètres

PAGE D'ACCUEIL

Créer un tableau de bord simple et visuellement clair.

Afficher en haut :

Un message de bienvenue.

Le solde total disponible.

La devise utilisée.

Afficher ensuite des cartes claires avec :

Revenus du mois.

Dépenses du mois.

Réserve pour imprévus.

Total des abonnements mensuels.

Ajouter un bouton principal visible : « + Ajouter une transaction »

Ajouter également une section « Aperçu des objectifs » montrant les objectifs d'épargne et leur progression.

TRANSACTIONS

Créer une page permettant d'ajouter et de consulter toutes les transactions.

Le formulaire « Ajouter une transaction » doit contenir :

Type : Revenu ou Dépense.

Nom ou description.

Montant.

Catégorie.

Date.

Créer des catégories simples avec des icônes, par exemple :

Nourriture

Transport

Logement

Shopping

Loisirs

Santé

Factures

Éducation

Autres

L'utilisateur doit pouvoir :

Ajouter une transaction.

Modifier une transaction.

Supprimer une transaction.

Consulter son historique.

Voir le total des revenus.

Voir le total des dépenses.

ABONNEMENTS

Créer une page « Mes abonnements ».

L'utilisateur peut ajouter un abonnement avec :

Nom du service.

Prix.

Fréquence : mensuelle ou annuelle.

Date du prochain paiement.

Afficher clairement :

La liste des abonnements.

Le coût mensuel estimé.

Le coût annuel estimé.

Créer une interface simple permettant à l'utilisateur de modifier ou supprimer un abonnement.

DÉPENSES IMPRÉVUES

Ajouter une fonctionnalité visible depuis l'accueil ou les paramètres appelée « Réserve imprévus ».

L'utilisateur peut définir un montant réservé aux dépenses imprévues.

Cette réserve doit être affichée séparément du solde réellement disponible.

Exemple de calcul : Solde total : 100 000 Réserve imprévus : 20 000 Disponible à dépenser : 80 000

OBJECTIFS D'ÉPARGNE

Créer une page permettant à l'utilisateur de créer plusieurs objectifs.

Chaque objectif doit contenir :

Nom.

Montant cible.

Montant déjà économisé.

Date cible facultative.

Afficher :

Une barre de progression.

Le pourcentage atteint.

Le montant restant.

Permettre à l'utilisateur de :

Créer un objectif.

Modifier un objectif.

Ajouter de l'argent à un objectif.

Supprimer un objectif.

PARAMÈTRES

Créer une page Paramètres avec :

Modification de la devise principale.

Choix de la langue à l'avenir.

Gestion des données.

Suppression des données.

Informations sur l'application.

DESIGN

Le design doit être :

Moderne.

Minimaliste.

Professionnel.

Très simple pour les débutants.

Adapté principalement aux smartphones.

Responsive pour ordinateur et tablette.

Utiliser :

De grandes cartes avec des coins arrondis.

Une hiérarchie visuelle claire.

Des icônes faciles à comprendre.

Des boutons suffisamment grands pour une utilisation sur téléphone.

Peu de texte inutile.

Une navigation simple.

Ne pas surcharger les écrans avec trop d'informations.

FONCTIONNEMENT TECHNIQUE

Créer une vraie application fonctionnelle et non uniquement une maquette.

Les utilisateurs doivent pouvoir :

Ajouter, modifier et supprimer leurs données.

Voir automatiquement les calculs mis à jour.

Conserver leurs données après avoir fermé puis rouvert l'application.

Pour cette première version, créer une base solide et fonctionnelle. Prévoir une architecture permettant d'ajouter plus tard :

Un compte utilisateur.

La synchronisation sur plusieurs appareils.

Des statistiques avancées.

Des rappels d'abonnements.

Des prévisions financières.

Une version Premium.

IMPORTANT

Commencer par construire la V1 complète avec toutes les pages et fonctionnalités décrites ci-dessus.

Priorité absolue :

Simplicité.

Facilité d'utilisation.

Application réellement fonctionnelle.

Interface mobile moderne.

Calculs corrects et automatiques.

Ne pas ajouter de fonctionnalités inutiles qui compliquent l'application.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://my-easy-money-guide.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d8150e1b-3a6e-4228-96e9-025a06edafc7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
