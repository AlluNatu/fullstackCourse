import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, IconButton, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';


// Props that are must given on the NoteCard
// These help keepup on different components so that user knows that all needed is coming or not coming
interface courseProps {
    id: string,
    courseName: string,
    teacherName: string,
    studyProgram: string,
    likes: string,
    dislikes: string,
    addLike: (id:string) => void
    addDisLike: (id:string) => void
}

const courseCard: React.FC<courseProps> = ({id, courseName, teacherName, studyProgram, likes, dislikes, addLike, addDisLike}) => {
  
  return (
    <Card sx={{
      marginBottom: 2, 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%'
      }}>
    <CardContent>
      <Typography variant='h5'>
          {courseName}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{teacherName}</Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{studyProgram}</Typography>
      
      {/* Like and Dislike buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <IconButton onClick={() => addLike(id)} id='addLike' aria-label="like" size="small">
          <ThumbUpIcon fontSize="inherit" />
          <Typography sx={{ color: 'text.secondary', ml: 0.5 }}>{likes}</Typography>
        </IconButton>
        <IconButton onClick={() => addDisLike(id)} id='addDisLike' aria-label="dislike" size="small">
          <ThumbDownIcon fontSize="inherit" />
          <Typography sx={{ color: 'text.secondary', ml: 0.5 }}>{dislikes}</Typography>
        </IconButton>
      </div>
    </CardContent>
  </Card>
  )
}

export default courseCard