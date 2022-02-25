Project1 - La Grande Seduction
Lucien Cusson-Fradet

Simulation avec idées de Room Escape inspiré par le film
La grande séduction par Jean-François Pouliot

Utilisez la souris pour intéragir avec les objets à l'écran.
--------------------------------------------------------------------------------
La grande séduction est un classique du cinéma québécois. Les habitants d’un petit village côtier doivent séduire un médecin pour qu’il s’installe chez eux et ainsi permettre l’ouverture d’une usine qui sortira les travailleurs du chômage.
Ma première idée était de développer un jeu de détective où le joueur devrait trouver des informations sur le médecin avant son arrivée.  À ma grande surprise, il s’avère qu’une logique hors pair est nécessaire pour élaborer de bonnes intrigues et des casse-têtes du genre.
Je me suis alors rabattu sur le bon vieux Matter.js, une librairie que je connais assez bien. Lors de mon projet final dans le cours CART253, j’ai eu l’impression d’avoir seulement effleuré la surface des possibilités qu’offre la librairie. Cette fois-ci je voulais créer un environnement de jeu où chaque objet allait être interactif. Un peu comme l’as fait Derek Yu avec Spelunky1, je voulais que chaque item suive les mêmes règles de physique que les autres et ainsi fournir de la liberté et différentes possibilités d’action au joueur.
Le concept de détective s’est transformé en une simulation aux actions de base assez simple et anodine. Par exemple, utiliser un téléphone. L’intérêt pour le joueur est de trouver comment y parvenir dans cet univers de simulation particulier. Le scénario de jeu va comme suit :
Le joueur doit trouver comment garder la carte en bas de l’écran pour lui donner accès aux points d’intérêt qui s’y trouvent. Il visite alors ces points et s’équipe du combiné de téléphone ainsi que d’un rat mort qu’il peut ramener dans son environnement de jeu principal. Sur la carte, le joueur peut aussi rebrancher le câble de téléphone du village et trouver le numéro de téléphone (en binaire) de l’hôpital sur le mur du bureau de poste. Équipé de tous ces objets, le joueur peut reconstituer le téléphone, le brancher et appeler l’hôpital. En donnant le rat à la personne au bout du fil, le joueur reçoit les informations du médecin qui se trouve sur le bateau en direction du village. Tout cela doit être effectué avant que ce dit bateau arrive au village.
Comme à mon habitude, j’ai légèrement surestimé le travail que requérait mon projet et mes ambitions étaient un peu trop grandes. La version finale du jeu a un minimum d’objets. Je voulais à l’origine qu’il y ait d’avantage d’objets interactifs. Sans réelle fonction dans le scénario, ces derniers aurait rendu la séquence de jeu moins évidente pour le joueur.
Le design et la création des éléments visuels et sonores du jeu se sont aussi avérés assez difficiles. J’ajoute à ma ceinture une toute nouvelle tentative de dithering en temps réel qui s’est avérée beaucoup trop lourde pour le navigateur web.  Je suis tout de même très content du résultat final, même si les effets de pixellisation ont été faits manuellement. J’aime particulièrement la transparence de chaque élément qui ajoute une modernité à cet ancien style de graphique visuel.
Mon expérience avec le projet a, une fois de plus, confirmé que la librairie Matter.js est très puissante et impressionnante. Je la maitrise assez bien maintenant, mais je suis aussi conscient de ses limitations. Entre autre, la difficulté d’implémenté du son sur les collisions. (C’est d’ailleurs sur la liste de « travail en cours » pour les développeurs!)
Le jeu dans son intériorité est, en mon sens, assez complet. Il offre une expérience satisfaisante, dynamique et rigolote au joueur. La structure me semble assez solide pour permettre de continuer à y ajouter des éléments et rendre le tout davantage engageant.
Je vous souhaite une bonne découverte de ma représentation du petit village de Sainte-Marie-La-Mauderne!

Lucien Cusson-Fradet

1Derek Yu, Spelunky, 2013 (Mossmouth LLC : San Fransisco, USA) https://spelunkyworld.com/
