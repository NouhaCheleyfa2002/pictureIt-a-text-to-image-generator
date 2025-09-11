import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props)=>{
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    //add the token state variable so that we can store the token in the local storage 
    const [token, setToken] = useState(localStorage.getItem('token'));

    const [credit, setCredit] = useState(false)

    //connect back to front
    const backendUrl = import.meta.env.VITE_BACKEND_URL; 

    const navigate = useNavigate()

    const loadCreditsData = async ()=>{
        if (!token) {
            toast.error("You need to log in first.");
            return;
        }
        try {
            const {data} = await axios.post(`${backendUrl}/api/user/credits`, {}, {headers: {token}});


            if (data.success) {
                setCredit(data.credits)
                setUser(data.user)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)            
        }
    }

    const generateImage = async (prompt)=>{
        if (!token) {
            toast.error("You need to log in first.");
            return;
        }
        try {
            const {data} = await axios.post(
                `${backendUrl}/api/image/generate-image`,
                {prompt},
                {headers: {token}}
            );
            
            
            if (data.success) {
                loadCreditsData()
                return data.resultImage
            }else{
                toast.error(data.message)
                loadCreditsData()
                if(data.creditBalance === 0){
                    navigate('/buy')
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const logout = ()=>{
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
    }

    useEffect(()=> {
        if (token) {
            loadCreditsData()
        }
    },[token])
     
    const value = {
        user, setUser, showLogin, setShowLogin, backendUrl, token,setToken, credit, setCredit, loadCreditsData, logout, generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;