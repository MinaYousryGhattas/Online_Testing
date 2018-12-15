export class Question {

    constructor(question, candidate_answer, right_answers, wrong_answers, marked) {
         this.question = question;
         this.candidate_answer = candidate_answer;
         this.right_answers = right_answers
         this.wrong_answers = wrong_answers
         this.marked = marked
    }

    get question() {
        return this.question;
    }
    set question(value) {
        this.question = value;
    }

    get candidate_answer() {
        return this.candidate_answer;
    }
    set candidate_answer(value) {
        this.candidate_answer = value;
    }

    get right_answers() {
        return this.right_answers;
    }
    set right_answers(value) {
        this.right_answers = value;
    }

    get wrong_answers() {
        return this.wrong_answers;
    }
    set wrong_answers(value) {
        this.wrong_answers = value;
    }

    get marked() {
        return this.marked;
    }
    set marked(value) {
        this.marked = value;
    }
}
//module.exports = Question;
