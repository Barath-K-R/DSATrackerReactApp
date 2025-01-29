import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import Home from './pages/Home.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Solution from './pages/Solution.jsx';
import { ModalProvider } from "./context/modalContext/modalContext.js";
import { ProblemProvider } from "./context/problemContext/problemContext.js";
import { useAuthContext } from "./context/authContext/authContext.js";
import { setupProblemApiInterceptor } from "./api/problemApi.js";
import { setupSolutionApiInterceptor } from "./api/solutionApi.js";
import { refreshAccessToken } from "./api/authApi.js";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Auth from './pages/Auth.jsx';

const queryClient = new QueryClient();
function App() {
    const { authUser, dispatch, token } = useAuthContext();
    

    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                setupSolutionApiInterceptor(token, dispatch);
                setupProblemApiInterceptor(token, dispatch);
               
            } else {
                try {
                    console.log('REFRESHING ACCESSTOKEN');
                    const response = await refreshAccessToken();
                    const {accessToken,user}=response.data;
                    dispatch({ type: "SET_TOKEN", payload: accessToken });
                    dispatch({ type: "SET_AUTH_USER", payload: user });
                     
                }
                catch (error) {
                    if (error.response && error.response.status === 401) {
                        console.warn("No valid refresh token found. User needs to log in.");
                    } else {
                        console.error("Error during token refresh:", error);
                    }
                }
            }
        };
        initializeAuth();
    }, [token, dispatch]);


    return (
        <QueryClientProvider client={queryClient}>
            <div className="bg-customDark w-full h-full">
                <ModalProvider>
                    <ProblemProvider>
                        {authUser && <Header />}
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={authUser ? <Home /> : <Auth />} />
                                <Route path="/auth" element={authUser ? <Home /> : <Auth />} />
                                <Route path="/solution/:problemName" element={authUser ? <Solution /> : <Auth />} />
                            </Routes>
                        </BrowserRouter>
                        {authUser && <Footer />}
                        <ToastContainer />
                    </ProblemProvider>
                </ModalProvider>
            </div>
            <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
    );
}

export default App;
