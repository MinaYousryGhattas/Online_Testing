export class Candidate {

    constructor(username, password, email, telephone_number) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.telephone_number = telephone_number;
    }

    get username() {
        return this.username;
    }

    set username(value) {
        this.username = value;
    }

    get password() {
        return this.password;
    }

    set password(value) {
        this.password = value;
    }

    get email() {
        return this.email;
    }

    set email(value) {
        this.email = value;
    }

    get telephone_number() {
        return this.telephone_number;
    }

    set telephone_number(value) {
        this.telephone_number = value;
    }
}
module.exports = Candidate;
