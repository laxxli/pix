# 17. Choisir le sélecteur pour les tests front-end

Date : 26/01/2021

## État

Proposé

## Contexte

Sur les tests front-end, nous avons besoin de vérifier que certaines balises sont présentes.
Suite à un échange sur une PR, il semble que la solution [ne soit pas partagée](https://github.com/1024pix/pix/pull/2183#issuecomment-734674614)

Nous avons aussi besoin que le test passe si :
- la balise est déplacée
- l'utilisateur choisit une autre langue
- le texte affiché à l'écran par la balise change

### Solutions

3 solutions s'offrent pour la construction : 
- rechercher le texte contenu dans la balise
- utiliser un sélecteur sur l'attribut `aria-label`
- utiliser un sélecteur sur attribut `data-test`

#### data-test
Il existe deux variantes d'écriture :
* sans valeur : `<button data-test-foo-button>Like</button>`
* avec valeur :`<button data-test=foo-button>Like</button>`

Nommage : ajouter un attribut `data-test-<ENTITE>` sans valeur
````html
<article>
  <h1 data-test-post-title data-test-resource-id={{post.id}}>{{post.title}}</h1>
  <p>{{post.body}}</p>
  <button data-test-like-button>Like</button>
</article>
````
Assertion : rechercher un attribut `data-test-<ENTITE>` sans valeur
```` javascript
assert.dom('[data-test-post-title]').hasText('Ember is great!');
await click('[data-test-like-button]');
````
Le plugin [ember-test-selectors](https://github.com/simplabs/ember-test-selectors) permet de supprimer les sélecteurs au build.

### Comparaison des solutions
La solution "rechercher le texte contenu dans la balise" n'est pas une bonne pratique, car elle rend les 
tests fragiles (lors d'une modification de texte, le test sort à tort en erreur). De plus, l'internationalisation
rend l'obtention du texte complexe (utilisation de helpers, page non traduite).

La solution "aria-label" n'est pas optimale, car cet attribut ne doit être utilisé que lorsque le texte 
d’un label n’est pas visible à l’écran, et ne sera pas systématiquement présent. 

La solution "data-test" fait partie des standards, elle est préconisée [par Cypress](https://docs.cypress.io/guides/references/best-practices.html#Real-World-Example).

## Décision
Il n'y a pas unanimité, une [expérimentation](https://github.com/1024pix/pix/pull/2410) est donc lancée

## Conséquences
Attente de fin de l'expérimentation pour choisir la solution
