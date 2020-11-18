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
        let isClosed = false; 
        for (let i = 0; i < this.listeFormules.length; i++) {
            for (let j = i + 1; j < this.listeFormules.length; j++) {
                if (this.listeFormules[i].isNegation(this.listeFormules[j])) {
                    isClosed = true;
                    break;
                }
            }
        }
        return isClosed;
    }

    isClosedByUser() {

    }

}