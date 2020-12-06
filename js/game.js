var root = "";
var my_chart = null;
var simple_chart_config = null;

let inputFirstTime = document.getElementById("formuleInput");
inputFirstTime.value = "(a∧a)∨(b∧¬b)∨(b→a)";

var scoreObj = null;
var scoreDisplay = document.getElementById("score");
var score = 0;
scoreDisplay.childNodes[1].innerHTML = "Score : " + score;

var nbNodesClosed = 0;
var nbNodesClosedByUser = 0;

var existeNoeudDeveloppable = false;
var nbExisteNoeudDeveloppable = 0;

var timer = 0;
var running = false;
var intervalTime = null

function startTimer() {
    running = true;
    intervalTime = setInterval(myTimer, 100);
}

function myTimer() {
    if (running) {
        timer++;
        let mins = Math.floor(timer/10/60);
        let secs = Math.floor(timer/10%60);
        if(mins < 10) {
            mins = "0" + mins
        }
        if(secs < 10) {
            secs = "0" + secs
        }
        document.getElementById("timer").innerHTML = mins + " : " + secs;
    }
}

function stopTimer() {
    running = false;
    clearInterval(intervalTime);
}

function resetTimer() {
    timer = 0;
    clearInterval(intervalTime);
    document.getElementById("timer").innerHTML = "00 : 00";
}

function incrementTimer() {
    intervalTime = setInterval(() => {
        if (running) {
            
        }
    }, 100)
}

function gameOver() {

    stopTimer();

    let modal = document.getElementById("myModal");
    let modalBody = document.getElementById("modal-body");
    let span = document.getElementsByClassName("close")[0];

    let formuleSpans = document.querySelectorAll("span.formuleSpan");

    formuleSpans.forEach(e => {
        e.onclick = "";
        e.classList.replace("formuleSpan", "notSelected");
    })

    if (modalBody.children.length > 0) {
        modalBody.querySelectorAll('*').forEach(n => n.remove());
    }

    let h2 = document.createElement("h2");
    h2.innerHTML = "Score : " + scoreObj.score;
    h2.style.paddingBottom = "10px";

    let h2Bis = document.createElement("h2");
    let tempsMis = document.getElementById("timer").innerHTML.split(":");
    let tempsMins = tempsMis[0] > 1 ? tempsMis[0] + " minutes et " : tempsMis[0] === 1 ? " minute et " : "";
    let tempsSecs = tempsMis[1] > 1 ? tempsMis[1] + " secondes " : tempsMis[1] + " seconde ";
    h2Bis.innerHTML = "Temps mis : " + tempsMins + tempsSecs;
    h2Bis.style.paddingBottom = "10px";

    let p1 = document.createElement("p");
    p1.innerHTML = " - Nombres de coups joués : <b>" + scoreObj.nbCoupsJoues + "</b>";

    let p2 = document.createElement("p");
    p2.innerHTML = " - Nombres de coups joués sur des branches pouvant être fermées : <b>" + scoreObj.nbCoupsBranchesFermables + "</b>";

    let p3 = document.createElement("p");
    p3.innerHTML = " - Nombres de tentatives de fermeture de noeuds sans contradiction : <b>" + scoreObj.nbBranchesFermeesIncorrectement + "</b>";
   
    let p4 = document.createElement("p");
    p4.innerHTML = " - Nombres de branches fermées correctement : <b>" + scoreObj.nbBrancheFermeeCorrectement + "</b>";
    modalBody.appendChild(h2);
    modalBody.appendChild(h2Bis);
    modalBody.appendChild(p1);
    modalBody.appendChild(p2);
    modalBody.appendChild(p3);
    modalBody.appendChild(p4);

    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
    }
}

function updateScore() {
    scoreDisplay = document.getElementById("score");
    score = scoreObj.score;
    scoreDisplay.childNodes[1].innerHTML = "Score : " + score;
}

function fillInput(str) {
    let input = document.getElementById("formuleInput");
    let cursorPosition = input.selectionStart;
    input.value = input.value.substring(0, cursorPosition) + str + input.value.substring(cursorPosition);
    input.focus();
    input.setSelectionRange(cursorPosition + 1, cursorPosition + 1)
}

function reset() {

    resetTimer();
    startTimer();

    nbExisteNoeudDeveloppable = 1;

    nbNodesClosedByUser = 0;
    nbNodesClosed = 0;

    let tree = document.getElementById("tree-simple");
    document.body.removeChild(tree);

    scoreObj = new Score(root);
    score = scoreObj.score;
    scoreDisplay = document.getElementById("score");
    scoreDisplay.childNodes[1].innerHTML = "Score : " + score;

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

    document.body.innerHTML += "<div id='tree-simple' style='width:100%; height: 60%;'> </div>";
    my_chart = new Treant(simple_chart_config);
    next(document.getElementById("root"));

}

function changeFormula() {

    document.getElementById("timerParent").style.display = "none";

    resetTimer();

    nbExisteNoeudDeveloppable = 1;

    var modal = document.getElementById("myModal");
    modal.style.display = "none";

    nbNodesClosedByUser = 0;
    nbNodesClosed = 0;

    let tree = document.getElementById("tree-simple");
    document.body.removeChild(tree);

    let form = document.getElementById("form");
    form.style.display = "flex";

    let tips = document.getElementById("tips");
    tips.style.display = "none";

    let signature = document.getElementById("signature");
    signature.style.position = "relative";

    let gameButtons = document.getElementById("gameButtons");
    gameButtons.style.display = "none";

    scoreDisplay = document.getElementById("score");
    scoreDisplay.style.display = "none";
    
}

