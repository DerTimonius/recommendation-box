import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
// import Grid from '@mui/material/Grid';
import MUILink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { TrendingMovieType } from '../pages/api/movies';

type Props = {
  movie: TrendingMovieType;
};

export default function TrendingCard({ movie }: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card>
      <CardMedia
        component="img"
        height={250}
        image={`https://image.tmdb.org/t/p/original${movie.backdrop}`}
      />
      <CardContent>
        {movie.title !== movie.originalTitle ? (
          <>
            <Typography variant="h5">{movie.originalTitle}</Typography>
            <Typography variant="subtitle1">{movie.title}</Typography>
          </>
        ) : (
          <Typography variant="h5">{movie.title}</Typography>
        )}
      </CardContent>
      <CardActions>
        <MUILink
          href={`https://www.themoviedb.org/${movie.media}/${movie.id}`}
          target="_blank"
          rel="noreferrer"
          underline="hover"
        >
          Learn more...
        </MUILink>
        <ExpandMoreIcon
          onClick={() => setExpanded(!expanded)}
          sx={{ rotate: expanded ? '180deg' : '0deg', marginLeft: 'auto' }}
        />
      </CardActions>
      <Collapse in={expanded} timeout="auto">
        <CardContent>
          <Typography variant="body1">{movie.overview}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
