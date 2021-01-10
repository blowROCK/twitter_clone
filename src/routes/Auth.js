import React, { useState } from "react";
import { firebaseInc, authService } from "myFire";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [showError, setShowError] = useState("");

    const onChanged = (e) => {
        const {target: {name, value}} = e;
        if(name === 'email'){
            setEmail(value);
        }else if(name === 'password'){
            setPassword(value);
        }
        
    }
    const onSubmitted = async(e) => {
        console.log("------------onSubmitted----------");
        e.preventDefault();
        try{
            let data;
            if(newAccount){
                data = await authService.createUserWithEmailAndPassword(email, password);
            }else{
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            console.log("data : ", data);
        }catch(error){
            console.log( "error :", error);
            setShowError(error.message)
        }
    };
    const toggleAcount = () => setNewAccount((prev) => !prev);
    const onSocialClick = async (event) => {
        console.log(event.target.name);
        const {target : {name}} = event;
        let provider;
        if(name === 'google'){
            provider = new firebaseInc.auth.GoogleAuthProvider();
        }else if(name === 'github'){
            provider = new firebaseInc.auth.GithubAuthProvider();
        }
        const data = await authService.signInWithPopup(provider);
        console.log("data : ", data);
    }
    return (
        <div>
            <form onSubmit={onSubmitted}>
                <input type="text" name="email" placeholder="email" required value={email} onChange={onChanged}></input>
                <input type="password" name="password" placeholder="Password" required value={password} onChange={onChanged}></input>
                <input type="submit" value={newAccount ? "Create Account" : "Log In"}></input>
                {showError}
            </form>
            <span onClick={toggleAcount}>{newAccount ? "Sing in" : "Create Account"}</span>
            <div>
                <button name="google" onClick={onSocialClick}>Continue with Google</button>
                <button name="github" onClick={onSocialClick}>Continue with Github</button>
            </div>
        </div>
    )
};

export default Auth;