import { useContext, useState } from "react";
import { Alert, Button, Col, Form, Row, Spinner, Stack } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const AuthPage = () => {
    const { authInfo, updateAuthInfo, isAuthLoading, registerUser, loginUser, authError } = useContext(AuthContext);

    const [isLogin, setIsLogin] = useState(true);

    const handleAuth = (e) => {
        if (isLogin) {
            return loginUser(e);
        }
        return registerUser(e);
    }

    return (
        <Form>
            <Row style={{ height: "100vh", justifyContent: "center", paddingTop: "10%" }}>
                <Col xs={6}>
                    <Stack gap={3}>
                        <h2>{isLogin ? "Login" : "Registration"}</h2>

                        {
                            !isLogin ?
                                <Form.Control type="text" placeholder="Name" onChange={e => updateAuthInfo({ ...authInfo, name: e.target.value })} /> :
                                null
                        }
                        <Form.Control type="email" placeholder="Email" onChange={e => updateAuthInfo({ ...authInfo, email: e.target.value })} />
                        <Form.Control type="password" placeholder="Password" onChange={e => updateAuthInfo({ ...authInfo, password: e.target.value })} />
                        <Button variant="primary" disabled={isAuthLoading} type="submit" onClick={e => handleAuth(e)}>{isAuthLoading ? <Spinner size="sm" /> : (isLogin ? "Login" : "Register")}</Button>
                        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Dont have an account yet?" : "ALready have an account?"}</Button>

                        {
                            authError ?
                                <Alert variant="danger"><p>{authError}</p></Alert> :
                                null
                        }
                    </Stack>
                </Col>
            </Row>
        </Form>
    );
}

export default AuthPage;