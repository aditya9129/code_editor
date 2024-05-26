import Member from "./Member";

export default function Chatbox({ clients, messages, user }) {
  console.log(messages);
  return (
    <div className="bg-[#1C1E2A] w-full  flex flex-col ">
      <div className="flex">
        <h1 className="text-white mx-auto">Code Room</h1>
      </div>
      <p className="text-white p-2 m-1 mx-auto">Connected Users</p>
      <div className="bg-green-200 p-2">
        {clients.map((info) => (
          <Member key={info.socketid} username={info.username} />
        ))}
      </div>
      <div className="h-full flex flex-col justify-end w-[100%]">
        <div className="overflow-y-auto max-h-[80vh] p-2">
          {messages.map((msg, idx) => {
            if (user !== msg.username) {
              return (
                <div key={idx}>
                  <div className="self-start text-white mb-1 bg-[#06CF9C] rounded-lg p-2 inline-block max-w-full break-words">
                    <strong>{msg.username}: </strong>
                    {msg.message}
                    <div>{msg.time}</div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={idx} className="flex justify-end">
                  <div className="self-end text-white mb-1 bg-green-400 rounded-lg p-2 inline-block max-w-full break-words ">
                    {/* <strong>{msg.username}: </strong> */}
                    {msg.message}
                    <div>{msg.time}</div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
