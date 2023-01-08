import extractData from "../../utility/extractFirestoreData"
import {db} from '../../firebase/index';
import {getDocs, collection} from "firebase/firestore";

export default async function handler(req, res) {

    try {

        const collectionRef = collection(db, 'licenses');
        const querySnapshot = await getDocs(collectionRef)
        const arr = querySnapshot.docs.map((d) => ({objectId:d.id,...d.data()}))
        const convertedArr = await extractData(arr)
        res.status(200).json(convertedArr);

    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message});
    }
}