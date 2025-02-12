import {Image, View, Text, TouchableOpacity} from 'react-native';

const CategoryCard = ({ category, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className="relative h-48 aspect-square w-40 mr-4 overflow-hidden rounded-2xl"
    >
      <Image
        source={{uri : category.image}}
        className="absolute w-full h-full"
        style={{ resizeMode: "cover" }}
      />
      <View className="absolute inset-0 bg-black/40" />
      <Text className="absolute bottom-4 left-4 text-white font-bold text-lg">
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  export default CategoryCard;