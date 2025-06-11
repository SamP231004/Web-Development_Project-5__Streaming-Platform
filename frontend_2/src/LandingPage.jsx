import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import { keyframes } from '@emotion/react';
import { color, transform } from 'framer-motion';

const slithyArcLeft = keyframes`
    0% { transform: translate(calc(50vw - 200px), 110vh) scale(0.4) rotateZ(0deg) skewY(0deg); opacity: 0; }
    10% { opacity: 1; }
    40% { transform: translate(calc(50vw - 200px), 70vh) scale(0.8) rotateZ(0deg) skewY(0deg); opacity: 1; }
    55% { transform: translate(calc(50vw - 200px), 50vh) scale(1) rotateZ(0deg) skewY(0deg); }
    90% { transform: translate(calc(-10vw - 200px), -10vh) scale(0.6) rotateZ(-15deg) skewY(-5deg); opacity: 1; }
    100% { transform: translate(calc(-30vw - 200px), -60vh) scale(0.4) rotateZ(-15deg) skewY(-5deg); opacity: 0; }
`;

const slithyArcRight = keyframes`
    0% { transform: translate(calc(50vw - 200px), 110vh) scale(0.4) rotateZ(0deg) skewY(0deg); opacity: 0; }
    10% { opacity: 1; }
    40% { transform: translate(calc(50vw - 200px), 70vh) scale(0.8) rotateZ(0deg) skewY(0deg); opacity: 1; }
    55% { transform: translate(calc(50vw - 200px), 50vh) scale(1) rotateZ(0deg) skewY(0deg); }
    90% { transform: translate(calc(110vw - 200px), -10vh) scale(0.6) rotateZ(15deg) skewY(5deg); opacity: 1; }
    100% { transform: translate(calc(130vw - 200px), -60vh) scale(0.4) rotateZ(15deg) skewY(5deg); opacity: 0; }
`;

const RootContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '1000px',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    overflow: 'hidden',

    '&::before': {
        content: "''",
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
}));

const ContentOverlay = styled(Box)(({ theme }) => ({
    top: '7vh',
    display: 'block',
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    background: 'rgba(0, 0, 0, 0.75)',
    padding: '50px 70px',
    borderRadius: '25px',
    boxShadow: '0 0 25px rgba(0, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    maxWidth: '900px',
    margin: '20px',
    border: '1px solid rgba(0, 255, 255, 0.4)',
    [theme.breakpoints.down('md')]: {
        padding: '30px 40px',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '20px 25px',
        margin: '15px',
    },
}));

const Tagline = styled(Typography)(({ theme }) => ({
    // fontFamily: 'Roboto, sans-serif', 
    fontSize: '2.2em',
    color: '#aaffff',
    marginBottom: '30px',
    letterSpacing: '1px',
    textShadow: '0 0 5px rgba(0, 255, 255, 0.5)',

    [theme.breakpoints.down('lg')]: {
        fontSize: '1.4em',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '1.2em',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '1em',
        marginBottom: '20px',
    },
}));

const Description = styled(Typography)(({ theme }) => ({
    fontSize: '1.4em',
    lineHeight: 1.8,
    marginBottom: '50px',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#e0f7fa',

    [theme.breakpoints.down('lg')]: {
        fontSize: '1.2em',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '1.1em',
        marginBottom: '40px',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '1em',
        marginBottom: '30px',
    },
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',

    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: '15px',
    },
}));

const CtaButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#ff4500',
    color: theme.palette.common.white,
    padding: '5px 10px',
    height: 'fit-content',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
    boxShadow: `0 5px 15px rgba(255, 69, 0, 0.6)`,
    textTransform: 'uppercase',
    letterSpacing: '1px',

    '&:hover': {
        backgroundColor: '#e03c00',
        transform: 'translateY(-3px)',
        boxShadow: `0 8px 20px rgba(255, 69, 0, 0.9)`,
    },

    [theme.breakpoints.down('md')]: {
        padding: '15px 30px',
        fontSize: '1.1em',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '12px 25px',
        fontSize: '1em',
        width: '100%',
    },
}));

const SecondaryButton = styled(CtaButton)(({ theme }) => ({
    backgroundColor: 'transparent',
    border: `2px solid ${theme.palette.warning.main}`,
    color: theme.palette.warning.main,
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: 'rgba(255, 69, 0, 0.1)',
        transform: 'translateY(-3px)',
        boxShadow: `0 3px 10px rgba(255, 69, 0, 0.3)`,
    },
}));

const VideoAnimationWrapper = styled(Box)({
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 2,
});

const VideoItem = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: '450px',
    height: '253px',
    backgroundColor: 'rgba(0, 255, 255, 0.08)',
    border: '2px solid rgba(0, 255, 255, 0.3)',
    boxShadow: '0 0 25px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.2)',
    borderRadius: '15px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transformOrigin: 'center center',
    transition: 'box-shadow 0.3s ease',

    '& video': {
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    '&:nth-of-type(1)': { animation: `${slithyArcLeft} 12s linear infinite`, animationDelay: '0s' },
    '&:nth-of-type(2)': { animation: `${slithyArcRight} 12s linear infinite`, animationDelay: '2s' },
    '&:nth-of-type(3)': { animation: `${slithyArcLeft} 12s linear infinite`, animationDelay: '4s' },
    '&:nth-of-type(4)': { animation: `${slithyArcRight} 12s linear infinite`, animationDelay: '6s' },
    '&:nth-of-type(5)': { animation: `${slithyArcLeft} 12s linear infinite`, animationDelay: '8s' },
    '&:nth-of-type(6)': { animation: `${slithyArcRight} 12s linear infinite`, animationDelay: '10s' },
    animationIterationCount: 'infinite',
    animationFillMode: 'forwards',
}));

const LandingPage = ({ onLogin, onRegister }) => {
    return (
        <RootContainer>
            <VideoAnimationWrapper>
                <VideoItem><video src="https://res.cloudinary.com/duuwv0a2h/video/upload/v1/video1_i7eu0f" autoPlay loop muted playsInline></video></VideoItem>
                <VideoItem><video src="https://res.cloudinary.com/duuwv0a2h/video/upload/v1/video2_ahitoy" autoPlay loop muted playsInline></video></VideoItem>
                <VideoItem><video src="https://res.cloudinary.com/duuwv0a2h/video/upload/v1/video3_dmscvt" autoPlay loop muted playsInline></video></VideoItem>
                <VideoItem><video src="https://res.cloudinary.com/duuwv0a2h/video/upload/v1/video4_ar021k" autoPlay loop muted playsInline></video></VideoItem>
                <VideoItem><video src="https://res.cloudinary.com/duuwv0a2h/video/upload/v1/video5_sn7rsr" autoPlay loop muted playsInline></video></VideoItem>
                <VideoItem><video src="https://res.cloudinary.com/duuwv0a2h/video/upload/v1/video6_n3pdrq" autoPlay loop muted playsInline></video></VideoItem>
            </VideoAnimationWrapper>
            <ContentOverlay>
                <Tagline variant="h1">StreamingPlatform: <br /> Where Every Frame Tells a Story</Tagline>
                <Description variant="body1">
                    Stream your favorite series, films, and documentaries. Unmatched visual and audio quality, right at your fingertips.
                </Description>
                <ButtonContainer>
                    <CtaButton onClick={onLogin}>Login</CtaButton>
                    <SecondaryButton onClick={onRegister}>Register Now</SecondaryButton>
                </ButtonContainer>
            </ContentOverlay>
        </RootContainer>
    );
};

export default LandingPage;