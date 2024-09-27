import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { ref, onValue, remove } from "firebase/database";
import { ChakraProvider, useBreakpointValue } from "@chakra-ui/react";
import {
  Grid,
  GridItem,
  Box,
  Flex,
  Avatar,
  Heading,
  Text,
  List,
  ListItem,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  VStack,
  Input,
  FormControl,
  FormLabel,
  Tooltip,
  Tag,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Spinner,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { StarIcon, DeleteIcon, ViewIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { PhoneIcon } from '@chakra-ui/icons';
import moment from "moment";
import ReactMarkdown from "react-markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

const ReviewTable = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [geminiAnalysis, setGeminiAnalysis] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Define numColumns INSIDE the component function
  const numColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const boxBg = useColorModeValue("white", "gray.700"); // Dynamic background color
  const textColor = useColorModeValue("gray.700", "white");


    // Function to post a new review to the API after adding it to Firebase
    const postToAPI = async (newReview) => {
      try {
        const response = await fetch('http://64.227.163.185/api/v1/webhooks/06eNVGch5PyQaBOXvyFRm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newReview),
        });
  
        if (!response.ok) {
          throw new Error('Failed to post review to API');
        }
        console.log("Review posted to API successfully");
      } catch (error) {
        console.error("Error posting review to API:", error);
      }
    };
  
    useEffect(() => {
      const reviewsRef = ref(db, "reviews");
      onValue(reviewsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const newReviews = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setReviews(newReviews);
  
          // Assuming the last added review is new and should be posted to the API
          const lastAddedReview = newReviews[newReviews.length - 1];
          if (lastAddedReview) {
            postToAPI(lastAddedReview); // Post the newly added review to the API
          }
        }
      });
    }, []);

  const analyzeReview = async (reviewText) => {
    setIsLoading(true);
    const prompt = `Analyze the provided review and extract key points, including both strengths and weaknesses. Suggest potential improvements and draft a concise, customer-centric response suitable for a WhatsApp message. Please ensure the tone is empathetic and aligned with customer psychology principles. The review is as follows: "${reviewText}"`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);

      const responseText = result.response.text();
      setGeminiAnalysis(responseText);
    } catch (error) {
      console.error("Error analyzing review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSelect = (review) => {
    setSelectedReview(review);
    onOpen();
  };

  const handleAnalyzeClick = () => {
    if (selectedReview) {
      analyzeReview(selectedReview.review);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesUserId = !filterUserId || review.userId === filterUserId;
    const matchesDate =
      !filterDate ||
      moment(review.timestamp).format("YYYY-MM-DD") === filterDate;
    return matchesUserId && matchesDate;
  });

  // Sort reviews in descending order by timestamp
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Calculate insights
  const totalReviews = filteredReviews.length;
  const overallRating =
    totalReviews > 0
      ? (
          filteredReviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        ).toFixed(1)
      : 0;
  const todayReviews = filteredReviews.filter(
    (review) =>
      moment(review.timestamp).format("YYYY-MM-DD") ===
      moment().format("YYYY-MM-DD")
  ).length;

  return (
    <ChakraProvider>
      <Box p={4}>
        <VStack spacing={6} align="stretch">

          {/* Insights - Use card-like styling */}
          <HStack spacing={4}>
            <Stat
              px={4}
              py={2}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
            >
              <StatLabel>Total Reviews</StatLabel>
              <StatNumber fontSize="2xl">{totalReviews}</StatNumber>
            </Stat>
            <Stat
              px={4}
              py={2}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
            >
              <StatLabel>Overall Rating</StatLabel>
              <StatNumber fontSize="2xl">{overallRating}</StatNumber>
            </Stat>
            <Stat
              px={4}
              py={2}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
            >
              <StatLabel>Today&apos;s Reviews</StatLabel>
              <StatNumber fontSize="2xl">{todayReviews}</StatNumber>
            </Stat>
          </HStack>

          {/* Filters - Group them visually */}
          <Flex
            direction={{ base: "column", md: "row" }} // Stack on mobile, row on larger screens
            alignItems={{ base: "stretch", md: "center" }}
            gap={4}
          >
            <FormControl id="userId" flex={1}>
              <FormLabel>Filter by User ID</FormLabel>
              <Input
                type="text"
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
              />
            </FormControl>
            <FormControl id="date" flex={1}>
              <FormLabel>Filter by Date</FormLabel>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </FormControl>
          </Flex>

          {/* Review Grid - Add subtle hover effect */}
          <Grid templateColumns={`repeat(${numColumns}, 1fr)`} gap={6}>
            {sortedReviews.map((review) => (
              <GridItem key={review.id}>
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  p={4}
                  bg={boxBg} // Use dynamic background color
                  color={textColor} // Use dynamic text color
                  _hover={{ transform: "scale(1.02)", boxShadow: "md" }}
                  transition="all 0.2s"
                >
                  <Flex alignItems="center" mb={2}>
                    <Avatar name={review.name} />
                    <Heading as="h4" size="md" ml={2}>
                      {review.name}
                    </Heading>
                    <IconButton
                      aria-label="View Review"
                      icon={<ViewIcon />}
                      colorScheme="red"
                      size="sm"
                      ml="auto"
                      onClick={() => handleReviewSelect(review)}
                    />
                  </Flex>

                  <Flex alignItems="center" mb={2}>
                    <HStack spacing={1}>
                      {[...Array(review.rating)].map((_, index) => (
                        <StarIcon key={index} color="yellow.500" />
                      ))}
                    </HStack>
                    <Badge
                      ml={2}
                      colorScheme={review.rating >= 4 ? "green" : "red"}
                    >
                      {review.rating}
                    </Badge>
                  </Flex>

                  <Accordion allowToggle mt={2}>
                    <AccordionItem border="none">
                      {" "}
                      {/* Remove default border */}
                      <h2>
                          <AccordionButton
                            _expanded={{ bg: "gray.100", borderRadius: "lg" }}
                          >
                            {" "}
                            {/* Add background on expand */}
                            <Box flex="1" textAlign="left">
                              See Review Details <InfoOutlineIcon ml={2} />{" "}
                              {/* Add icon */}
                            </Box> {/* Add closing tag */}
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                      <AccordionPanel pb={4}>
                        <Text whiteSpace="pre-line"> 
                          {review.review}
                        </Text>
                        <Divider my={2} />
                        <Text fontSize="sm" color="gray.500">
                          {moment(review.timestamp).format("YYYY-MM-DD HH:mm")}
                        </Text>
                        <List spacing={2} mt={2}>
                          <ListItem>
                            <Tooltip label={review.userAgent} placement="top">
                              <Tag size="sm">{review.userAgent}</Tag>
                            </Tooltip>
                          </ListItem>
                          <ListItem>
                            <Tooltip label={review.userId} placement="top">
                              <Tag size="sm">{review.userId}</Tag>
                            </Tooltip>
                          </ListItem>
                          <ListItem>
                            <Tooltip label="Phone Number" placement="top">
                              <Tag size="sm">
                                <PhoneIcon mr={1} />
                                {review.phoneNumber || "N/A"}
                              </Tag>
                            </Tooltip>
                          </ListItem>
                        </List>
                        <Button
                          mt={4}
                          colorScheme="blue"
                          onClick={() => handleReviewSelect(review)}
                        >
                          View Analysis
                        </Button>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Box>
              </GridItem>
            ))}
          </Grid>

          {/* Modal - Redesigned with responsiveness and a cleaner look */}
          <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent
              maxW={{ base: "90%", md: "60%", lg: "40%" }} // Responsive max-width
              borderRadius="xl"
              boxShadow="0px 8px 24px rgba(0, 0, 0, 0.1)"
              bg={boxBg}
              color={textColor}
              p={{ base: 4, md: 6 }} // Responsive padding
            >
              {selectedReview && (
                <>
                  <ModalHeader
                    textAlign="center"
                    fontSize={{ base: "xl", md: "2xl" }} // Responsive font size
                    fontWeight="bold"
                    pb={2}
                  >
                    Review Analysis for {selectedReview.name}
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <VStack spacing={4} align="stretch">
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        mb={2}
                      >
                        <Avatar name={selectedReview.name} size="xl" />
                      </Flex>
                      <Flex
                        alignItems="center"
                        justifyContent="center"
                        mb={2}
                      >
                        {[...Array(selectedReview.rating)].map(
                          (_, index) => (
                            <StarIcon key={index} color="yellow.500" />
                          )
                        )}
                      </Flex>
                      <Text fontSize="lg" textAlign="center">
                        &ldquo;{selectedReview.review}&rdquo;
                      </Text>

                      {!isLoading && !geminiAnalysis && (
                        <Button
                          colorScheme="blue"
                          onClick={handleAnalyzeClick}
                        >
                          Analyze Review
                        </Button>
                      )}

                      {isLoading ? (
                        <Flex
                          justifyContent="center"
                          alignItems="center"
                          height="200px"
                        >
                          <Spinner size="xl" />
                        </Flex>
                      ) : (
                        geminiAnalysis && (
                          <Box overflowY="auto" maxHeight="300px" px={2}>
                            <ReactMarkdown>{geminiAnalysis}</ReactMarkdown>
                          </Box>
                        )
                      )}
                    </VStack>
                  </ModalBody>
                  <ModalFooter justifyContent="center">
                    <Button colorScheme="blue" onClick={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>

        </VStack> {/* End of VStack */}
      </Box>
    </ChakraProvider>
  );
};

export default ReviewTable;
