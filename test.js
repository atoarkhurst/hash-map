import { HashMap } from "./hashmap.js";

const test = HashMap();
test.set('apple', 'red');
test.set('apple', 'blue');
test.set('banana', 'yellow')
test.set('carrot', 'orange')
test.set('dog', 'brown')
test.remove('apple');
