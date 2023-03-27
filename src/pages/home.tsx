import { invoke } from "@tauri-apps/api";
import { y } from "@tauri-apps/api/path-e12e0e34";
import { useAuth } from "pocketbase-react"
import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useNavigation } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import styled from "styled-components";
import { COLORS, FONTS } from "../utils"


export function Home() {
  const { isSignedIn, user, actions } = useAuth();
  const [stats, setStats] = useState([] as any[]);
  const [position, setPosition] = useState<number>(0);
  const navigation = useNavigate()
  const scr = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setPosition(s => scr.current?.offsetHeight ? scr.current?.offsetHeight : 0)
    setTimeout(async () => {
      let val = await invoke<any[]>("user_processes");
      setStats(val);
      scr.current?.scrollTo({
        left: 0,
        top: position
      })
    }, 5000)
  }, [stats])
  const RoundedBorderList = ({ items }: { items: { name: string, uptime: number }[] }) => {
    return (
      <ListWrapper >
        {items.map(item => (
          <ItemContainer className="scaleeffect" key={item.name}>
            <ItemName>{item.name}</ItemName>
            <ItemTime>{new Date(item.uptime).toLocaleString('en', {
              timeStyle: "short",
              dateStyle: "short"
            })}</ItemTime>
          </ItemContainer>
        ))}
      </ListWrapper>
    );
  };
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100vh",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 9,
      overflow: "hidden"
    }}>
      {
        isSignedIn && (
          <p style={{
            fontFamily: FONTS.MAIN,
            color: COLORS.secondary,
            fontSize: 17
          }}>
            Hello: {user?.username}
          </p>
        )
      }
      {stats.length > 0 ? 
      <ErrorWrapper><PuffLoader color="#929292" title="Error!" /></ErrorWrapper> : 
      <RoundedBorderList items={stats} />}
      <ButtonsFooter >
        <button
          onClick={() => actions.signOut()}
          style={{
            fontFamily: FONTS.MAIN,
            color: COLORS.error,
            fontSize: 17,
            borderColor: COLORS.main
          }}>
          Logout
        </button>
        <button
          onClick={() => navigation("/activate", {
            state: {
              peername: user?.username
            }
          })}
          style={{
            fontFamily: FONTS.MAIN,
            color: COLORS.black,
            fontSize: 17,
            borderColor: COLORS.main
          }}>
          Activate
        </button>
      </ButtonsFooter>
    </div>
  )
}
const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
  user-select: none;
`;

const ItemName = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #333;
  flex: 1;
  user-select: none;
`;

const ItemTime = styled.div`
  font-size: 10px;
  text-align: end;
  font-weight: 400;
  color: #666;
  user-select: none;
  flex: 1;
`;
const ListWrapper = styled.div`
  height: 70vh;
  padding-left: 10px;
  padding-right: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
`;
const ButtonsFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  flex: 1;
`;
const ErrorWrapper = styled.div`
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;