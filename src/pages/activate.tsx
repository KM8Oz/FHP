import { Peer } from "peerjs";
import { useAuth } from "pocketbase-react";
import { SVGProps, useEffect, useMemo, useState } from "react"
import { toast } from "react-hot-toast";
import { useNavigate, useNavigation } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import styled from "styled-components";
import { TextInput } from "../components";
import { usePeers } from "../hooks";
import { FONTS } from "../utils";

function MdiLightHexagon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width || "1em"} height={props.width || "1em"} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="m6.59 21l-4.9-8.5L6.6 4h9.81l4.91 8.5l-4.91 8.5H6.59m9.24-16H7.18l-4.34 7.5L7.17 20h8.66l4.33-7.5L15.83 5Z"></path></svg>
    )
}
function MdiLightArrowLeftCircle(props: SVGProps<SVGSVGElement>) {
    return (
        <svg className="scaleeffect" xmlns="http://www.w3.org/2000/svg" width={props.width || "1em"} height={props.width || "1em"} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M17 13H8.75L12 16.25l-.66.75l-4.5-4.5l4.5-4.5l.66.75L8.75 12H17v1m-15-.5A9.5 9.5 0 0 1 11.5 3a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5m1 0a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4A8.5 8.5 0 0 0 3 12.5Z"></path></svg>
    )
}
export function ActivatePeer() {
    const { user } = useAuth()
    const [freelanceid, setFreelanceid] = useState({
        value: "",
        isvalid: true
    });
    const { peer, connections, peerid } = usePeers(user?.username);
    console.log(peerid, connections);
    const navigation = useNavigate()
    return peerid ? (
        <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 16px"
            }}>
                <MdiLightArrowLeftCircle onClick={() => navigation("/")} width={30} />
                <p style={{
                    padding: 0,
                    fontFamily: FONTS.MAIN,
                    fontSize: 10,
                    textAlign: "center",
                    borderRadius: 10
                }}>PeerId:</p>
                <code style={{
                    fontFamily: FONTS.MAIN,
                    fontSize: 10,
                    textAlign: "center",
                    backgroundColor: "#dddd",
                    padding: "3px 10px",
                    borderRadius: 10
                }}>{peerid}</code>
            </div>
            <div style={{
                padding: "20px 30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <TextInput value={freelanceid.value} label="Freelance Id.." onChange={(ev) => {
                    ev.preventDefault()
                    setFreelanceid((s) => ({
                        ...s,
                        value: ev.target?.value
                    }))
                }} iserror={false} />
                <button
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20
                    }}
                    onClick={() => {
                        try {
                            let connection = peer?.connect(freelanceid.value, {
                                label: user?.username
                            })
                            if (connection?.reliable) {
                                toast.dismiss()
                                toast.success(`Connection succeeded! <user: ${connection.label}>`,
                                    {
                                        duration: 1000,
                                        position: "bottom-center",
                                        style: {
                                            borderRadius: '10px',
                                            background: '#333',
                                            color: '#fff',
                                            padding: '4px 5px',
                                            fontSize: '10px',
                                        },
                                    }
                                );
                            } else {
                                toast.dismiss()
                                toast.error(`Connection faild! <metadata: ${connection?.metadata}>`,
                                    {
                                        duration: 1000,
                                        position: "bottom-center",
                                        style: {
                                            borderRadius: '10px',
                                            background: '#333',
                                            color: '#fff',
                                            padding: '4px 5px',
                                            fontSize: '10px',
                                        },
                                    }
                                );
                            }
                        } catch (error:any) {
                            toast.dismiss()
                            toast.error(`Connection faild! <error: ${error?.message}>`,
                                {
                                    duration: 1000,
                                    position: "bottom-center",
                                    style: {
                                        borderRadius: '10px',
                                        background: '#333',
                                        color: '#fff',
                                        padding: '4px 5px',
                                        fontSize: '10px',
                                    },
                                }
                            );
                        }


                    }}>
                    Connect <MdiLightHexagon width={23} />
                </button>
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