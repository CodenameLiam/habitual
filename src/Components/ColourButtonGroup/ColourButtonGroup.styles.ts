import styled from '@emotion/native';
import { TouchableOpacity } from 'react-native';

export const Container = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

interface ButtonContainerProps {
    width: number;
    backgroundColour: string;
}

export const ButtonContainer = styled.View<ButtonContainerProps>`
    background-color: ${(props) => props.backgroundColour + '50'};
    width: ${(props) => props.width + '%'};
    border-radius: 5px;
`;

export const TextContainer = styled(TouchableOpacity)`
    padding: 8px;
`;

interface TextContentProps {
    colour: string;
}

export const TextContent = styled.Text<TextContentProps>`
    text-align: center;
    font-family: Montserrat_600SemiBold;
    color: ${(props) => props.colour};
`;
