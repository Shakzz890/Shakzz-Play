import MovieCard from '../Shared/MovieCard';

const ContentRow = ({ title, items }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="row">
            <h2><span className="section-indicator"></span> {title} <i className="fa-solid fa-chevron-right"></i></h2>
            <div className="list">
                {items.map(item => (
                    <MovieCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};
export default ContentRow;