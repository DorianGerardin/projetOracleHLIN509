class Score {

    static tauxCoupSurLitteral = -75;
    static tauxFermerBrancheCorrectement = 75;
    static tauxFermerBrancheIncorrectement = -75;
    static tauxJouerCoup = -5;
    static tauxJouerQuandBrancheFermable = -25;

    constructor(strFormule) {
        this.nbBranchesFermeesCorrectement = 0;
        this.nbBranchesFermeesIncorrectement = 0;
        this.nbCoupsBranchesFermables = 0;
        this.nbCoupsJoues = 0;
        this.nbCoupsSurLitteral = 0;

        this.nbCoupsIdeal = 0;
        for (let i = 0; i < strFormule.length; i++) {
            if (strFormule[i] === '¬' || strFormule[i] === '→' || strFormule[i] === '∨' || strFormule[i] === '∧') {
                this.nbCoupsIdeal++;
            }
        }
        this.score = 0;
    }

    jouerCoupSurLitteral() {
        this.nbCoupsSurLitteral++;
        this.getScore();
    }

    getPtsCoupSurLitteral() {
        return this.nbCoupsSurLitteral*Score.tauxCoupSurLitteral;
    }



    fermerBrancheCorrectement() {
        this.nbBranchesFermeesCorrectement++;
        this.getScore();
    }

    getPtsFermerBrancheCorrectement() {
        return this.nbBranchesFermeesCorrectement*Score.tauxFermerBrancheCorrectement
    }



    fermerBrancheIncorrectement() {
        this.nbBranchesFermeesIncorrectement++;
        this.getScore();
    }

    getPtsFermerBrancheIncorrectement() {
        return this.nbBranchesFermeesIncorrectement*Score.tauxFermerBrancheIncorrectement
    }



    jouerCoup() {
        this.nbCoupsJoues++;
        this.getScore();
    }

    getPtsJouerCoup() {
        return Math.max(this.nbCoupsJoues-this.nbCoupsIdeal, 0)*Score.tauxJouerCoup;
    }



    jouerQuandBrancheFermable() {
        this.nbCoupsBranchesFermables++;
        this.getScore();
    }

    getPtsJouerQuandBrancheFermable() {
       return this.nbCoupsBranchesFermables*Score.tauxJouerQuandBrancheFermable;
    }

    getScore() {
        this.score = this.getPtsCoupSurLitteral()
        +
        this.getPtsFermerBrancheCorrectement()
        +
        this.getPtsFermerBrancheIncorrectement()
        +
        this.getPtsJouerCoup()
        +
        this.getPtsJouerQuandBrancheFermable()
    }

}