import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import { Modal, TouchableOpacity, View, Text } from "react-native";
import { useMemory } from "../../context/memoryContext";

export const ToolkitModal = () => {
  const {
    memory,

    handleDelete,
    selectedMemory,

    showToolkit,
    setShowToolkit,

    isLoading,
  } = useMemory();
  return (
    <Modal
      transparent
      visible={showToolkit}
      animationType="fade"
      onRequestClose={() => setShowToolkit(false)}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        activeOpacity={1}
        onPress={() => setShowToolkit(false)}
      >
        <MotiView
          from={{ translateY: 100, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          className="absolute bottom-0 w-full bg-[#252525] rounded-t-3xl overflow-hidden"
        >
          <View className="p-4">
            <View className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />

            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-700"
              onPress={() => {
                // handleEdit(selectedMemory);
                setShowToolkit(false);
              }}
            >
              <Feather name="edit-2" size={24} color="white" />
              <Text className="text-white text-lg ml-3">Edit Memory</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-700"
              onPress={() => {
                setShowToolkit(false);
              }}
            >
              <Feather name="share-2" size={24} color="white" />
              <Text className="text-white text-lg ml-3">Share Memory</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4"
              onPress={() => {
                handleDelete(selectedMemory._id);
                setShowToolkit(false);
              }}
            >
              <Feather name="trash-2" size={24} color="#ef4444" />
              <Text className="text-red-500 text-lg ml-3">Delete Memory</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </TouchableOpacity>
    </Modal>
  );
};
