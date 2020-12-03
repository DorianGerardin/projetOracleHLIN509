var root = "";
var my_chart = null;
var simple_chart_config = null;
var score = 0;
let input = document.getElementById("formuleInput");
input.value = "¬(p→((p→q)→q))";

function fillInput(str) {
    let input = document.getElementById("formuleInput");
    let cursorPosition = input.selectionStart;
    input.value = input.value.substring(0, cursorPosition) + str + input.value.substring(cursorPosition);
    input.focus();
    input.setSelectionRange(cursorPosition + 1, cursorPosition + 1)
}

function enterFormula() {

    let input = document.getElementById("formuleInput");
    let form = document.getElementById("form");
    form.style.display = "none";
    root = input.value;

    let tips = document.getElementById("tips");
    tips.style.display = "flex";

    let signature = document.getElementById("signature");
    signature.style.position = "absolute";
    signature.style.bottom = "20px";
    signature.style.left = "20px";


    simple_chart_config = {
        chart: {
            container: "#tree-simple",
            connectors: {
                type : "straight"
            },
            scrollbar: "fancy",
            animation: {
                connectorsAnimation : "linear",
                nodeAnimation : "linear",
            },
            node : {
                collapsable: false,
                HTMLclass : "nodeFormule"
            }
        },
        
        nodeStructure: {
            innerHTML : "<span id='root' class='formulaSpan'>" + root + "</span>",
            HTMLid : "0",
            collapsable : false,
        }
    };

    document.body.innerHTML += "<div id='tree-simple' style='width:100%; height: 100%;'> </div>";
    my_chart = new Treant(simple_chart_config);
    next(document.getElementById("root"));
}


function getNodeStructure(id, formulas) {
    let spanString = ""
    for(formula of formulas) {
        spanString += "<span class='formuleSpan' onclick='next(this)'>" + formula + "</span>"
    }

    let jsonNODE = {
        HTMLid : id,
        innerHTML: spanString,
        collapsable:false
    }

    return jsonNODE;
}

function next(e) {
    e.parentNode.removeEventListener('contextmenu', handleContextMenu)
    //Récupérer l'id du parent

    let idParent = e.parentNode.id;

    //On commence par vérifier que l'utilisateur ne continue pas une branche qui devrait déjà être fermée
    let nodeParent = document.getElementById(idParent)
    let allFormulas = nodeParent.querySelectorAll("span")
    allFormulas.forEach(e => e.classList.remove("formuleSpan"))

    allFormulas = Array.from(allFormulas).map(e => e.innerHTML)
    if(new NodeLogic(allFormulas).isClosed()) {
        score -= 50;
    }
    //Désactive l'action
    e.onclick=""
    //Ajouter une croix pour dire qu'on a selectionne la formule
    e.classList.add("selected")

    //Liste contenant les formules à recopier
    let listFormulasBefore = []
    let listFormulasAfter = []

    //On désactive toutes les formules non sélectionnés et on les ajoutent à notre liste
    let notSelectedFormulasAfter = Array.from(nodeParent.querySelectorAll("span.selected~span"))
    let notSelectedFormulasBefore = Array.from((nodeParent.querySelectorAll("span:not(.selected)")))
    notSelectedFormulasBefore = notSelectedFormulasBefore.slice(0, notSelectedFormulasBefore.length-notSelectedFormulasAfter.length)

    for(let node of notSelectedFormulasBefore) {
        node.classList.add("notSelected")
        node.onclick = ""
        listFormulasBefore.push(node.innerText)
    }

    for(let node of notSelectedFormulasAfter) {
        node.classList.add("notSelected")
        node.onclick = ""
        listFormulasAfter.push(node.innerText)
    }

    //On cherche la node parente, pas très propre mais pas de meilleure solution ici
    let parentNode = my_chart.tree.nodeDB.db.find(obj => {
        return obj.nodeHTMLid === idParent;
    })

    //On ajoute dynamiquement à l'arbre les Nodes
    let nextNodes = (new Formule(e.innerText)).nextNode();
    if(nextNodes[0]===1) {
        let listFormulas = listFormulasBefore.concat(nextNodes[1].map(e => e.expression)).concat(listFormulasAfter)
        let childNode = getNodeStructure(idParent+"0", listFormulas)
        let newNode = my_chart.tree.addNode(parentNode, childNode);
        console.log(newNode.nodeDOM)
        contextMenu(newNode.nodeDOM);
    } else {
        let listFormulas1 = listFormulasBefore.concat([nextNodes[1][0].expression]).concat(listFormulasAfter)
        let childNode1 = getNodeStructure(idParent+"0", listFormulas1)

        let listFormulas2 = listFormulasBefore.concat([nextNodes[1][1].expression]).concat(listFormulasAfter)
        let childNode2 = getNodeStructure(idParent+"1", listFormulas2)
        let newNode = my_chart.tree.addNode(parentNode, childNode1)
        let newNode2 = my_chart.tree.addNode(parentNode, childNode2)
        contextMenu(newNode.nodeDOM);
        contextMenu(newNode2.nodeDOM);
    }
}

function confirmClose(node) {
    if (confirm("Voulez-vous fermer cette branche ?")) {
        let allFormulas = node.querySelectorAll("span")
        allFormulas = Array.from(allFormulas).map(e => e.innerHTML)
        if((newNode = new NodeLogic(allFormulas)).isClosed()) {
            node.querySelectorAll("span").forEach(formule => {
                formule.onclick = "";
                formule.classList.remove("formuleSpan");
                formule.classList.add("notSelected");
            });
            alert("La branche a été fermée")
            node.style.border = "2px solid green";
            node.style.borderRadius = "15px";
            node.removeEventListener('contextmenu', handleContextMenu)
        } else {
            alert("Cette branche ne peut pas etre fermée")
        }
    }
}


function contextMenu(node) {
    node.addEventListener('contextmenu', handleContextMenu);
}

function handleContextMenu(event) {
    console.log("handle", event);
    event.preventDefault();
    confirmClose(this);
}

