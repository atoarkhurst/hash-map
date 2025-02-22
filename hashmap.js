export function HashMap() {
    return {
        loadFactor: 0.75,
        capacity: 16,
        buckets: new Array(16).fill(null),
        rehash() {
          let entries = this.entries();
          // console.log(`entries: ${entries}`);
          this.clear();
          entries.forEach((entry) => {
            //  console.log(`entry: ${entry}`);
            this.set(entry[0], entry[1]);
          });
          
        },
        hash(key) {

            let hashCode = 0;
            const primeNumber = 31;
            const capacity = this.capacity;
            for (let i = 0; i < key.length; i++) {
                hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % capacity;
            }
            return hashCode;
        },
        set(key, value) {
          let hashKey = this.hash(key);
          let buckets = this.buckets;

          if (hashKey < 0 || hashKey >= buckets.length) {
            throw new Error("Trying to access index out of bounds");
          }

          // Check if the hashmap has reached load factor
          let load = (this.length() + 1) / this.capacity;

          if ( load > this.loadFactor) {
            this.rehash();
            this.capacity = this.capacity * 2;
          }

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
          } else {
            existingNode.value = value;
          }
        },
        get(key) {
          let hashKey = this.hash(key);
          let buckets = this.buckets;

          if (hashKey < 0 || hashKey >= buckets.length) {
            throw new Error("Trying to access index out of bounds");
          }
        
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

          if (hashKey < 0 || hashKey >= buckets.length) {
            throw new Error("Trying to access index out of bounds");
          }

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

          if (hashKey < 0 || hashKey >= buckets.length) {
            throw new Error("Trying to access index out of bounds");
          }

          if (buckets[hashKey]) {
            let index = buckets[hashKey].findIndex(key);
            buckets[hashKey].removeAt(index);
          }
        },

        length(){
          let buckets = this.buckets;
          let count = 0;
          let keyCount;

          for ( let i = 0; i < buckets.length; i++ ) {
            if (buckets[i]) {
              keyCount = buckets[i].size();
              count += keyCount;
            }
          }

          return count;
        },

        clear(){
          this.buckets = new Array(this.capacity).fill(null);

        }, 

        keys(){
          let buckets = this.buckets;
          let keys;
          let keyArr = [];

          for ( let i = 0; i < buckets.length; i++ ) {
            if ( buckets[i] ) {
              keys = buckets[i].getKeys();
              keyArr.push(...keys);
            }
          }
          return keyArr;
        },

        values(){
          let buckets = this.buckets;
          let values;
          let valuesArr = [];

          for ( let i = 0; i < buckets.length; i++ ) {
            if ( buckets[i] ) {
              values = buckets[i].getValues();
              valuesArr.push(...values);
            }
          }
          return valuesArr;
        },

        entries(){
          let buckets = this.buckets;
          let entries;
          let entriesArr = [];

          for ( let i = 0; i < buckets.length; i++ ) {
            if ( buckets[i] ) {
              entries = buckets[i].getEntries();
              entriesArr.push(...entries);
            }
          }
          return entriesArr;

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
          //If there's only one value in list empty head and tail node
          if (this.head.nextNode) {
            this.head = this.head.nextNode;
          } else {
            this.head = null;
            this.tail = null;
          }
            
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
        // Returns array of keys
        getKeys() {
        let keys = [];
        let tempNode = this.head;
        
        while (tempNode) {
            keys.push(tempNode.key);
            tempNode = tempNode.nextNode;
        }
        return keys;
      },
       // Returns array of values
       getValues() {
        let values = [];
        let tempNode = this.head;
        
        while (tempNode) {
            values.push(tempNode.value);
            tempNode = tempNode.nextNode;
        }
        return values;
      },
      // Return key,value pair
      getEntries() {
        let pairs = [];
        let tempNode = this.head;
        let pair;

        while (tempNode) {
          pair = [tempNode.key, tempNode.value];
          pairs.push(pair);
          tempNode = tempNode.nextNode;
        }
        return pairs;

      }
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

