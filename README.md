

# prefixTrip



## Usage

	Le script postinstall.js , ne s'effectue pas , la base de données est donc vide , il est nécessaire de la remplir.
	en executant l'application avec npm start, il faut se rendre sur localhost:3000 et créer un compte pour se servir des fonctionnalités du site.
	( un compte utilisateur est déjà créé et les champs sont préremplis avec les identifiants de ce compte).

	On peut ensuite créer un groupe et y ajouter des utilisateurs. La saisie d'un mot de passe est nécessaire à la création d'un groupe.

	On peut par la suite créer des factures entre 1 ou plusieurs payeurs et 1 ou plusieurs endettés en cliquant sur l'onglet "Facturation" et en remplissant le formulaire présenté.
	les factures ne peuvent être créées qu'entre les membres d'un même groupe.
	Il existe deux modes de répartition des dettes , ainsi que la possibilité pour un utilisateur ayant avancé de l'argent de se faire rembourser intégralement. (avancer de l'argent sans participer au paiement final).

	Il est possible de lister toutes les dettes en cours pour l'utilisateur connecté, tant celles qu'il doit que celles qui lui sont dues en cliquant sur l'onglet "Transactions".
	On peut dans ce même onglet annoncer qu'un versement en cash a bien été perçu en précisant le contexte ( à savoir la facture concernée ).
	Si la somme est dûe par l'utilisateur, une interface de paiement par paypal existe mais n'est pas intégralement fonctionnelle.

	Il est également possible d'afficher toutes les factures pour le groupe sélectionné dans l'onglet "Factures". 

	Enfin un récapitulatif des sommes dûes, ainsi que celles en attente de remboursement est accessible au travers de l'onglet "Dashboard".



## Developing



### Tools
