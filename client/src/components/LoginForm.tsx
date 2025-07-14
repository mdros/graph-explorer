import { useState } from "react";

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (login === "admin" && password === "admin") {
			setError("");
			onLogin();
		} else {
			setError("Invalid login or password.");
		}
	};

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				width: "100vw",
			}}
		>
			<div style={{ padding: "20px", maxWidth: "400px", width: "100%" }}>
				<form onSubmit={handleSubmit}>
					<div>
						<label>
							Login: <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
						</label>
					</div>
					<div>
						<label>
							Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
						</label>
					</div>
					{error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
					<button type="submit">Login</button>
				</form>
			</div>
		</div>
	);
}
