import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Center h="100vh"> {/* Center the content vertically */}
      <VStack spacing={4} align="center"> 
        <Avatar bg="teal.500" icon={<LockIcon />} />
        <Text fontSize="2xl" fontWeight="bold">
          Admin Login
        </Text>
        {error && <Text color="red.500">{error}</Text>}
        <Box as="form" onSubmit={handleLogin} w="350px"> {/* Set a fixed width */}
          <FormControl isRequired>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full" mt={6}>
            Sign In
          </Button>
        </Box>
      </VStack>
    </Center>
  );
};

export default Login;