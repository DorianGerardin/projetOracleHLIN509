class Node {

    constructor(listeFormules, nodeParent) {
        this.listeFormules = listeFormules;
        this.nodeParent = nodeParent;
        this.children = null;

        let divNode = document.getElementById("nodes");
        let thisNode = document.createElement("div");
        this.listeFormules.forEach(formules => {
            
        });
    }

    isClosed() {

    }

    isClosedByUser() {

    }

}