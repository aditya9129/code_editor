// import Avatar from "react-avatar";

export default function Member({ username }) {
    return (
        <div className="flex">
         {/* <Avatar name={username} size="20" className="rounded"  />  */}
            <p className="text-gray-400">{username}</p>
        </div>
    );
}
