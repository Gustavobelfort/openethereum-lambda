'use strict';

const axios = require('axios')

exports.handler = async function (event, context, callback) {

    var netPeers = await GetParityNetPeers();
    var chainStatus = await GetParityChainStatus();
    var ethSyncing = await GetEthSyncing();

    var response = {
        "statusCode": 200,
        "headers": {
            'Content-Type': 'application/json',
        },
        "body": JSON.stringify({
            "netPeers": netPeers,
            "chainStatus": chainStatus,
            "ethSyncing": ethSyncing
        }),
        "isBase64Encoded": false
    };
    callback(null, response);
};

async function GetParityNetPeers() {
    var response = await axios.post(`http://${process.env.RPC_ENDPOINT}`, {
        "method": "parity_netPeers",
        "params": [],
        "id": 1,
        "jsonrpc": "2.0"
    });

    var output = {
        "active": response.data.result.active,
        "connected": response.data.result.connected,
        "max": response.data.result.max
    };
    return output;
}

async function GetParityChainStatus() {
    var response = await axios.post(`http://${process.env.RPC_ENDPOINT}`, {
        "method": "parity_chainStatus",
        "params": [],
        "id": 1,
        "jsonrpc": "2.0"
    });

    var output = {
        "blockGap": response.data.result.blockGap
    };
    return output;
}

async function GetEthSyncing() {
    var output

    var response = await axios.post(`http://${process.env.RPC_ENDPOINT}`, {
        "method": "eth_syncing",
        "params": [],
        "id": 1,
        "jsonrpc": "2.0"
    });

    if (response.data.result == "false") {
        output = "Successfully synced with the ethereum network";
    } else {
        output = {
            "startingBlock": response.data.result.startingBlock,
            "currentBlock": response.data.result.currentBlock,
            "highestBlock": response.data.result.highestBlock
        };
    }
    return output;
}
