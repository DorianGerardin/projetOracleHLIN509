class Node {

    constructor(listeFormules, nodeParent) {
        this.listeFormules = listeFormules;
        this.nodeParent = nodeParent;
        this.children = null;
        this.isClosed = this.isClosed();

        this.addNodeHTML();     
    }

    addNodeHTML() {
        let divNode = document.getElementById("nodes");
        let thisNode = document.createElement("div");
        this.listeFormules.forEach(formule => { // a modifier plus tard (formule.getValue() ?)
            let formuleTag = document.createElement("span");
            formuleTag.innerHTML = formule;
            thisNode.appendChild(formuleTag);
        });
        divNode.appendChild(thisNode);
    }

    // Returns a boolean if the node get a contradiction
    isClosed() {
        let symbolesTab = new Array();
        this.listeFormules.forEach(formule => {
            if (formule.isSymboleLogique()) {
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

    isClosedByUser() {

    }

}