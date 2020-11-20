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

    isSymboleLogique() {

    }

    simplificationFormule(stringFormula) {

    }

    // returns a boolean if this is the negation of the parameter
    isNegationOf(symbole) {

    }

    //Fragment this.expression into an array which contains strings. Each charcater of the expression is an element of the array.
    //However, members in parenthesis in this.expression are only one element of the array
    fragment() {
        let formulaShards = new Array();
        let formula = this.expression;
        let stack = new Array();
        let shard = "";
        let topStack = "";
        let precedentChar = "";
        for (let i = 0; i < formula.length; i++) {
            if (formula.charAt(i) == "(") {
                stack.push(formula.charAt(i));
                formulaShards.push(formula.charAt(i));
            } else {
                if (stack.length != 0) {
                    topStack = stack[stack.length - 1];
                    if (formula.charAt(i) == ")" && topStack == "(") {
                        stack.pop();
                        if (shard != "") {
                            formulaShards.push(shard);
                        }
                        formulaShards.push(formula.charAt(i));
                        shard = "";
                    } else {
                        if (precedentChar == "(" || (shard.length != 0)) {
                            shard += formula.charAt(i);
                        }
                        else {
                            formulaShards.push(formula.charAt(i));
                        }
                    }
                } else {
                    formulaShards.push(formula.charAt(i));
                }
            }
            precedentChar = formula.charAt(i);
        }
        return formulaShards;
    }

    isImplication() {
        let formulaShards = this.fragment();
        let lastAloneConnector = "";
        formulaShards.forEach(shard => {
            if (shard == "→" || shard == "∧" || shard == "∨") {
                lastAloneConnector = shard;
            }
        });
        return lastAloneConnector == "→" ? true : false;
    }


    implicationIntoOR() {
        
    }

    deMorgan(leftMember, operator, rightMember) {

    }

} 