import {
    View,
    SafeAreaView,
    FlatList,
    StatusBar,
  } from "react-native";
  import Header from "@/components/Header";
  import TicketCard from "@/components/Ticket";
  
  // Types for our ticket data
  interface Child {
    firstName: string;
    lastName: string;
    gender: string;
    dob: Date;
  }
  
  interface Event {
    _id: string;
    title: string;
    imageUrl: string;
  }
  
  interface ITicketItem {
    _id: string;
    event: Event;
    totalAmount: number;
    createdAt: string;
    child: Child;
  }
  
  const TicketsScreen = () => {
    // Sample data matching our ticket interface
    const tickets: ITicketItem[] = [
      {
        _id: "1",
        event: {
          _id: "evt1",
          title: "Kids Business Fest",
          imageUrl: "https://utfs.io/f/b674ee57-d004-4302-a458-456ff196e13a-ng6bfi.jpg.webp",
        },
        totalAmount: 1500,
        createdAt: "2025-03-01T11:00:00.000Z",
        child: {
          firstName: "John",
          lastName: "Doe",
          gender: "Male",
          dob: new Date("2015-05-15"),
        },
      },
      {
        _id: "2",
        event: {
          _id: "evt2",
          title: "Robotics Workshop",
          imageUrl: "https://utfs.io/f/a6fc5c10-472b-42d9-b4da-f3e831c12af5-m57ly8.webp",
        },
        totalAmount: 2000,
        createdAt: "2025-02-25T14:30:00.000Z",
        child: {
          firstName: "Jane",
          lastName: "Doe",
          gender: "Female",
          dob: new Date("2014-08-20"),
        },
      },
    ];
  
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />
        <Header title="My Tickets" />
        <FlatList
          data={tickets}
          renderItem={({ item }) => (
            <TicketCard ticket={item} />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  };
  
  export default TicketsScreen;