import { Link, useLocation } from 'react-router-dom';

const BottomNav = ({ toggleSidebar }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="bottom-nav">
            <Link to="/" className={`nav-item ${isActive('/')}`}>
                <i className="fa-solid fa-house"></i><span>Home</span>
            </Link>
            <Link to="/explore" className={`nav-item ${isActive('/explore')}`}>
                <i className="fa-regular fa-compass"></i><span>Explore</span>
            </Link>
            <div className="nav-item" onClick={toggleSidebar}>
                <i className="fa-solid fa-bars"></i><span>Menu</span>
            </div>
        </div>
    );
};
export default BottomNav;
