import React, { useEffect, useState } from "react";
import { firestoreService, storageService } from "myFire";
import Twitt from "components/Twitt";
import { v4 as uuidv4 } from 'uuid';

const Home = ({ userObj }) => {
    const [twitt, setTwitt] = useState('');
    const [twitts, setTwitts] = useState([]);
    const [fileAttachment, setFileAttachment] = useState(null);

    useEffect(() =>{
        firestoreService.collection('twitts').onSnapshot(snapshot => {
            const twitterArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })
            );
            setTwitts(twitterArray);
        })
    }, []);
    const getFileUrl = async () => {
        if(!fileAttachment) return false;
        const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`)
        const response = await fileRef.putString(fileAttachment, "data_url")
        const fileUrl = await response.ref.getDownloadURL();
        return fileUrl;
    }
    const onSubmitted = async (event) => {
        event.preventDefault();
        const post = {
            text: twitt,
            createAt: Date.now(),
            creatorId: userObj.uid,
            fileUrl: await getFileUrl() ?? null,
        };
        await firestoreService.collection("twitts").add(post);

        setTwitt('');
        setFileAttachment(null);
        const imgTag = document.querySelector('#imgInput');
        console.log(imgTag);
        imgTag.value = null;
    };
    const onChanged = (event) => {
        const {target: {value}} = event;
        setTwitt(value);
    };
    const onChangedImage = (event) => {
        const {target: {files}} = event;
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            setFileAttachment(finishedEvent.currentTarget.result); 
        };
        reader.readAsDataURL(file);
    };
    const onClearPhoto = () => {
        setFileAttachment(null);
        const imgTag = document.querySelector('#imgInput');
        console.log(imgTag);
        imgTag.value = null;
    };
    return (
        <div>
            <form onSubmit={onSubmitted}>
                <input type="text" placeholder="What's on your mind" maxLength={120} value={twitt} onChange={onChanged}/>
                <input id="imgInput" type="file" accept="image/*" onChange={onChangedImage}/>
                <input type="submit" value="twitt"/>
                {
                    fileAttachment && (
                        <div>
                            <img src={fileAttachment} width="50px" height="50px" alt="thumnailImage" />
                            <button onClick={onClearPhoto} >Clear</button>
                        </div>
                    )
                }
            </form>
            {twitts.map((twitt)=>{
                return (
                    <Twitt key={twitt.id} twittObj={twitt} isOwner={twitt.creatorId === userObj.uid}/>
                )
            })}
        </div>
    )
}
export default Home;