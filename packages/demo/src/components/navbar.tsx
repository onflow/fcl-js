import {useCurrentFlowUser} from "@onflow/kit"

export function Navbar() {
  const {user, authenticate, unauthenticate} = useCurrentFlowUser()

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#FFFFFF",
        borderLeft: "2px solid #00EF8B",
        borderRight: "2px solid #00EF8B",
        borderBottom: "2px solid #00EF8B",
        borderRadius: "0 0 12px 12px",
        marginBottom: "0",
        boxShadow: "0 2px 4px rgba(0, 239, 139, 0.1)",
      }}
    >
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#000000",
        }}
      >
        FCL Demo App
      </div>
      <div>
        {!user?.loggedIn && (
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
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = "#02D87E"
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = "#00EF8B"
            }}
          >
            Log In With Wallet
          </button>
        )}
        {user?.loggedIn && (
          <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
            <span
              style={{
                fontSize: "0.9rem",
                color: "#000000",
                fontWeight: "500",
                padding: "0.5rem 1rem",
                backgroundColor: "#f8f9fa",
                borderRadius: "4px",
                border: "1px solid #00EF8B",
              }}
            >
              {user?.addr}
            </span>
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
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = "#333333"
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = "#000000"
              }}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
