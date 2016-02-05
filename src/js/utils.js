const UAParser = require('./ua-parser.min.js');
const userAgentParser = new UAParser();

module.exports = {

  getDeviceInfo: function() {
    let deviceInfo = [];

    deviceInfo.push(userAgentParser.getDevice().model);
    deviceInfo.push(userAgentParser.getDevice().vendor);
    deviceInfo.push(userAgentParser.getDevice().type);
    deviceInfo.push(userAgentParser.getBrowser().name);
    deviceInfo.push(userAgentParser.getOS().name);
    
    // Remove the empty values
    deviceInfo = deviceInfo.filter(function(n){ return n != undefined });
  
    return deviceInfo;
  }
}