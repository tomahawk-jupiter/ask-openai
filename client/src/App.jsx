import * as React from "react";
import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Box } from "@mui/material";
import FormDialog from "./components/formDialog";
import Post from "./components/post";
import axiosInstance from "./axios.config";
import { posts as mockPosts } from "./mock-data/postsWithComments";
import Header from "./components/header";
import LoadingIcon from "./components/loadingIcon";

export default function MyApp() {
  const [posts, setPosts] = useState(null);
  const [newPostId, setNewPostId] = useState(null);
  const [themeMode, setThemeMode] = useState("dark");
  const [loading, setLoading] = useState(false);

  const darkTheme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  useEffect(() => {
    console.log("1st useEffect ran!");

    try {
      const newPostElement = document.getElementById(newPostId);
      console.log({ newPostElement });
    } catch (err) {
      console.log({ newPostElemErr });
    }

    const getAllPosts = async () => {
      try {
        const res = await axiosInstance.get("/");
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        // Use mock posts if the request fails
        console.log({ getAllPostErr: err });
        setPosts(mockPosts);
      }
    };
    getAllPosts();
  }, [newPostId]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="md" sx={{ paddingBottom: "200px" }}>
        <CssBaseline />

        {loading && <LoadingIcon />}

        <FormDialog setNewPostId={setNewPostId} setLoading={setLoading} />

        <Header setThemeMode={setThemeMode} />

        <div>
          {posts ? (
            <>
              {posts.map((post) => {
                return (
                  <Post
                    key={post._id}
                    id={post._id}
                    question={post.question}
                    answer={post.answer}
                    comments={post.comments}
                    newPostId={newPostId}
                    setNewPostId={setNewPostId}
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
      </Container>
    </ThemeProvider>
  );
}
