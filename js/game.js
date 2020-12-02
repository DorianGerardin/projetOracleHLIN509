node = {
    HTMLid : "1child",
    innerHTML: "<span onclick='next(event)'>A∧¬B</span> <br> <span>C→D</span>",
}

node.children = 

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
        }
    },
    
    nodeStructure: {
        text: { name: "Parent node" },
        children: [
            node,
            {
                innerHTML: "<span onclick='next(event)'>A∧¬B∨C→D∧E</span>"
            }
        ]
    }
};

function next(e) {
    console.log(e.target.innerHTML);
    console.log(e.target.parentNode);
}

var my_chart = new Treant(simple_chart_config);