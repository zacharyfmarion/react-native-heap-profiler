import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './Text';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  title,
  disabled,
  onPress,
}: ButtonProps) => {
  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          disabled && { backgroundColor: 'grey', opacity: 0.5 },
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#99FFFF',
    flexShrink: 0,
    width: '100%',
    padding: 10,
    borderRadius: 5,
    alignContent: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
});
