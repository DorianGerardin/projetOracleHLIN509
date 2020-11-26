class Formule {
    /* Formule contains all the functions related to formulas handling
    * It has multiple attributes :
    *   - boolean isSymboleLogique : Whether this is a symbole logique or a formula
    *   - Operateur operateur : Can be undefined, else it is the primary operator of this formula
    *   - String f1 : String containing either a symbole logique or a formula
    *   - String f2 : Can be undefined, String containing either a symbole logique or a formula
    * */

    //Can't directly declare const in ES6
    static get regexSymboleLogiqe() {
        return RegExp("[A-z]{1}");
    }

    static get regexLegalCharacters() {
        //Match letters a-z, A-Z, whitespaces, &, |, !, (, ), ~, -, =, >, <, ∧, ∨, →, ↔, ¬, ⇒
        return RegExp("[A-Za-z\\s\&\|\!\(\)\~\=\\-\>\<\u2227\u2228\u2192\u2194\u00AC\u21D2]");
    }


    //Constructor takes a string to initalize an object
    constructor(strFormule) {
        this.expression = strFormule;
        this.isSymboleLogique = this.isSymboleLogiqueF(strFormule);
    }

    //Returns a boolean stating whether the inputted string is an FBF
    static isFBF(strFormule) {
        for (let i = 0; i < strFormule.length; i++) {
            if (!this.regexLegalCharacters.test(strFormule.charAt(i))) {
                /* TODO : FUNCTION TO HIGHLIGHT DETECTED CHARACTER */
                Formule.scannerFail("Caractère invalide détecté : \"" + strFormule.charAt(i) + "\"", i);
            }
        }

        //If only one symbol, we check if it's a logical symbol
        if(strFormule.length===1) {
            return this.regexSymboleLogiqe.test(strFormule);
        }
        //Sanitize and normalize the inputted string so it's easier to run tests on
        strFormule = Formule.normalizeString(strFormule);

        //We check if we have the same number of opening and closing parenthesis
        if((strFormule.split("(").length)!==(strFormule.split(")").length)) {
            Formule.scannerFail("Mismatched number of parenthesis")
            return false;
        }

        //Here we will test against all special cases that would invalidate a WFF (FBF)
        let notWFF = [/\(→/,
            /→\)/,
            /→→/,
            /∧→/,
            /∨→/,
            /¬→/,
            /→∨/,
            /→∧/,
            /∧∧/,
            /∧\)/,
            /\(∧/,
            /¬∧/,
            /∨∨/,
            /∨\)/,
            /\(∨/,
            /¬∨/,
            /[A-z]¬/,
            /¬\)/,
            /\)¬/,
            /^[→∧∨]/,
            /[→∧∨¬]$/,
            /\)\(/,
            /\(\)/,
            /[A-z][A-z]/
        ]

        for(let rules of notWFF) {
            if(strFormule.search(rules)!==-1) {
                console.log("FOUND ERROR WITH RULE : " + rules);
                return false;
            }
        }

        return true;

    }

    static scannerFail(erreur, i) {
        console.log(erreur);
    }


    /* Normalize the writing for a formula, replaces all the symbols and expressions
    * USED TABLE :
    * ET : &&, &, ET, AND, ∧
    * OU : ||, |, OU, OR, ∨
    * NON : !, NOT, NON, ¬, ~
    * IMPLICATION : ->, =>, →, ⇒
    * Also ignores upper and lowercase
    * Also removes double spaces
     */
    static normalizeString(stringFormula) {
        //Replace spaces, newlines and such
        let strFinal = stringFormula.replace(/\s+/g, '');

        //Replacing all connectors
        //Be careful with handling of doubles (&& -/> &&&)

        //For AND : &&, &, ET, AND, ∧
        strFinal = strFinal
            .replaceAll("&&", "&")
            .replaceAll("&", "∧")
            .replaceAll(/\AND/gi, "∧")
            .replaceAll(/\ET/gi, "∧");

        //For OR : ||, |, OU, OR, ∨
        strFinal = strFinal
            .replaceAll("||", "|")
            .replaceAll("|", "∨")
            .replaceAll(/\OU/gi, "∨")
            .replaceAll(/\OR/gi, "∨");

        //For NOT : !, NOT, NON, ¬, ~
        strFinal = strFinal
            .replaceAll("~", "¬")
            .replaceAll("!", "¬")
            .replaceAll(/\NOT/gi, "¬")
            .replaceAll(/\NON/gi, "¬");

        //For IMPLIES : ->, =>, →, ⇒
        strFinal = strFinal
            .replaceAll("->", "→")
            .replaceAll("=>", "→")
            .replaceAll("⇒", "→");

        return strFinal;

    }



    convertFromString(){

    }

    isSymboleLogiqueF(formule) {
        return (formule.length === 1 || formule.length === 2);
    }

    getIsSymboleLogique() {
        return this.isSymboleLogique;
    }

    // returns a boolean if this is the negation of the parameter
    isNegationOf(symbole) {
        if (this.expression.length <= 2) {
            return (this.expression === "¬" + symbole || "¬" + this.expression === symbole);
        } else {
            console.log("Impossible d'appeler cette méthode sur autre chose qu'un litteral ou sa négation");
        }
        
    }

    getExpression() {
        return this.expression;
    }

    fragment() {
        let formulaShards = new Array();
        let formula = this.expression;
        let beginShard = 0;
        let nbParenthesis = 0;
        if (this.expression.length === 1) {
            return [this.expression];
        }
        for (let i = 0; i < formula.length; i++) {
            let currentChar = formula.charAt(i);
            switch (currentChar) {
                case '(' : 
                    if (nbParenthesis === 0) beginShard = i;
                    nbParenthesis++;
                    break;
                case ')' :
                    nbParenthesis--;
                    if (nbParenthesis === 0) {
                        formulaShards.push(formula.substring(beginShard+1, i));
                        //beginShard = i + 1;
                    }
                    break;
                default :
                    if (nbParenthesis === 0) {
                        formulaShards.push(currentChar);
                        //beginShard = i + 1;
                    }
                    break;
            }
        }
        return formulaShards.length === 1 ? new Formule(formulaShards[0]).fragment() : formulaShards;
    }

    //returns an array of length 2. Array[0] : last operator
    //                              Array[1] : its position in the fragmented tab
    getLastConnector() {
        let formulaShards = this.fragment();
        if (formulaShards.length <= 2 && formulaShards[0].charAt(0) === "¬") {
            let formula = new Formule(formulaShards[1]);
            if (formula.fragment()[0] === "¬") {
                return ["¬¬", null];
            }
            let tab = formula.getLastConnector();
            tab[0] = "¬" + tab[0];
            return tab;
        } else if (formulaShards.length > 2 && formulaShards[0] === "¬") {
            if (formulaShards[1] === "¬") {
                return ["¬¬", null];
            }
        } 
        let lastAloneConnectorPosition = null;
        let lastAloneConnector = "";
        let i = 0;
        formulaShards.forEach(shard => {
            i++;
            if (shard === "→" || shard === "∧" || shard === "∨") {
                lastAloneConnector = shard;
                lastAloneConnectorPosition = i - 1;
            }
        });
        return [lastAloneConnector, lastAloneConnectorPosition];

    }

    deleteUselessNegations() {
        let lastConnectorArray = this.getLastConnector();
        if (lastConnectorArray[0] === "¬¬") {
            let formulaShards = this.fragment();
            if (formulaShards.length > 2) {
                formulaShards.shift();
                formulaShards.shift();
                let remainFormula = "";
                for (let i = 0; i < formulaShards.length; i++) {
                    if (formulaShards[i].length > 1) {
                        remainFormula += "(" + formulaShards[i] + ")";
                    } else {
                        remainFormula += formulaShards[i];
                    }
                }
                return [remainFormula];
            } else {
                let subFormula = new Formule(formulaShards[1]);
                return [subFormula.fragment()[1]];
            }
        }
        else {
            console.log("Impossible d'appeler cette méthode sur cette formule");
        }
    }

    getMembers() {
        let lastConnectorArray = this.getLastConnector();
        let lastAloneConnectorPosition = lastConnectorArray[1];
        let formulaShards = this.fragment();
        let A = "";
        let B = "";
        if (lastConnectorArray[0] === "¬¬") {
            // let subFormula = new Formule(formulaShards[1]);
            // return [subFormula.fragment()[1]];
            return [this.expression];
        }
        if (formulaShards.length === 1) {
            return [formulaShards[0]];
        } else if (formulaShards.length === 2) {
            for (let i = 0; i < lastAloneConnectorPosition; i++) {
                let litteral = formulaShards[1][i];
                A += litteral;
            }
        } 
        else {
            for (let i = lastAloneConnectorPosition + 1; i < formulaShards.length; i++) {
                B += formulaShards[i];
            }
            for (let i = 0; i < lastAloneConnectorPosition; i++) {
                let formula = new Formule(formulaShards[i]);
                A += formulaShards[i];
            }
        }
        return [A, B];
    }

    children() {
        let lastConnectorArray = this.getLastConnector();
        let lastAloneConnector = lastConnectorArray[0];
        let members = this.getMembers();
        switch (lastAloneConnector) {
            case ("") :
                return [1, this.expression];
            case ("¬¬") :
                return [1, this.deleteUselessNegations()];
            case ("¬∨") :
                return [1, "¬" + members[0], "¬" + members[1]];
            case ("¬∧") :
                return [2, "¬" + members[0], "¬" + members[1]];
            case ("¬→") :
                return [1, members[0], "¬" + members[1]];
            case ("∨") :
                return [2, members[0], members[1]];
            case ("∧") :
                return [1, members[0], members[1]];
            case ("→") :
                return [1, "¬" + members[0], members[1]];
        }
    }

    formulasWithChildren() {
        let children = this.children();
        console.log(children);
        let arrayFormulas = [];
        for (let i = 1; i < children.length; i++) {
            console.log(children[i]);
            arrayFormulas.push(new Formule(children[i]));
            console.log(arrayFormulas);
        }
        return arrayFormulas;
    }

} 