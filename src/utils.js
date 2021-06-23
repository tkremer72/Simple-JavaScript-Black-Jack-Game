export function wait(iterator, milliseconds, callback) {
     const int = setInterval(() => {//create a new interval using milliseconds
          const { done } = iterator.next();//get the next iteration
          if(done) {//check if iterator is done
               clearInterval(int);//if iterator is done clear interval and invoke the callback
               callback();
          }
     }, milliseconds);//create a new interval using the milliseconds parameter
}