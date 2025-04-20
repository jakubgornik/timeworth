import { Container } from "./components/ui/container";
import { SignUpFormCard } from "./modules/signup/signup-form-card";

function App() {
  return (
    <Container>
      {/* TODO move to page router */}
      <SignUpFormCard />
    </Container>
  );
}

export default App;
