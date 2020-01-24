/**
 * Will parse the arguments coming from the command line and return an object with them
 * 
 * @param  {Array} Arguments The Array process.argv from the node process
 * 
 * @returns {Object} Returns an Object with one key for each parameter
 */

function parseArgs(Arguments: string[]): any{
  const args = {};
  for(const ind in Arguments){
    // Ignore node and Path to app (which are on indices 0 and 1)
    if(parseInt(ind) > 1){
      const arg = Arguments[ind];
      const splitArg = arg.split('=');
      if(arg.indexOf('=') !== -1){
        args[splitArg[0]] = splitArg[1];
      } else {
        args[splitArg[0]] = true;
      }
    }        
  }

  return args;
}

const args = parseArgs(process.argv);

export { args };