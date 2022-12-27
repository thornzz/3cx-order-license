import React, {useEffect} from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.css';
import '../styles/tables.module.css';

const DataTable = () => {
    let table;

    useEffect(() => {

        table = $('#myData').DataTable({
            "language": {
                "lengthMenu": "Sayfa başına  _MENU_ kayıt görüntüleniyor",
                "zeroRecords": "Kayıt yok",
                "info": "Sayfa _PAGE_ / _PAGES_",
                "infoEmpty": "Herhangi bir kayıt yok.",
                "infoFiltered": "(filtered from _MAX_ total records)"
            }
        });
        return () => {
            table.destroy();
        };


    }, []);

    return (

        <table id="myData" className="stripe hover">
            <thead>
            <tr>
                <th data-priority="1">Field 1</th>
                <th data-priority="2">Field 2</th>
                <th data-priority="3">Field 3</th>
                <th data-priority="4">Field 4</th>
                <th data-priority="5">Boolean Field</th>
                <th data-priority="6">Fieelldd</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Tiger Nixon</td>
                <td>System Architect</td>
                <td>Edinburgh</td>
                <td>61</td>
                <td>2011/04/25</td>
                <td>$320,800</td>
            </tr>

            <tr>
                <td>Donna Snider</td>
                <td>Customer Support</td>
                <td>New York</td>
                <td>27</td>
                <td>2011/01/25</td>
                <td>$112,000</td>
            </tr>
            </tbody>
        </table>

    );
}

export default DataTable;