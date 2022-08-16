const fs = require('fs');
const abiDecoder = require('abi-decoder');

module.exports = {
  formTxObject: function(eventContractAbi, eventIndex, transaction) {
    let txObject   = {};
    let tempArgs   = {};

    abiDecoder.addABI(eventContractAbi);

    let receipt = transaction.receipt;
    let log = receipt.logs[eventIndex];
    let rawLog = receipt.rawLogs[eventIndex];

    if (rawLog != undefined) {
      let _decoded   = abiDecoder.decodeLogs([rawLog]);
      let decodedLog = _decoded[0];
      for (var i = 0; i < decodedLog.events.length; i++) {
        let key = decodedLog.events[i].name;
        let val = decodedLog.events[i].value;
        tempArgs[`${key}`] = val;
      }
      txObject.logs  = [{"event":decodedLog.name}];
      txObject.logs[0].args = tempArgs;
    } else if (log != undefined) {
      txObject.logs  = [{"event":log.event}];
    };

    txObject.tx    = transaction.tx;
    return txObject;
  }
}
