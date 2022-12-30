import React, {useEffect} from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.css';
import '../styles/tables.module.css';
import extractData from "../utility/extractFirestoreData";

const DataTable = (props) => {

    let table;



    useEffect(() => {
        console.log(props.data)
        table = $('#myData').DataTable({
            "language": {
                "lengthMenu": "Sayfa başına  _MENU_ kayıt görüntüleniyor",
                "zeroRecords": "Kayıt yok",
                "info": "Sayfa _PAGE_ / _PAGES_",
                "infoEmpty": "Herhangi bir kayıt yok.",
                "infoFiltered": "(filtered from _MAX_ total records)"
            },
            columns:[
                { title: 'Bayi' },
                { title: 'End User' },
                { title: 'Tarih' },
                { title: 'Lisans Tipi' },
                { title: 'Lisans Anahtarı' },
                { title: 'Kanal Sayısı' }
            ],
            data:extractData(props.data)
        });

        return () => {
            table.destroy();
        };


    }, []);

    // generateTableRows = dataArr.map((item, index) => {
    //     return(
    //         <tr key={index}>
    //             <td>{item.ResellerName}</td>
    //             <td>{item.endUser}</td>
    //             <td>{item.DateTime.seconds}</td>
    //             <td>{item.Edition}</td>
    //             <td>{item.LicenseKey}</td>
    //             <td>{item.SimultaneousCalls}</td>
    //         </tr>
    //     );
    // });

    return (

        <table id="myData" className="stripe hover">

        </table>

    );
}

export default DataTable;