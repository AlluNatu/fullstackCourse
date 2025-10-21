import React, { useEffect, useState } from 'react'
import CourseCard  from "./courseItem"
import { TextField, Box, Button, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';


interface IcourseCard {
  _id: string;
  name: string;
  teacher: string;
  subject: string;
  likes: string;
  Dislikes: string;
}

type SortType = 'likesDesc' | 'dislikesDesc' | 'none';

function Home() {
  // Usestates to use later
  const [token, setToken] = useState<string | null>(null);
  const [items, setItems] = useState<IcourseCard[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortType>('none');
  const [itemsToShow, setItemsToShow] = useState<number>(10);

  // Check if token is there rightaway. If not go back to login LOGIN CHECK
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      window.location.href = '/login'
      return
    }
    setToken(storedToken)
  }, []);

  useEffect(() => {
    if (!token) return
    else {
      fetch('http://localhost:3001/api/getCourses', {
        headers: {
          'Content-Type': 'application/json',
          method: "GET",
          'Authorization': `Bearer ${token}`
        }})
        .then((res) => res.json()).then((data) => {
        console.log(data);
        if (data.error) {
          window.location.href = '/login'
        } else {
          setItems(data.courseList)
          console.log(data);
          
        }
      })
  }
  }, [token]);

    function addLike (id: string) {
        setItems(prev =>
            prev.map(item =>
                item._id === id
                    ? { ...item, likes: (parseInt(item.likes) + 1).toString() }
                        : item
                        )
                    );
        console.log(id);
        fetch('http://localhost:3001/api/addLike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
        },
            body: JSON.stringify({id})
        ,})
        .then((res) => res.json()).then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error adding like:', error);
        })
    }

    function addDisLike (id: string) {
                setItems(prev =>
            prev.map(item =>
                item._id === id
                    ? { ...item, Dislikes: (parseInt(item.Dislikes) + 1).toString() }
                        : item
                        )
                    );
        console.log(id);
        fetch('http://localhost:3001/api/addDisLike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({id})
        ,})
        .then((res) => res.json()).then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error adding dislike:', error);
        })
    }

    // Filter and sort items
    const getFilteredAndSortedItems = () => {
        // First filter by search query
        let filtered = items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subject.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Then sort
        if (sortBy === 'likesDesc') {
            filtered = [...filtered].sort((a, b) => parseInt(b.likes) - parseInt(a.likes));
        } else if (sortBy === 'dislikesDesc') {
            filtered = [...filtered].sort((a, b) => parseInt(b.Dislikes) - parseInt(a.Dislikes));
        }

        return filtered;
    };

    const filteredItems = getFilteredAndSortedItems();
    const displayedItems = filteredItems.slice(0, itemsToShow);

  return (
    <>
      {/* Search Input */}
      <TextField
        fullWidth
        label="Search courses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 2 }}
        placeholder="Search by course name, teacher, or subject"
      />

      {/* Sort Buttons and Items to Show */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', marginBottom: 2 }}>
        <Button 
          onClick={() => setSortBy('none')}
        >
          Default
        </Button>
        <Button 
          onClick={() => setSortBy('likesDesc')}
        >
          Most Liked
        </Button>
        <Button 
          onClick={() => setSortBy('dislikesDesc')}
        >
          Most Disliked
        </Button>
      </Box>

      {/* Items to Show Dropdown */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="itemsInputLabel">Show</InputLabel>
          <Select
            labelId="itemsInputLabel"
            id="items-to-show"
            value={itemsToShow}
            label="Show"
            onChange={(e) => setItemsToShow(e.target.value as number)}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={filteredItems.length}>All</MenuItem>
          </Select>
        </FormControl>
          <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{"Showing " + displayedItems.length + " of " + filteredItems.length + " courses"}</Typography>

    {filteredItems.length === 0 ? (
      <Typography sx={{ padding: 2, textAlign: 'center', color: 'text.secondary' }}>
        No courses found
      </Typography>
    ) : (
      displayedItems.map((item: IcourseCard) => (
                  <CourseCard key={item._id}
                    id={item._id}
                    courseName={item.name}
                    teacherName={item.teacher}
                    studyProgram={item.subject}
                    likes={item.likes}
                    dislikes={item.Dislikes}
                    addLike={addLike}
                    addDisLike={addDisLike}
    />))
    )}
  </>
  )}

export default Home