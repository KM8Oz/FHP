import { DataConnection, Peer } from "peerjs";
import { useEffect, useState } from "react"

export const usePeers = (id: "") => {
    const [peer, setPeer] = useState<Peer|null>()
    const [peerid, setPeerid] = useState<string>()
    const [connections, setConnections] = useState<Map<string, DataConnection>>(new Map<string, DataConnection>())
    useEffect(() => {
        var peer = null;
        while (!peer) {
            peer = new Peer({
                pingInterval:500,
                config: {
                    'iceServers': [
                        { url: 'stun:stun.l.google.com:19302' },
                        { url: 'stun:stun1.l.google.com:19302' },
                        { url: 'stun:stun2.l.google.com:19302' },
                        { url: 'stun:stun4.l.google.com:19302' },
                        { url: 'stun:stun3.l.google.com:19302' },
                        { url: 'turn:efMINBH8FAHZL7FTB9@relay1.expressturn.com:3478', credential: 'oqgmQuCyouXdrS1Y' }
                    ]
                } /* Sample servers, please use appropriate ones */
            });   
        }
        peer.on('open', function(id) {
            setPeerid(id)
          });
        peer.on("connection", (dataConnection: DataConnection)=>{
            let map =  connections;
            map.set(dataConnection.connectionId, dataConnection)
            setConnections(map)
        })
        setPeer(peer)
    }, [])
    return {
        peer,
        peerid,
        connections
    }
}