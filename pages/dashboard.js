import { auth } from "../firebase";
import Navbar from "../components/Navbar";
import DataTable from "../components/DataTable";
const Dashboard = () => {
    return (
        <div>
            <Navbar/>
            <DataTable/>
        </div>
    );
};
export default Dashboard;