function enterFormula() {

    document.getElementById("timerParent").style.display = "flex";

    startTimer();

    let input = document.getElementById("formuleInput");
    console.log(input.value);
    let form = document.getElementById("form");
    form.style.display = "none";
    root = input.value;

    if (new Formule(root).isSymboleLogique) {
        nbExisteNoeudDeveloppable = 0;
    } else nbExisteNoeudDeveloppable = 1;

    scoreObj = new Score(root);
    scoreDisplay.style.display = "flex";
    updateScore()

    let tips = document.getElementById("tips");
    tips.style.display = "flex";

    let signature = document.getElementById("signature");
    signature.style.position = "absolute";
    signature.style.bottom = "20px";
    signature.style.left = "20px";

    let gameButtons = document.getElementById("gameButtons");
    gameButtons.style.display = "flex";
    gameButtons.style.flexDirection = "column";

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

    document.body.innerHTML += "<div id='tree-simple' style='width:100%; height: 60%;'> </div>";
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

    scoreObj.jouerCoup();

    e.parentNode.removeEventListener('contextmenu', handleContextMenu)
    //Récupérer l'id du parent

    let idParent = e.parentNode.id;

    //On commence par vérifier que l'utilisateur ne continue pas une branche qui devrait déjà être fermée
    let nodeParent = document.getElementById(idParent)
    let allFormulas = nodeParent.querySelectorAll("span")
    allFormulas.forEach(e => e.classList.remove("formuleSpan"))

    allFormulas = Array.from(allFormulas).map(e => e.innerHTML)

    if(new NodeLogic(allFormulas).isClosed()) {
        scoreObj.jouerQuandBrancheFermable();
        nbNodesClosed--;
        updateScore();
    }
    if (new Formule(e.innerHTML).isSymboleLogique) {
        scoreObj.jouerCoupSurLitteral();
        updateScore();
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
        if(new NodeLogic(listFormulas).isClosed()) {
            nbNodesClosed++;
        }
        if(!new NodeLogic(listFormulas).hasOnlyLiterrals()) {
            nbExisteNoeudDeveloppable++;
        }
        console.log(existeNoeudDeveloppable)
        let childNode = getNodeStructure(idParent+"0", listFormulas)
        let newNode = my_chart.tree.addNode(parentNode, childNode);
        contextMenu(newNode.nodeDOM);
    } else {
        let listFormulas1 = listFormulasBefore.concat([nextNodes[1][0].expression]).concat(listFormulasAfter)
        let childNode1 = getNodeStructure(idParent+"0", listFormulas1)
        if(new NodeLogic(listFormulas1).isClosed()) {
            nbNodesClosed++;
        }
        if(!new NodeLogic(listFormulas1).hasOnlyLiterrals()) {
            nbExisteNoeudDeveloppable++;
        }
        console.log(existeNoeudDeveloppable)
        let listFormulas2 = listFormulasBefore.concat([nextNodes[1][1].expression]).concat(listFormulasAfter)
        if(new NodeLogic(listFormulas2).isClosed()) {
            nbNodesClosed++;
        }
        if(!new NodeLogic(listFormulas2).hasOnlyLiterrals()) {
            nbExisteNoeudDeveloppable++;
        }
        console.log(existeNoeudDeveloppable)
        let childNode2 = getNodeStructure(idParent+"1", listFormulas2)
        let newNode = my_chart.tree.addNode(parentNode, childNode1)
        let newNode2 = my_chart.tree.addNode(parentNode, childNode2)
        contextMenu(newNode.nodeDOM);
        contextMenu(newNode2.nodeDOM);
    }

    if(!new NodeLogic(allFormulas).hasOnlyLiterrals()) {
        nbExisteNoeudDeveloppable--;
    }

    console.log(nbExisteNoeudDeveloppable)

    if (nbNodesClosed === nbNodesClosedByUser && nbExisteNoeudDeveloppable === 0) {
        gameOver();
    }

    console.log("nbNodesClosed", nbNodesClosed)
    console.log("nbNodesClosedByUser", nbNodesClosedByUser);
    console.log("nbExisteNoeudDeveloppable", nbExisteNoeudDeveloppable)

}

function confirmClose(node) {
    if (confirm("Voulez-vous fermer cette branche ?")) {
        let allFormulas = node.querySelectorAll("span")
        allFormulas = Array.from(allFormulas).map(e => e.innerHTML)
        if((newNode = new NodeLogic(allFormulas)).isClosed()) {
            node.querySelectorAll("span").forEach(formule => {
                formule.onclick = "";
                formule.classList.replace("formuleSpan", "notSelected");
            });
            if(!new NodeLogic(allFormulas).hasOnlyLiterrals()) {
                nbExisteNoeudDeveloppable--;
            }
            nbNodesClosedByUser++;
            alert("La branche a été fermée")
            scoreObj.fermerBrancheCorrectement()
            updateScore();
            node.style.border = "2px solid green";
            node.style.borderRadius = "15px";
            node.removeEventListener('contextmenu', handleContextMenu)
            if (nbNodesClosed === nbNodesClosedByUser && nbExisteNoeudDeveloppable === 0) {
                console.log("game over");
                gameOver();
            }
        } else {
            alert("Cette branche ne peut pas etre fermée")
            scoreObj.fermerBrancheIncorrectement();
            updateScore();
        }
    }
    console.log("nbNodesClosed", nbNodesClosed)
    console.log("nbNodesClosedByUser", nbNodesClosedByUser);
}


function contextMenu(node) {
    node.addEventListener('contextmenu', handleContextMenu);
}

function handleContextMenu(event) {
    console.log("handle", event);
    event.preventDefault();
    confirmClose(this);
}

