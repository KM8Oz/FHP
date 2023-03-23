import { useAuth } from "pocketbase-react"
import { Outlet } from "react-router-dom"
import { LoginSignup } from "./Login"
export function RootComponent() {
    const { isSignedIn, user } = useAuth();
    return isSignedIn ?(
        <Outlet />
    ) : <LoginSignup />
}