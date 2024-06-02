import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function AppNavBar() {
    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
            <Container fluid>
                <Navbar.Brand href="#home">Service Drawer</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/desktop">Desktop list</Nav.Link>
                        <Nav.Link as={Link} to="/mobile">Mobile list</Nav.Link>
                        <Nav.Link as={Link} to="/config">Configuration</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavBar;