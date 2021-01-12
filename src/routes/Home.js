import React, { useEffect, useState } from "react";
import { firestoreService } from "myFire";
import Twitt from "components/Twitt";

const Home = ({ userObj }) => {
    const [twitt, setTwitt] = useState('');
    const [twitts, setTwitts] = useState([]);
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

    // const getTwitts = async () => {
    //     const db = await firestoreService.collection('twitts').get();
    //     db.forEach(document => {
    //         setTwitts(prev => [{
    //             id:document.id,
    //             ...document.data(),
    //         }, ...prev]);
    //     })
    //     return db;
    // };

    const onSubmitted = async (event) => {
        event.preventDefault();
        await firestoreService.collection("twitts").add({
            text: twitt,
            createAt: Date.now(),
            creatorId: userObj.uid,
        });
        setTwitt('');
    };
    const onChanged = (event) => {
        const {target: {value}} = event;
        setTwitt(value);
    };
    return (
        <div>
            <form onSubmit={onSubmitted}>
                <input type="text" placeholder="What's on your mind" maxLength={120} value={twitt} onChange={onChanged}/>
                <input type="submit" value="twitt"/>
            </form>
            {twitts.map((twitt)=>{
                return (
                    <Twitt key={twitt.id} twittObj={twitt} isOwner={twitt.creatorId === userObj}/>
                )
            })}
        </div>
    )
}
export default Home;