import { useEffect, useState } from "react";
import styled from "styled-components";
import validator from "validator";
import { TextInput } from "../components";
import { COLORS, FONTS } from "../utils";
import Github from "~icons/mdi/github"
import Loginicon from "~icons/mdi/login"
import Registericon from "~icons/mdi/lock-open-outline"
import { useAuth } from "pocketbase-react";
import toast from "react-hot-toast";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api";
export function LoginSignup(props: any) {
    const { isSignedIn, user, actions } = useAuth();
    const [unlisten, setMunlisten] = useState<any>(null);
    // const [methods, setMethods] = useState({} as {
    //     usernamePassword: boolean;
    //     emailPassword: boolean;
    //     authProviders: Array<AuthProviderInfo>;
    // } | undefined);
    const [tab, setTab] = useState(0)
    const startlistner = async () => {
        invoke<any | string>("start_server").then(async (payload) => {
            const code = () => {
                try {
                    let _url = payload?.uri ? new URL(payload.uri) : { searchParams: null };
                    if (_url?.searchParams?.get('code')) {
                        return payload?.uri;
                    } else {
                        return undefined
                    }
                } catch (err) {
                    return undefined
                }
            };
            if (code()) {
                actions.submitProviderResult(code()).then(async () => {
                    await appWindow.show();
                    toast.dismiss()
                    toast.success(`Welcome back!`,
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
                }).catch((error) => {
                    // console.log({ error });
                    toast.dismiss()
                    toast.error(`Rejected authentication, try again!`,
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
                })
            } else {
                toast.dismiss()
                toast.error(`Rejected authentication, try again!`,
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
        }).catch((err)=>{
            console.log({err});
            toast.dismiss()
                toast.error(`Rejected authentication, try again!`,
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
        });
    }
    const loginwithgithub = async () => {
        await startlistner();
        toast.loading(`Auth0 using github!`,
            {
                duration: Infinity,
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
        actions.signInWithProvider("github").then((err) => {
            // nav("/", {
            //     preventScrollReset: true
            // })
        }).catch((err) => {
            toast.dismiss('bad_credentials')
            toast.error(`Rejected authentication, try again!`,
                {
                    id: 'bad_credentials',
                    duration: 700,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        padding: '4px 5px',
                        fontSize: '10px',
                    },
                }
            );
        })
    }
    const Login = () => { //////////////////////////////////////////////////////////////////
        const [logindata, setLogindata] = useState({
            username: {
                value: "",
                isvalid: true, // validated if is email or not only,
                isemail: true
            },
            password: {
                value: "",
                isvalid: true,
            }
        })

        const submit = () => {
            if (logindata.username.value && logindata.password.value) {
                if (logindata.username.isvalid && logindata.password.isvalid) {
                    let loading_d = toast.loading(`Login using credentials!`,
                        {
                            duration: Infinity,
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
                    actions.signInWithEmail(logindata.username.value, logindata.password.value).then(() => {
                        toast.dismiss(loading_d)
                        toast.success(`Welcome ${user?.email}!`,
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
                        // nav("/", {
                        //     preventScrollReset: true
                        // })
                    }).catch(() => {
                        toast.dismiss('bad_credentials')
                        toast.error(`Bad credentials, try again!`,
                            {
                                id: 'bad_credentials',
                                duration: 700,
                                style: {
                                    borderRadius: '10px',
                                    background: '#333',
                                    color: '#fff',
                                    padding: '4px 5px',
                                    fontSize: '10px',
                                },
                            }
                        );
                    })
                } else {
                    toast.dismiss('bad_credentials')
                    toast.error(`Please check <${!logindata.username.isvalid && 'username'},${!logindata.username.isvalid && 'password'} >!`,
                        {
                            id: 'bad_credentials',
                            duration: 700,
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
            } else {
                toast.dismiss('bad_credentials')
                toast.error(`Please fill <${!logindata.username.value && 'username'},${!logindata.username.value && 'password'} >!`,
                    {
                        id: 'bad_credentials',
                        duration: 700,
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
        }
        const [isfocused, setIsfocused] = useState(false);
        return (
            <Loginwrapper  >
                <InputGroup>
                    <TextInput
                        iserror={logindata.username.isvalid}
                        onChange={(event: React.ChangeEvent<any>) => {
                            event.preventDefault();
                            setLogindata((s) => ({
                                ...s,
                                username: {
                                    ...s.username,
                                    value: event.target.value,
                                    isemail: validator.isEmail(event.target.value, {
                                        domain_specific_validation: true
                                    })
                                }
                            }))
                        }}
                        onFocus={() => setIsfocused(true)}
                        onBlur={() => setIsfocused(false)}
                        type={"email"} label="Email/Username" />
                    <Line style={{
                        backgroundColor: COLORS.black,
                        opacity: isfocused ? 0 : .2
                    }} />
                    <TextInput
                        onChange={(event: React.ChangeEvent<any>) => {
                            event.preventDefault();
                            setLogindata((s) => ({
                                ...s,
                                password: {
                                    ...s.password,
                                    value: event.target.value,
                                    isvalid: validator.isStrongPassword(event.target.value, {
                                        minLength: 8,
                                        minSymbols: 1,
                                        minUppercase: 1
                                    })
                                }
                            }))
                        }}
                        iserror={logindata.password.isvalid}
                        onFocus={() => setIsfocused(true)}
                        onBlur={() => setIsfocused(false)}
                        type={"password"} label="Password" />
                </InputGroup>
                <button
                    onClick={submit}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20
                    }}>
                    Login <Loginicon />
                </button>
                <Devider >
                    <div />
                    <p>OR</p>
                    <div />
                </Devider>
                <button
                    onClick={loginwithgithub}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    Continue with <Github />
                </button>
            </Loginwrapper>
        )
    }
    const Header = ({ tab }: { tab: number }) => {
        return (
            <HeadWrapper >
                <Text
                    onClick={() => setTab(0)}
                    style={{
                        color: tab === 0 ? COLORS.black : COLORS.secondary
                    }}
                >Login</Text>
                <Text>/</Text>
                <Text
                    onClick={() => setTab(1)}
                    style={{
                        color: tab === 1 ? COLORS.black : COLORS.secondary
                    }}
                >Register</Text>
            </HeadWrapper>)
    }
    const Signup = () => {   //////////////////////////////////////////////////////////////////
        const [registerdata, setRegisterdata] = useState({
            username: {
                value: "",
                isvalid: true, // validated if is email or not only,
            },
            email: {
                value: "",
                isvalid: true, // validated if is email or not only,
            },
            password: {
                value: "",
                isvalid: true,
            }
        })
        const submit = async () => {
            if (registerdata.email.value && registerdata.password.value) {
                if (registerdata.email.isvalid && registerdata.password.isvalid) {
                    let loading_d = toast.loading(`Login using credentials!`,
                        {
                            duration: Infinity,
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
                    actions.registerWithEmail(registerdata.email.value, registerdata.password.value).then(() => {
                        toast.dismiss()
                        let { user } = useAuth();
                        if (!!user) {
                            actions.updateProfile(user.id, {
                                username: registerdata.username.value
                            })
                        }
                        toast.success(`Welcome ${user?.email}!`,
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
                    }).catch(async (err) => {
                        toast.dismiss()
                        toast.error(`Email already in use! check your email address for further instructions`,
                            {
                                id: 'bad_credentials',
                                duration: 10000,
                                style: {
                                    borderRadius: '10px',
                                    background: '#333',
                                    color: '#fff',
                                    padding: '4px 5px',
                                    fontSize: '10px',
                                },
                            }
                        );
                    })
                    await actions.sendPasswordResetEmail(registerdata.email.value)
                } else {
                    toast.dismiss()
                    toast.error(`Please check <${!registerdata.email.isvalid && 'email'},${!registerdata.username.isvalid && 'password'} >!`,
                        {
                            id: 'bad_credentials',
                            duration: 700,
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
            } else {
                toast.dismiss()
                toast.error(`Please fill <${!registerdata.email.value ? 'email': ''},${!registerdata.password.value ? ',password': ''} >!`,
                    {
                        id: 'bad_credentials',
                        duration: 700,
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
        }
        const [isfocused, setIsfocused] = useState(false);
        return (
            <Loginwrapper  >
                <InputGroup>
                    <TextInput
                        iserror={registerdata.username.isvalid}
                        onChange={(event: React.ChangeEvent<any>) => {
                            event.preventDefault();
                            setRegisterdata((s) => ({
                                ...s,
                                email: {
                                    ...s.email,
                                    value: event.target.value,
                                    isemail: validator.isEmail(event.target.value, {
                                        domain_specific_validation: true
                                    })
                                }
                            }))
                        }}
                        onFocus={() => setIsfocused(true)}
                        onBlur={() => setIsfocused(false)}
                        type={"email"} label="Email" />
                    <Line style={{
                        backgroundColor: COLORS.black,
                        opacity: isfocused ? 0 : .2
                    }} />
                    <TextInput
                        iserror={registerdata.username.isvalid}
                        onChange={async (event: React.ChangeEvent<any>) => {
                            event.preventDefault();
                            setRegisterdata((s) => ({
                                ...s,
                                username: {
                                    ...s.username,
                                    value: event.target.value,
                                    isvalid: validator.isStrongPassword(event.target.value, {
                                        minLength: 5
                                    })
                                }
                            }))
                        }}
                        onFocus={() => setIsfocused(true)}
                        onBlur={() => setIsfocused(false)}
                        type={"text"} label="Username" />
                    <Line style={{
                        backgroundColor: COLORS.black,
                        opacity: isfocused ? 0 : .2
                    }} />
                    <TextInput
                        onChange={(event: React.ChangeEvent<any>) => {
                            event.preventDefault();
                            setRegisterdata((s) => ({
                                ...s,
                                password: {
                                    ...s.password,
                                    value: event.target.value,
                                    isvalid: validator.isStrongPassword(event.target.value, {
                                        minLength: 8,
                                        minSymbols: 1,
                                        minUppercase: 1
                                    })
                                }
                            }))
                        }}
                        iserror={registerdata.password.isvalid}
                        onFocus={() => setIsfocused(true)}
                        onBlur={() => setIsfocused(false)}
                        type={"password"} label="Password" />
                </InputGroup>
                <button onClick={submit} style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20
                }}>
                    Register <Registericon />
                </button>
                <Devider >
                    <div />
                    <p>OR</p>
                    <div />
                </Devider>
                <button onClick={loginwithgithub} style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    Continue with <Github />
                </button>
            </Loginwrapper>
        )
    }
    return (
        <Wrapper>
            <Header tab={tab} />
            {
                tab === 0 ? <Login /> : <Signup />
            }
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    background-color: "#ccc";
    width: 100%;
    height: 100%;
`;
const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 1px;
    border: 1px solid #9f9f9f;
    border-radius:  9px;
    background-color: #FFFFFF;
`;

const HeadWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 30;
`;


const Text = styled.p`
  font-size: 20px;
  font-family: ${FONTS.MAIN};
  font-weight: 900;
  cursor: pointer;
`;
const Line = styled.div`
  width: 100%;
  height: 1px;
  transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
`;
const Devider = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-height: 10px;
  padding: 10px 0px;
  flex-wrap: nowrap;
  p {
    flex: .25;
    font-size:14px;
    color: ${COLORS.black};;
    font-family:${FONTS.MAIN};
    text-align:center;
  }
  div {
    flex: 1;
    height: 1px;
    opacity: 0.3;
    background-color: ${COLORS.black};
  }
`;
const Loginwrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
