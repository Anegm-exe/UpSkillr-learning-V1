import Link from 'next/link';
import logincss from '../../styles/register.module.css';
export default function Login() {
    return (
        <div className="loginco">
            <h1>Login</h1>
            <form className="loginForm">
                <div className="inputGroup">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email" required />
                </div>
                <div className="styles.inputGroup">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password" required />
                </div>
                <button type="submit" className="signInButton">Sign In</button>
            </form>
            <p className="signupText">
                Don't have an account?{' '}
                <Link href="/register" className="signupLink">
                    Sign up now
                </Link>
            </p>
        </div>
    );
}
