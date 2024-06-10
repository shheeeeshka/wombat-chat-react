import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

import NavBar from "../NavBar/NavBar";

const Layout = () => {
    return (
        <>
            <NavBar />
            <Container>
                <Outlet />
            </Container>
        </>
    );
}

export default Layout;