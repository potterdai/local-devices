/**
 * Parses each row in the ip neigh table into { name, ip, mac } on linux.
 *
 * ip neigh format: <ip> dev <interface> lladdr <mac> <state>
 * Example: 192.168.1.1 dev eth0 lladdr aa:bb:cc:dd:ee:ff REACHABLE
 */
module.exports = function parseLinux (row, servers, parseOne) {
  var result = {}

  // Ignore empty rows and incomplete entries.
  if (row === '' || row.indexOf('INCOMPLETE') >= 0 || row.indexOf('FAILED') >= 0) {
    return
  }

  var chunks = row.split(' ').filter(Boolean)
  
  // ip neigh format: IP dev INTERFACE lladdr MAC STATE
  // Find the IP (first element) and MAC (after 'lladdr')
  var ip = chunks[0]
  var macIndex = chunks.indexOf('lladdr')
  
  if (macIndex === -1 || macIndex + 1 >= chunks.length) {
    return
  }
  
  var mac = chunks[macIndex + 1]
  
  result = {
    name: '?', // hostname is not provided by ip neigh
    ip: ip,
    mac: mac
  }

  // Only resolve external ips.
  if (!~servers.indexOf(result.ip)) {
    return
  }

  return result
}
