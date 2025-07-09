import "./app.css"
import {Container} from "./components/container"
import FlowProviderWrapper from "./components/flow-provider-wrapper"
import {Navbar} from "./components/navbar"

export function App() {
  return (
    <FlowProviderWrapper>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          minHeight: "100vh",
          backgroundColor: "#FFFFFF",
          color: "#000000",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />

        <main
          style={{
            width: "100%",
            marginTop: "2rem",
          }}
        >
          <Container />
        </main>
      </div>
    </FlowProviderWrapper>
  )
}
