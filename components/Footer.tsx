import { css } from '@emotion/react';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

const footerStyles = css`
  /*   position: relative;
  bottom: 0;
  width: 100%; */
`;

function Footer() {
  return (
    <footer css={footerStyles}>
      <Box bgcolor="text.secondary" color="white">
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={10} sm={4}>
              <Box>Copyright 2022 Timon Jurschitsch</Box>
            </Grid>
            <Grid item xs={10} sm={4}>
              <Box borderBottom={1} marginBottom={2}>
                Contact me!
              </Box>
              <Box justifyContent="space-between">
                <a href="https://www.github.com/DerTimonius" rel="noreferrer">
                  <GitHubIcon />
                </a>
                <a
                  href="https://www.twitter.com/TimoniusCodes"
                  rel="noreferrer"
                >
                  <TwitterIcon />
                </a>
                <a href="mailto:timon.jurschitsch@gmail.com">
                  <EmailIcon />
                </a>
              </Box>
            </Grid>
            {/*             <Grid item xs={12} sm={6}>
              <Box>Copyright 2022 Timon Jurschitsch</Box>
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </footer>
  );
}

export default Footer;
