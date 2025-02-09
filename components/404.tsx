import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFoundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #e0e5ec;
`;

const NeumorphicBox = styled.div`
  padding: 4rem 6rem;
  border-radius: 50px;
  background: #e0e5ec;
  box-shadow: 20px 20px 60px #bebebe,
              -20px -20px 60px #ffffff;
  text-align: center;
  @media (max-width: 768px) {
    padding: 2rem 3rem;
    margin: 1rem;
  }
`;

const Heading = styled.h1`
  font-size: 8rem;
  margin: 0;
  color: text-gray-800;
  text-shadow: 2px 2px 4px rgba(163, 177, 198, 0.6);
`;

const Message = styled.p`
  font-size: 1.5rem;
  margin: 1rem 0 2rem;
  color: #4a5568;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 15px;
  background: #e0e5ec;
  box-shadow: 5px 5px 10px #bebebe,
              -5px -5px 10px #ffffff;
  color: #4a5568;
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    box-shadow: inset 5px 5px 10px #bebebe,
                inset -5px -5px 10px #ffffff;
  }

  &:active {
    box-shadow: inset 2px 2px 5px #bebebe,
                inset -2px -2px 5px #ffffff;
  }
`;

export const NotFound = () => {
  return (
    <NotFoundContainer>
      <NeumorphicBox>
        <Heading>404</Heading>
        <Message>Lost in the shadows? Let's get you back home.</Message>
        <HomeButton to="/">Illuminate My Path</HomeButton>
      </NeumorphicBox>
    </NotFoundContainer>
  );
};