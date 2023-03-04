import * as React from "react";
import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Box, Alert } from "@mui/material";
import FormDialog from "./components/formDialog";
import Post from "./components/post";
import axiosInstance from "./axios.config";
import { posts as mockPosts } from "./mock-data/postsWithComments";
import Header from "./components/header";
import LoadingIcon from "./components/loadingIcon";
import FlashMessageDelete from "./components/flashMessageDelete";

export default function MyApp() {
  const [posts, setPosts] = useState(null);
  const [newPostId, setNewPostId] = useState(null);
  const [themeMode, setThemeMode] = useState("dark");
  const [loading, setLoading] = useState(false);
  const [mockMode, setMockMode] = useState(false);
  const [delPostId, setDelPostId] = useState(null);
  const [flash, setFlash] = useState(false);

  const darkTheme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  useEffect(() => {
    setLoading(false);

    if (posts) {
      const filteredPosts = posts.filter((p) => p._id != delPostId);
      setPosts(filteredPosts);
    }
  }, [delPostId, newPostId]);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const res = await axiosInstance.get("/");
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        // Use mock posts if the request fails
        setPosts(mockPosts);
        setMockMode(true); //
      }
    };
    getAllPosts();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="md" sx={{ paddingBottom: "200px" }}>
        <CssBaseline />

        {loading && <LoadingIcon />}

        <FormDialog
          mockMode={mockMode}
          posts={posts}
          setPosts={setPosts}
          setNewPostId={setNewPostId}
          setLoading={setLoading}
        />

        <Header setThemeMode={setThemeMode} />

        {mockMode && (
          <Alert severity="error">
            Api isn't responding, started in mock mode!
          </Alert>
        )}

        <div>
          {posts ? (
            <>
              {posts.map((post) => {
                return (
                  <Post
                    key={post._id}
                    id={post._id}
                    question={post.question}
                    answer={post.answer.trim()}
                    comments={post.comments}
                    newPostId={newPostId}
                    setNewPostId={setNewPostId}
                    delPostId={delPostId}
                    setDelPostId={setDelPostId}
                    setFlash={setFlash}
                  />
                );
              })}
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                padding: "1rem",
              }}
            >
              <LoadingIcon />
            </Box>
          )}
        </div>

        <FlashMessageDelete
          flash={flash}
          setFlash={setFlash}
          message="Post deleted!"
          type="success"
        />
      </Container>
    </ThemeProvider>
  );
}
