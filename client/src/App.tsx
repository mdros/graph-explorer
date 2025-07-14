import { useState } from "react";
import Graph from "./components/Graph";
import LoginForm from "./components/LoginForm";

export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const onLogin = () => setIsLoggedIn(true);

	return isLoggedIn ? <Graph /> : <LoginForm onLogin={onLogin}/>;
}
