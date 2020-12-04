class Score {

    constructor(strFormule) {
        this.nbBrancheFermeeCorrectement = 0;
        this.nbBranchesFermeesIncorrectement = 0;
        this.nbCoupsBranchesFermables = 0;
        this.nbCoupsJoues = 0;

        this.nbCoupsIdeal = 0;
        for (let i = 0; i < strFormule.length; i++) {
            if (strFormule[i] === '¬' || strFormule[i] === '→' || strFormule[i] === '∨' || strFormule[i] === '∧') {
                this.nbCoupsIdeal++;
            }
        }
        this.score = 0;
    }

    fermerBrancheCorrectement() {
        this.nbBrancheFermeeCorrectement++;
        this.getScore();
    }

    fermerBrancheIncorrectement() {
        this.nbBranchesFermeesIncorrectement++;
        this.getScore();
    }

    jouerCoup() {
        this.nbCoupsJoues++;
        this.getScore();
    }

    jouerQuandBrancheFermable() {
        this.nbCoupsBranchesFermables++;
        this.getScore();
    }

    getScore() {
        this.score = ((this.nbBrancheFermeeCorrectement*150)
        +
        (this.nbBranchesFermeesIncorrectement*-75)
        +
        (this.nbCoupsBranchesFermables*-25)
        +
        (Math.max(this.nbCoupsJoues-this.nbCoupsIdeal, 0)*-5))
        // *
        // (this.nbCoupsIdeal-tempsEnMinute)
    }

}