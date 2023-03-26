import { Peer } from "peerjs";
import { useAuth } from "pocketbase-react";
import { SVGProps, useEffect, useMemo } from "react"
import { useNavigate, useNavigation } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import styled from "styled-components";
import { usePeers } from "../hooks";
import { FONTS } from "../utils";
function MdiLightArrowLeftCircle(props: SVGProps<SVGSVGElement>) {
    return (
      <svg className="scaleeffect" xmlns="http://www.w3.org/2000/svg" width={props.width||"1em"} height={props.width||"1em"} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M17 13H8.75L12 16.25l-.66.75l-4.5-4.5l4.5-4.5l.66.75L8.75 12H17v1m-15-.5A9.5 9.5 0 0 1 11.5 3a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5m1 0a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4A8.5 8.5 0 0 0 3 12.5Z"></path></svg>
    )
}
export function ActivatePeer() {
    const { user } = useAuth()
    const { peer, connections, peerid } = usePeers(user?.username);
    console.log(peerid, connections);
    const navigation =  useNavigate()
    return peerid ? (
        <div>
            <div style={{
                display:"flex",
                flexDirection:"row",
                justifyContent:"space-between",
                alignItems:"center",
                padding:"10px 16px"
            }}>
                <MdiLightArrowLeftCircle onClick={()=>navigation("/")} width={30} />
                <p style={{
                    padding:0,
                    fontFamily:FONTS.MAIN,
                    fontSize:10,
                    textAlign:"center",
                    borderRadius:10
                }}>PeerId:</p>
                <code style={{
                    fontFamily:FONTS.MAIN,
                    fontSize:10,
                    textAlign:"center",
                    backgroundColor:"#dddd",
                    padding:"3px 10px",
                    borderRadius:10
                }}>{peerid}</code>
            </div>
        </div>
    ) : <ErrorWrapper><PuffLoader color="#929292" title="Error!" /></ErrorWrapper>
}
const ErrorWrapper = styled.div`
  width: 98vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;