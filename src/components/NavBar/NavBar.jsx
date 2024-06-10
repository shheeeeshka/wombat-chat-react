import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/wombat-logo.png";

const NavBar = () => {
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
            <Container>
                <Link to="/" className="link-light text-decoration-none">
                    <img src={logo} height={80} alt="logo" />
                </Link>
                {
                    user && <span className="text-warning">Logged in as {user?.name}</span>
                }
                <Nav>
                    <Stack direction="horizontal" gap={3}>
                        {
                            user && (
                                <>
                                    <Link onClick={(e) => logoutUser(e)} to="/auth" className="link-light text-decoration-none">Logout</Link>
                                </>
                            )
                        }

                        {
                            !user && (
                                <>
                                    <Link to="/auth" className="link-light text-decoration-none">Login</Link>
                                </>
                            )
                        }
                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;