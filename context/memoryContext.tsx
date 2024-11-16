import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../api";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
interface Memory {
  _id: string;
  title: string;
  content: string;
  images: string[];
  date: string;
  author: string;
}

interface ImageItem {
  uri: string;
  isLocal: boolean;
}

interface MemoryContextType {
  memory: Memory | null;
  setMemory: (memory: Memory | null) => void;
  showToolkit: boolean;
  setShowToolkit: (show: boolean) => void;
  handleFetch: () => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleEdit: (id: string, data: any) => Promise<void>;
  handleLongPress: (id: string) => void;
  handleDetails: (id: string) => void;
  isLoading: boolean;
  selectedMemory: any;
  setSelectedMemory: (memory: any) => void;
  pickImage: () => Promise<void>;
  images: ImageItem[];
  setImages: (images: ImageItem[]) => void;
  addMemory: () => Promise<void>;
}
const MemoryContext = createContext<MemoryContextType>({} as MemoryContextType);

export const MemoryProvider = ({ children }: { children: React.ReactNode }) => {
  const navigation = useNavigation();
  const [memory, setMemory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [showToolkit, setShowToolkit] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);

  //   Fetch memories from API
  const handleFetch = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL + `/memory`);
      setMemory(response.data.data);
      console.log("Fetch success:", response.data);
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  // Delete memory from API
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/memory/${id}`);
      // Immediately update local state
      setMemory((prevMemories: any) =>
        prevMemories.filter((item: any) => item._id !== id)
      );
      setShowToolkit(false);
      setSelectedMemory(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      //   refetch the  memory
      handleFetch();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  //   handle Edit
  //   const handleEdit = (item: any) => {
  //     navigation.navigate("addmemory", { memory: item });
  //   };

  //   handle Long press
  const handleLongPress = (item: any) => {
    setSelectedMemory(item);
    setShowToolkit(true);
  };

  //   handle details navigation
  const handleDetails = (item: any) => {
    navigation.navigate("memorydetails", { memory: item });
  };

  const value = [
    memory,
    setMemory,
    handleFetch,
    handleDelete,
    handleLongPress,
    handleDetails,
    selectedMemory,
    setSelectedMemory,
    isLoading,
    setIsLoading,
    images,
    setImages,
  ];
  return (
    <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>
  );
};

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error("useMemory must be used within a MemoryProvider");
  }
  return context;
};

export default MemoryContext;
