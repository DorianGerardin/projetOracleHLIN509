# projetOracleHLIN509

1. Analyse syntaxicale (NON, OU, ET, IMPLICATION, EQUIVALENCE*)
ET : &&, &, ET, AND, ∧
OU : ||, |, OU, OR, V, ∨
NON : !, NO, NON, ¬, ~
IMPLICATION : ->, =>, →, ⇒
SYMBOLE LOGIQUE : A-Z
Highlight en rouge si le symbole n'est pas détecté

2. Vérification syntaxicale
-> Nombres de parenthèses, placement parenthèses,
placement symboles logiques, succession symbole logiques
EN GROS VERIFIER FBF
/!\ SUPPOSEE NON VALIDE

3. Transformation en "ou" et "et"
Transformer équivalence et implication

4. Classe 
GAME :
Contient toutes les nodes
Le score du joueur
Le temps
Méthode pour faire un nouveau jeu (supprime les paramètres)

NODE :
- Contient des formules -> Liste
- Combien d'enfants (0, 1, 2) -> [Node, Node]
- Parent (au cas où)
- Fermée : isClosed (par machine)
- Fermée : isClosedUser (par user)
- Formule sélectionnée pour passer à la node suivante -> Créer nouvelles formules et nouvelle(s) node avec méthode qui crée deux Strings et donc deux nouvelles formules
Méthode qui vérifie si la node est fermée (A et non A)
Méthode pour OU / ET pour créer les nodes suivantes
Méthode pour fermer

FORMULE :
String qui donne la formule (A ou B)
Méthode pour vérifier FBF
Méthode transformation implication
Opérande et opérateur

SCORE :
Faire un algo qui teste toutes les formules pour trouver arbre minimal
Pour calculer le score :
- Hauteur de l'arbre / Nombres de clics
- Game over si tu ferme l'arbre alors qu'il est ouvert
- Pénalité si il y'a une contradiction mais le joueur continue
- Temps (?)

5. Partie graphique
Chercher comment faire dynamiquement un arbre pour ne pas avoir de chevauchement
onClick sur les formules et fermer (avec joli CSS, changement couleurs onHover)
Ctrl Z au cas où / Retour (à voir)
