import DataTable from 'react-data-table-component';
import extractData from "../utility/extractFirestoreData";
import {db} from '../firebase/index';
import {getDocs, collection} from "firebase/firestore";
import React, {useState,useEffect} from "react";

const LicensesTable = () => {
    const [myData, setData] = useState([])
    const columns = [
        {
            name: 'Bayi',
            selector: row => row.ResellerName,
            sortable:true
        },
        {
            name: 'Tarih',
            selector: row => row.DateTime,
        },
        {
            name: 'End user',
            selector: row => row.endUser,
            sortable:true
        },
        {
            name: 'Lisans Anahtarı',
            selector: row => row.LicenseKey,
        },
        {
            name: 'Lisans Tipi',
            selector: row => row.Edition,
            sortable:true
        },
        {
            name: 'Kanal Sayısı',
            selector: row => row.SimultaneousCalls,
            sortable:true
        },
    ];

    useEffect(() => {
        (async () => {
            //setLoading(true)
            const collectionRef = collection(db, 'licenses');
            const querySnapshot = await getDocs(collectionRef)
            const arr = querySnapshot.docs.map((d) => ({...d.data()}))
            const mydata = await extractData(arr)
            setData(mydata)
            //setLoading(false)

        })();

    }, [])

    return (
        <DataTable
            columns={columns}
            data={myData}
    highlightOnHover={true}
        />
    )

}


export default LicensesTable