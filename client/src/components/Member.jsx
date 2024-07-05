
import Avatar from 'react-avatar';

// eslint-disable-next-line react/prop-types
export default function Member( {username}) {

    return (
        <div className="flex items-center">
            <Avatar name={username} size="30" round={true} className="mr-2" />
            <p className="text-gray-400">{username}</p>
        </div>
    );
}
