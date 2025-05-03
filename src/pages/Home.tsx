import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center mt-10 space-y-4">
            <h1 className="text-2xl font-semibold">Home Page</h1>
            <Link to="/pftracker" className="text-blue-500 hover:underline">
                Go to PFT
            </Link>
        </div>
    );
};

export default Home;
