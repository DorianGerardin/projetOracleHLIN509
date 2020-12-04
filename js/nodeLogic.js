class NodeLogic {

    constructor(listeFormules) {
        //List of formulas
        this.listeFormules = []
        for(let formula of listeFormules) {
            this.listeFormules.push(new Formule(formula))
        }
        this.isClosedByUser = false;
    }

    // Returns a boolean if the node get a contradiction
    isClosed() {
        let symbolesTab = [];
        this.listeFormules.forEach(formule => {
            if (formule.isSymboleLogique) {
                symbolesTab.push(formule);
            }
        });

        for (let i = 0; i < symbolesTab.length; i++) {
            for (let j = i + 1; j < symbolesTab.length; j++) {
                if (symbolesTab[i].isNegationOf(symbolesTab[j])) {
                    return true;
                }
            }
        }
        return false;
    }

}