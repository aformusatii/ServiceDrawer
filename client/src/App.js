// --- App.js ---
import { Container } from 'react-bootstrap';
import AppNavBar from "./AppNavbar";
import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DesktopDashboardPage from "./DesktopDashboardPage";
import ConfigEditPage from "./ConfigEditPage";
import MobileDashboardPage from "./MobileDashboardPage";


function App() {

    const containerStyle = {
        marginTop: 10,
        overflow: 'auto'
    };

    const noNavBarPaths = ['/mobile'];

    return (
        <Router>
            <div className="App">
                {!noNavBarPaths.some(noNavBarPath => window.location.pathname.startsWith(noNavBarPath)) && <AppNavBar/>}
                <Container style={containerStyle} fluid>
                    <Routes>
                        <Route path="/" element={<HomePage/>} />
                        <Route path="/desktop" element={<DesktopDashboardPage/>} />
                        <Route path="/mobile" element={<MobileDashboardPage/>} />
                        <Route path="/config" element={<ConfigEditPage/>} />
                        <Route path="*" element={<NotFoundPage/>} />
                    </Routes>
                </Container>
            </div>
        </Router>
    );
}

export default App;