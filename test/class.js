class A{
    constructor(){
        this.a = 'ace';
    }

    set name(name){
        this.a = name;
    }

    get name(){
        return this.a;
    }
}

let a = new A();
console.log(a);
console.log(a.a);