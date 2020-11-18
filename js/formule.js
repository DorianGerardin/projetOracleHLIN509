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


    }

    //Returns a boolean stating whether the inputted string is an FBF
    static isFBF(strFormule) {
        for (let i = 0; i < strFormule.length; i++) {
            if (!this.regexLegalCharacters.test(strFormule.charAt(i))) {
                /* TODO : FUNCTION TO HIGHLIGHT DETECTED CHARACTER */
                Formule.scannerFail(i);
            }
        }

        //If only one symbol, we check if it's a logical symbol
        if(strFormule.length===1) {
            return this.regexSymboleLogiqe.test(strFormule)
        } else {
            return true;

        }

    }

    static scannerFail(i) {
        console.log("Detected error at : " + i)
    }



    convertFromString(){

    }

    isSymboleLogique() {

    }

    simplificationFormule() {

    }

    // returns a boolean if this is the negation of the parameter
    isNegationOf(symbole) {

    }

} 