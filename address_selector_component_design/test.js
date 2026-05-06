class Foo {
  prop = this.srv
  constructor(public srv) {}
}
console.log(new Foo("test").prop)
