import { Button } from "./components/ui/button";
import { Container } from "./components/ui/container";
import { Stack } from "./components/ui/stack";
import { Text } from "./components/ui/text";

function App() {
  return (
    <Container>
      <Stack direction="row" gap="lg">
        <Text variant="primary" size="4xl" weight="bold">
          Timeworth
        </Text>
        <Button variant="primary">yeah</Button>
      </Stack>
    </Container>
  );
}

export default App;
