import Link from 'next/link';
import '../styles/navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link href="/" className="button">Home</Link>
            <Link href="/about" className="button">About</Link>
            <Link href="/login" className="button">Login</Link>
        </nav>
    );
};

export default Navbar;
