import {useCurrentFlowUser} from "@onflow/kit"

export function CurrentFlowUserCard() {
  const {user, authenticate, unauthenticate} = useCurrentFlowUser()

  return (
    <div
      style={{
        padding: "2rem",
        border: "2px solid #00EF8B",
        borderRadius: "12px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 6px rgba(0, 239, 139, 0.1)",
        marginBottom: "2rem",
      }}
    >
      <h2
        style={{
          color: "#000000",
          marginTop: "0",
          marginBottom: "1.5rem",
          fontSize: "1.5rem",
          fontWeight: "700",
        }}
      >
        useCurrentFlowUser
      </h2>

      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px",
          border: "1px solid #00EF8B",
          marginBottom: "1.5rem",
        }}
      >
        <h4 style={{color: "#000000", margin: "0 0 1rem 0"}}>
          User Information:
        </h4>
        {user?.loggedIn ? (
          <div>
            <p style={{color: "#000000", margin: "0.5rem 0"}}>
              <strong>Address:</strong> {user.addr}
            </p>
            <p style={{color: "#000000", margin: "0.5rem 0"}}>
              <strong>Status:</strong> Authenticated
            </p>
            <p style={{color: "#000000", margin: "0.5rem 0"}}>
              <strong>Services:</strong>{" "}
              {JSON.stringify(user.services, null, 2)}
            </p>
          </div>
        ) : (
          <p style={{color: "#666666", margin: "0"}}>No user authenticated</p>
        )}
      </div>

      <div>
        {!user?.loggedIn ? (
          <button
            onClick={authenticate}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#00EF8B",
              color: "#000000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
              marginRight: "1rem",
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = "#02D87E"
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = "#00EF8B"
            }}
          >
            Authenticate
          </button>
        ) : (
          <button
            onClick={unauthenticate}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#000000",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
              marginRight: "1rem",
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = "#333333"
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = "#000000"
            }}
          >
            Unauthenticate
          </button>
        )}
      </div>
    </div>
  )
}
