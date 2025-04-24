
import { Link } from "react-router-dom";
import { POPULAR_CREATORS } from "../data/mockStreams";

const PopularCreators = () => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Popular Creators</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {POPULAR_CREATORS.map(creator => (
          <Link 
            to={`/creators/${creator.id}`} 
            key={creator.id}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 border-2 border-primary">
              <img src={creator.image} alt={creator.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-medium text-center">{creator.name}</h3>
            <p className="text-xs text-muted-foreground">{creator.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularCreators;
