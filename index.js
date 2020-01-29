const net = require('net');
const getIPRange = require('get-ip-range');
const yargs = require('yargs');
const isIp = require('is-ip');

let addresses = []
let available = [];
let promises = [];

const argv = yargs
    .option('port', {
            description: 'The port to try to connect on the hosts',
            alias: 'p',
            type: 'number'
    })
    .option('target', {
        description: 'The targets to try to connect, space separated.',
        alias: 't',
        type: 'array'
    })
    .demandOption('port')
    .help()
    .argv;

if (argv._[0] == null ){
    console.error(`You need to give networks to test.\nExitting...`)
    process.exit(1)
}

for (network of argv._){
    try {
        addresses = Array.prototype.concat(addresses, getIPRange(network))
    } catch {
        try{
            if (isIp(network)){
                addresses.push(network)
            } else {
                console.error(`The argument ${network} given is not a valid network address. Should be X.X.X.X or X.X.X.X/XX`)
                process.exit(1)
            }
        } catch {
            console.error(`The argument ${network} given is not a valid network address.  Should be X.X.X.X or X.X.X.X/XX`)
        }
    }
}

const checkPortStatus = async (port, host) => {
    promises.push(new Promise((resolve, reject) => {
        let socket = net.Socket();
        socket.setTimeout(3000);
        try {
            socket.connect(port, host)
        } catch (err) {
            console.error(`entered catch with ${err}`)
            socket.destroy();
            //reject(err);
        }
        socket.on('connect', () => {
            available.push(socket.remoteAddress)
            socket.destroy();
            resolve(socket.remoteAddress)
        })
        socket.on('error', (err) => {
            socket.destroy();
            if(err.code === 'ECONNREFUSED'){
                resolve()
            } else {
                reject(err)
            }
        })
        socket.on('timeout', () => {
            socket.destroy();
            resolve()
        })
    }))
}

const app = async () => {
    for (address of addresses) {
        promises.push(new Promise((resolve, reject) => {
            try {
                resolve(checkPortStatus('2266', address))
            } catch (err) {
                //reject(err)
            }
            let error = reject();
        }))
    }
    try {
        result = await Promise.all(promises)
    } catch (err) {
        console.error(err)
    }
    console.log(available)
}

app();