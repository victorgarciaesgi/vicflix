const bindToConsole = (
  consoleMethod: (...args: any[]) => void,
  polyfill: (...args: any[]) => void
) => {
  return consoleMethod ? consoleMethod.bind(console) : polyfill;
};

const logging = (() => {
  let prefix = '';

  const consoleLog = (...args: any) => {
    console.log(prefix, ...args);
  };

  const consoleError = (...args: any) => {
    console.error(prefix, ...args);
  };

  const consoleGroup = (...args: any) => {
    consoleLog(...args);
    prefix += '> ';
  };

  const consoleGroupEnd = () => {
    prefix = prefix.slice(0, -2);
  };

  return {
    log: consoleLog,
    error: consoleError,
    group: bindToConsole(console.group, consoleGroup),
    groupCollapsed: bindToConsole(console.groupCollapsed, consoleGroup),
    groupEnd: bindToConsole(console.groupEnd, consoleGroupEnd),
  };
})();

export default logging;
