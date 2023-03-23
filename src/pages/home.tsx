import { invoke } from "@tauri-apps/api";
import { y } from "@tauri-apps/api/path-e12e0e34";
import { useAuth } from "pocketbase-react"
import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components";
import { COLORS, FONTS } from "../utils"
export function Home() {
    const { isSignedIn, user, actions } = useAuth();
    const [stats, setStats] = useState([] as any[]);
    const [position, setPosition] = useState<number>(0);
    const scr = useRef<HTMLDivElement>(null)
    useEffect(() => {
        setPosition(s=>scr.current?.offsetHeight? scr.current?.offsetHeight : 0)
        setTimeout(async () => {
            let val = await invoke<any[]>("user_processes");
            setStats(val);
            scr.current?.scrollTo({
                left:0,
                top:position
            })
        }, 3000)
    }, [stats])
    const RoundedBorderList = ({ items }:{ items: {name:string, uptime: number }[]}) => {
        return (
          <div style={{
            maxHeight: '70vh',
            paddingLeft: '10px',
            paddingRight: '10px',
            overflowY:"scroll",
            overflowX:"hidden"
          }}>
            {items.map(item => (
              <ItemContainer key={item.name}>
                <ItemName>{item.name}</ItemName>
                <ItemTime>{new Date(item.uptime).toLocaleString('en')}</ItemTime>
              </ItemContainer>
            ))}
          </div>
        );
      };
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
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
            <RoundedBorderList items={stats} />
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
  border: 1px solid #e6e6e6;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
`;

const ItemName = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #333;
`;

const ItemTime = styled.div`
  font-size: 10px;
  font-weight: 400;
  color: #666;
`;