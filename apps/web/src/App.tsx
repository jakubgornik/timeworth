import { Container } from "./components/ui/container";
import { SingUpFormCard } from "./modules/singup/sing-up-form-card";

function App() {
  return (
    <Container>
      {/* TODO move to page router */}
      <SingUpFormCard />
    </Container>
  );
}

export default App;
