export function HashMap() {
    return {
        loadFactor: 0.75,
        capacity: 16,
        buckets: new Array(16).fill(null),
        hash(key) {

            let hashCode = 0;
            const primeNumber = 31;
            const capacity = this.capacity;
            for (let i = 0; i < key.length; i++) {
                hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % capacity;
            }
            // console.log(hashCode);
            return hashCode;
        },
        set(key, value) {
          let hashKey = this.hash(key);
          let buckets = this.buckets;

          // If index hasn't been populated create a Linked List
          if (!buckets[hashKey]) {
            let list = createLinkedList();
            buckets[hashKey] = list;
          } 

          // Check if key exists in the linked list
          let existingNode = buckets[hashKey].find(key);

          // if new key appen list, else overwrite key,value pair
          if (existingNode === null) {
            buckets[hashKey].append(key, value);
            // console.log(buckets[hashKey]);
          } else {
            // console.log(existingNode);
            existingNode.value = value;
            // console.log(existingNode);
          }

          //TODO - Check if the hashmap has reached load factor



        },
        get(key) {
          let hashKey = this.hash(key);
          let buckets = this.buckets;
        
          if (buckets[hashKey]) {
            let existingNode = buckets[hashKey].find(key);

            if (existingNode) {
              return existingNode.value
            }
          }

          return null;

          


        },
        has(key) {
          let hashKey = this.hash(key);
          let buckets = this.buckets;

          if (buckets[hashKey]) {
            if (buckets[hashKey].find(key)) {
              return true;
            }
          }
          return false;
        },
        remove(key) {
          let hashKey = this.hash(key);
          let buckets = this.buckets;

          if (buckets[hashKey]) {
            console.log(buckets[hashKey]);
            let index = buckets[hashKey].findIndex();
            buckets[hashKey].removeAt(index);
            console.log(buckets[hashKey]);
          }


        }
    }
}

function createLinkedList(){
    return{
      head: null,
      tail: null,
      
      // Adds a new node to the end of the list 
      append(key, value) {
        if (!this.head) { // If the list is empty, set head and tail to the new node
          let newNode = createNode(key, value);
          this.head = newNode;
          this.tail = newNode;
        } else { // Otherwise, add the new node at the end and update the tail
            let newNode = createNode(key, value);
            this.tail.nextNode = newNode;
            this.tail = newNode;
        }
      },
      // Adds a new node to the beginning of the list
      prepend(value) {
        let newNode = createNode(value);
        newNode.nextNode = this.head;
        this.head = newNode;
      },
      find(key) {
        let count = 0;
        let tempNode = this.head;
        
        while (tempNode) {
            if (tempNode.key === key) {
                return tempNode;
            }
            tempNode = tempNode.nextNode;
            count++;
        }
        return null;
      },
      // Inserts a new node at a specified index
      insertAt(key, value, index) {
        if (index > this.size()) {
            console.error('Index out of bounds');
            return;
        }
        if (index === 0) {
            this.prepend(key, value);
            return;
        }
        if (index === this.size()) {
            this.append(key, value);
            return;
        }
        
        let prev = this.at(index - 1);
        let newNode = createNode(key, value);
        newNode.nextNode = prev.nextNode;
        prev.nextNode = newNode;
      },
        // Returns the node at a given index (0-based index)
        at(index) {
          let count = 0;
          let tempNode = this.head;
          
          while (tempNode) {
              if (count === index) {
                  return tempNode;
              }
              tempNode = tempNode.nextNode;
              count++;
          }
          console.error("Index out of bounds");
          return null;
        },
      
      // Removes the node at a specified index
      removeAt(index) {
        if (index >= this.size() || index < 0) {
          console.error('Index out of bounds');
            return;
        }
        if (index === 0) {
            this.head = this.head.nextNode;
            return;
        }

        let prev = this.at(index - 1);
    

        if (prev.nextNode === null ) { // If the removed node was the tail, update tail
          this.tail = prev;
          return;
        }

        prev.nextNode = prev.nextNode.nextNode;
  
       

      },
        // Returns the total number of nodes in the list
        size() {
          let count = 0;
          let tempNode = this.head;
          
          while (tempNode) {
              count++;
              tempNode = tempNode.nextNode;
          }
          return count;
        },
      findIndex(key) {
        let count = 0;
        let tempNode = this.head;
        
        while (tempNode) {
            if (tempNode.key === key) {
                return count;
            }
            tempNode = tempNode.nextNode;
            count++;
        }
        return null;
      },
        // Converts the list to a string representation
        toString() {
        let output = '';
        let tempNode = this.head;
        
        while (tempNode) {
            output += `( ${tempNode.value} ) --> `;
            tempNode = tempNode.nextNode;
        }
        output += 'null';
        return output;
      },
    };
}
  
// Creates a new node with a given value and nextNode reference
function createNode(key, value, nextNode = null){
  return{
      key,
      value,
      nextNode,
  };
}

