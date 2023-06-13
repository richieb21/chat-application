import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ChatEngine } from 'react-chat-engine';
import { auth } from '../firebase';
import axios from 'axios';

import { useAuth } from '../contexts/AuthContext';

const Chats = () => {

    const history = useHistory();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    console.log(user)

    //If the user clicks the logout button, it queues this function which wait for Firebase to sign out and then returns them to the login page
    const handleLogout = async () => {
        await auth.signOut();
        history.push('/')
    }

    //This getFile function tries to fetch the URL. The program will stop here until either the 'Promise' from the async function is fulfilled or rejected. 
    //The same is done for the blob which is just file data
    const getFile = async (url) => {
        const response = await fetch(url);
        const data = await response.blob();

        //We then return a new file with all the data
        return new File([data], "userPhoto.jpg",{ type: 'image/jpeg'})
    }

    useEffect(() => {

        // If there is no user from Firebase, we send them to the login page (history controls page navigation)
        if(!user){
            history.push('/');

            return;
        }

        //If the user does exist, obtain their data through a get request
        axios.get('https://api.chatengine.io/users/me', {
            headers: {
                "project-id": process.env.REACT_APP_CHAT_ENGINE_ID,
                "user-name": user.email,
                "user-secret": user.uid,
            }
        }) //We can stop loading
        .then(() => {
            setLoading(false);
        }) //If the user does not exist, we catch and create a new user
        .catch(() => {
            
            //From Firebase, we create a form and append data like the email and the user's secret ID
            let formdata = new FormData();
            formdata.append('email', user.email);
            formdata.append('username', user.email);
            formdata.append('secret', user.uid);

            //We also use get getFile function, append it to our form data and then post it to chatengine.io using a POST request
            getFile(user.photoURL).then((avatar) => {
                formdata.append('avatar', avatar, avatar.name)
                //If the user does not exist, fetch the avator and create a new user
                axios.post('https://api.chatengine.io/users',
                    formdata,
                    { headers: {"private-key": process.env.REACT_APP_CHAT_ENGINE_KEY}}
                ) //Then we can stop loading and proceed to the chatbot
                .then(() => setLoading(false)) //If there is some error, we display it to the console
                .catch((error) => console.log(error))
            })
        })
    }, [user, history]);

    //If the user doesn't exist still or it's loading, show a loading screen
    if(!user || loading) return 'Loading...';

    return (
        <div className="chats-page"> 
            <div className="nav-bar">
                <div className="logo-tab">
                    Chatterly
                </div>
                <div onClick={handleLogout} className="logout-tab">
                    Logout
                </div>
            </div>
            <ChatEngine
                height="calc(100vh - 66px)"
                projectID= {process.env.REACT_APP_CHAT_ENGINE_ID}
                userName={user.email}
                userSecret={user.uid}
            >

            </ChatEngine>
        </div>
    )
}

export default Chats;