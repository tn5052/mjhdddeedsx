import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import ReviewTable from "../components/ReviewTable";
import {
  Box,
  Flex,
  Heading,
  Button,
  Container,
} from "@chakra-ui/react";
// _app.js or _app.tsx

import { ChakraProvider } from '@chakra-ui/react';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.3rem"
        bg="teal.500"
        color="white"
      >
        <Flex align="center">
          <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
            Osumbite Admin Dashboard
          </Heading>
        </Flex>
        <Button
          colorScheme="teal"
          variant="filled"
          onClick={handleLogout}
          _hover={{ bg: "teal.500", color: "white" }}
        >
          Logout
        </Button>
      </Flex>
      <Container maxW="container.lg" mt={8}>
        <Heading as="h2" size="xl" mb={6}>
          Manage Reviews
        </Heading>
        <ReviewTable />
      </Container>
    </Box>
  );
};

export default AdminPage;