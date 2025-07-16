import {useFlowCurrentUser} from "@onflow/react-sdk"

export function FlowCurrentUserCard() {
  const {user, authenticate, unauthenticate} = useFlowCurrentUser()

  return (
    <div className="p-4 border border-gray-200 rounded-xl bg-white mb-8">
      <h2 className="text-black mt-0 mb-6 text-xl font-bold">
        useFlowCurrentUser
      </h2>
      <div className="p-4 bg-[#f8f9fa] rounded-md border border-[#00EF8B] mb-6">
        <h4 className="text-black mb-4">User Information:</h4>
        {user?.loggedIn ? (
          <div>
            <p className="text-black my-2">
              <strong>Address:</strong> {user.addr}
            </p>
            <p className="text-black my-2">
              <strong>Status:</strong> Authenticated
            </p>
            <p className="text-black my-2">
              <strong>Services:</strong>{" "}
              <pre className="text-black my-2">
                {JSON.stringify(user.services, null, 2)}
              </pre>
            </p>
          </div>
        ) : (
          <p className="text-gray-500 m-0">No user authenticated</p>
        )}
      </div>

      <div>
        {!user?.loggedIn ? (
          <button
            onClick={authenticate}
            className="py-3 px-6 bg-[#00EF8B] text-black border-none rounded-md cursor-pointer
              font-semibold text-base transition-all duration-200 ease-in-out mr-4"
          >
            Authenticate
          </button>
        ) : (
          <button
            onClick={unauthenticate}
            className="py-3 px-6 bg-black text-white border-none rounded-md cursor-pointer
              font-semibold text-base transition-all duration-200 ease-in-out mr-4"
          >
            Unauthenticate
          </button>
        )}
      </div>
    </div>
  )
}
