class Formule {
    /* Formule contains all the functions related to formulas handling
    * It has multiple attributes :
    *   - boolean isSymboleLogique : Whether this is a symbole logique or a formula
    *   - Operateur operateur : Can be undefined, else it is the primary operator of this formula
    *   - String f1 : String containing either a symbole logique or a formula
    *   - String f2 : Can be undefined, String containing either a symbole logique or a formula
    * */

    //Constructor takes a string to initalize an object
    constructor(strFormule) {
        this.expression = strFormule;
        this.isSymboleLogique = (strFormule.length === 1 || strFormule.length === 2)
        //Cas spécial pour ((¬((A)))) par exemple
        if(strFormule.match(/^\(*¬\(*[A-z]\)*$/)) {
            let first = strFormule.replaceAll("(", "")
            let second = first.replaceAll(")", "")
            this.expression = second;
            this.isSymboleLogique = true;
        }
    }

    // returns a boolean if this is the negation of the parameter
    isNegationOf(symbole) {
        if (this.expression.length <= 2) {
            return (this.expression === "¬" + symbole.expression || "¬" + this.expression === symbole.expression);
        } else {
            console.log("Impossible d'appeler cette méthode sur autre chose qu'un litteral ou sa négation");
        }
    }

    fragment() {
        //Si c'est un littéral on ne décompose pas
        if (this.expression.length === 1) {
            return [this.expression];
        }

        let formula = this.expression;

        //Stock les sous formules et les opérateurs
        let formulaShards = [];

        //Position de la première parenthèse ouvrante
        let beginShard = 0;
        //Compte le nombre de parenthèses ouvertes (+1) et fermantes (-1), si = 0 alors nous ne sommes pas dans une parenthèse
        let nbParenthesis = 0;

        //Enumère sur la totalité de la formule
        for (let i = 0; i < formula.length; i++) {
            switch (formula[i]) {
                //Si on trouve une parenthèse ouvrante, on incrémente le compteur de parenthèses
                case '(' :
                    if (nbParenthesis === 0) beginShard = i;
                    nbParenthesis++;
                    break;
                //Si on trouve une parenthèse fermante, on décremente le compteur de parenthèses
                case ')' :
                    nbParenthesis--;
                    //Si le compteur de parenthèses est à 0 après une parenthèse fermante, alors il faut ajouter le bloc trouvé, c'est une sous formule
                    if (nbParenthesis === 0) formulaShards.push(formula.substring(beginShard+1, i));
                    break;
                //Si on a ni (, ni ) alors c'est un littéral ou un opérateur, on l'ajoute seul
                default :
                    if (nbParenthesis === 0) formulaShards.push(formula[i]);
                    break;
            }
        }

        //Si on a trouvé un seul élément, alors c'est soit un littéral, soit une formule avec trop de parenthèses, on la repasse dans le décomposeur
        return formulaShards.length === 1 ? (new Formule(formulaShards[0])).fragment() : formulaShards;
    }

    nextOperator() {
        //Formule fragmenter à traiter
        let arrForm = this.fragment();

        for(let i = 0; i<arrForm.length-1; i++) { //Le dernier élément ne peut pas être un non
            if(arrForm[i]==="¬" && arrForm[i+1]!=="¬" && arrForm[i+1].length>2) { //Si on rencontre un non, on vérifie que l'élément suivant ne soit pas un non ou un littéral.
                //Si les conditions sont réunis on parenthèse le prochain élément
                arrForm[i+1] = "(" + arrForm[i+1] + ")"
            }
        }

        //Position de l'opérateur
        let posOperator;


        if ((posOperator = arrForm.lastIndexOf("→")) > -1) {
            return ["→", posOperator, [new Formule("¬(" + arrForm.slice(0, posOperator).join("") + ")"), new Formule(arrForm.slice(posOperator + 1).join(""))]]
        } else if ((posOperator = arrForm.lastIndexOf("∨")) > -1) {
            return ["∨", posOperator, [new Formule(arrForm.slice(0, posOperator).join("")), new Formule(arrForm.slice(posOperator + 1).join(""))]];
        } else if ((posOperator = arrForm.lastIndexOf("∧")) > -1) {
            return ["∧", posOperator, [new Formule(arrForm.slice(0, posOperator).join("")), new Formule(arrForm.slice(posOperator + 1).join(""))]];
        } else if (arrForm[0] === "¬" && arrForm[1] === "¬") { //Double négation
            if(arrForm.length===3) {
                return ["¬¬", 0, [new Formule(arrForm[2].slice(1, -1))]];
            } else {
                return ["¬¬", 0, [new Formule(arrForm.slice(2).join(""))]];
            }

        } else if (arrForm[0] === "¬" && arrForm.length === 2) { //Cas d'une négation
            let formuleSansInverse = new Formule(arrForm[1])

            //Si la sous formule commence aussi par une négation alors la prochaine opération est une double négation
            let fragmentFormuleSansInverse = formuleSansInverse.fragment();
            if (fragmentFormuleSansInverse[0] === "¬" && fragmentFormuleSansInverse[1] !== "¬" && fragmentFormuleSansInverse.length === 2) return ["¬¬", 0, [new Formule(fragmentFormuleSansInverse.slice(1).join(""))]];

            //Sinon on regarde l'opérateur principal de la sous formule associée
            let operator = formuleSansInverse.nextOperator();
            switch (operator[0]) {
                case "∧":
                    return ["¬∧", null, [new Formule("¬(" + fragmentFormuleSansInverse.slice(0, operator[1]).join("") + ")"), new Formule("¬(" + fragmentFormuleSansInverse.slice(operator[1] + 1).join("") + ")")]]
                case "∨":
                    return ["¬∨", null, [new Formule("¬(" + fragmentFormuleSansInverse.slice(0, operator[1]).join("") + ")"), new Formule("¬(" + fragmentFormuleSansInverse.slice(operator[1] + 1).join("") + ")")]]
                case "→":
                    return ["¬→", null, [new Formule(fragmentFormuleSansInverse.slice(0, operator[1]).join("")), new Formule("¬(" + fragmentFormuleSansInverse.slice(operator[1] + 1).join("") + ")")]]
                case "¬¬":
                    return ["¬", null, [new Formule("¬(" + fragmentFormuleSansInverse[2] + ")")]]
                default:
                    return "ERROR_NO";
            }
        } else {
            return "ERROR";
        }
    }

    //Return an array with the number of nodes to create and an array of the formula for the nodes
    nextNode() {
        if(this.isSymboleLogique) {
            return [1, [new Formule(this.expression)]];
        }
        //Array with next formulas
        let nextOperation = this.nextOperator();
        switch(nextOperation[0]) {
            case "¬¬":
            case "¬∨":
            case "¬→":
            case "¬":
            case "∧":
                return [1, nextOperation[2]];
            case "¬∧":
            case "→":
            case "∨":
                return [2, nextOperation[2]];
            case "ERROR":
            default:
                console.log("Something went wrong")
                break;
        }
    }

} 