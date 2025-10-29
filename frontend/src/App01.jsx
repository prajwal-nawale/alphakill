import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
export default function App(){
    return <div>
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                <Route path="/neet/online-coaching-11" element={<Class11Program />} />
                <Route path="/neet/online-coaching-12" element={<Class12Program />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path="*" element={<Error />} />
                <Route path="/" element={< Home />} />
                </Route>
            </Routes>
        </Router>
    </div>
}
const Layout=()=>{
    
    return <div style={{height:"100vh", width:"100vw"}}>
        <Link to="/"> Allen </Link>
        |
        <Link to ="/neet/online-coaching-11"> Class 11 Program </Link>
        |
        <Link to ="/neet/online-coaching-12"> Class 12 Program </Link>
        |
        <Link to ="/dashboard"> Dashboard </Link>
        <div style={{minHeight:"90vh",backgroundColor:"lightgrey"}}>
        <Outlet />
        </div>
        <footer> All rights reserved @ Allen 2024 </footer>
    </div>
}
    
    const Home=()=>{
        return <div>Allen</div>
    }
    const Class11Program = () => {
  const navigate = useNavigate();

  

  return (
    <div>
      <h2>Class 11 NEET Coaching Program</h2>
      <p>Specialized preparation for NEET aspirants in Class 11.</p>
      <button onClick={() => navigate("/neet/online-coaching-12")}>Go Back to Home Page</button>
    </div>
  );
};

const Class12Program = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Class 12 NEET Coaching Program</h2>
      <p>Advanced coaching for Class 12 NEET students.</p>
      <button onClick={() => navigate("/")}>Go Back to Home Page</button>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to your student dashboard!</p>
    </div>
  );
};

const Error = () => {
  const navigate = useNavigate();

  // navigate back to home after 3 seconds
  setTimeout(() => {
    navigate("/");
  }, 3000);

  return <div>404 Page Not Found</div>;
};