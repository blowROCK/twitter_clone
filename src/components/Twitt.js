import { firestoreService, storageService } from "myFire";
import React, { useState } from "react";

const Twitt = ({ twittObj, isOwner }) =>{
    const [editing, setEditing] = useState(false);
    const [newTwitt, setNewTwitt] = useState(twittObj.text);

    const onDeleted = async () => {
        if(window.confirm("Delete this Twitt?")){
            await firestoreService.doc(`twitts/${twittObj.id}`).delete();
            if(twittObj.fileUrl){
                await storageService.refFromURL(twittObj.fileUrl).delete();
            }
        }
    }
    const toggleEditing = () => {
        setEditing((prev) => !prev);
        setNewTwitt(twittObj.text);
    }
    const onChanged = (event) => {
        const {target : {value}} = event;
        setNewTwitt(value);
    }
    const onSubmitted = async (event) => {
        event.preventDefault();
        await firestoreService.doc(`twitts/${twittObj.id}`).update({
            text: newTwitt
        });
        setEditing(false);
    }
    return(
        <div>
            <div className="contents">
                { editing ? 
                    <form onSubmit={onSubmitted}>
                        <input type="text" value={newTwitt} required onChange={onChanged}/>
                        <input type="submit" value="update"></input>
                    </form>
                    :
                    <h4>{twittObj.text}</h4>
                }
                { twittObj.fileUrl && 
                    <img src={twittObj.fileUrl} width="200px" alt="fileImage"></img>
                }
            </div>
            { isOwner && 
                    <div>
                        <button onClick={onDeleted}>Delete</button>
                        <button onClick={toggleEditing}>{editing ? 'Cancle' : 'Edit'}</button>
                    </div>
            }
        </div>
    )
}
export default Twitt;