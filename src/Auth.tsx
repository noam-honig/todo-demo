import { PropsWithChildren, useEffect, useState } from "react";
import { UserInfo } from "remult";

const Auth: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserInfo>();
  const [username, setUsername] = useState("");
  const signIn = async () => {
    const result = await fetch('/api/signIn', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({ username })
    })
    if (result.ok) {
      setCurrentUser(await result.json());
      setUsername('');
    } else alert(await result.json());

  }
  const signOut = async () => {
    await fetch('/api/signOut', { method: "POST" });
    setCurrentUser(undefined);
  }

  useEffect(() => {
    fetch('/api/currentUser').then(async r => {
      setCurrentUser(await r.json())
    });
  }, []);

  if (!currentUser) {
    return <>
      <h1>Sign In</h1>
      <input value={username}
        placeholder="Try Steve or Jane"
        onChange={e => setUsername(e.target.value)}
      />
      <button onClick={signIn}>Sign In</button>
    </>
  }
  return <>
  Hello {currentUser.name} <button onClick={signOut}>Sign out</button>
  {children}</>
}
export default Auth;